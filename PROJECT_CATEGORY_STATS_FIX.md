# Project Issues - Category & Stats Fix

## Issue 1: Category Always Shows "mobile"

### Problem
When editing a project, the category dropdown always shows "mobile" even when you select "Ed-Tech" or another category.

### Root Cause
The Project model has `default='mobile'` which is being used when the category value is empty or not properly saved.

### Solution

#### Backend Fix (Optional - Remove Default)
**File:** `account/models.py` (Line 78)

**Current:**
```python
category = models.CharField(max_length=100, blank=True, choices=CATEGORY_CHOICES, default='mobile')
```

**Better (No default):**
```python
category = models.CharField(max_length=100, blank=True, choices=CATEGORY_CHOICES)
```

This way, if no category is selected, it will be empty instead of defaulting to "mobile".

#### Frontend Fix (Critical)
**File:** `temp_page.tsx`

The issue is likely in the ProjectModal component. When loading a project for editing, the category value might not be properly initialized.

**Find the ProjectModal state initialization** (around line 1788):
```typescript
const [localProject, setLocalProject] = useState<Partial<Project>>(() => {
  if (isEdit && project) {
    return {
      ...project,
      // Make sure category is included
      category: project.category || 'mobile',  // This might be the issue
      ...
    };
  }
  return { category: 'mobile', ... };
});
```

**Fix:**
```typescript
const [localProject, setLocalProject] = useState<Partial<Project>>(() => {
  if (isEdit && project) {
    return {
      ...project,
      category: project.category,  // Don't override with default
      ...
    };
  }
  return { category: 'mobile', ... };  // Only default for NEW projects
});
```

**Also check the category dropdown** (search for "category" in ProjectModal):
```typescript
<select
  value={localProject.category}  // Make sure this is correct
  onChange={(e) => setLocalProject({ ...localProject, category: e.target.value })}
>
  {projectCategories.map((cat) => (
    <option key={cat} value={cat}>
      {categoryLabels[cat]}
    </option>
  ))}
</select>
```

---

## Issue 2: Key Metrics (Stats) Not Showing

### Problem
The "Key Metrics" or "stats" field is not displaying on localhost when testing projects.

### Root Cause
The `stats` field in the Project model is a `JSONField` with `default=dict`, but the frontend might be expecting a different format or not rendering it correctly.

### Backend Check
**File:** `account/models.py` (Line 95)
```python
stats = models.JSONField(default=dict, blank=True)
```

This should store stats as:
```json
{
  "Users": "10K+",
  "Revenue": "$1M",
  "Growth": "200%"
}
```

### Frontend Fix

#### 1. Check Project Interface
**File:** `temp_page.tsx` (around line 174)

**Current:**
```typescript
interface Project {
  ...
  stats: Record<string, string>;  // Should be an object
  ...
}
```

This is correct. Stats should be a key-value object.

#### 2. Check ProjectModal Stats Input

The ProjectModal should have a section for adding stats. **Search for "stats" in temp_page.tsx**.

You should have something like:
```typescript
// Stats state
const [statsList, setStatsList] = useState<{ key: string; value: string }[]>([]);

// Convert stats object to array for editing
useEffect(() => {
  if (isEdit && project.stats) {
    const statsArray = Object.entries(project.stats).map(([key, value]) => ({
      key,
      value: value as string
    }));
    setStatsList(statsArray);
  }
}, [isEdit, project]);

// Add stat
const addStat = () => {
  setStatsList([...statsList, { key: '', value: '' }]);
};

// Remove stat
const removeStat = (index: number) => {
  setStatsList(statsList.filter((_, i) => i !== index));
};

// Update stat
const updateStat = (index: number, field: 'key' | 'value', value: string) => {
  const updated = [...statsList];
  updated[index][field] = value;
  setStatsList(updated);
};
```

#### 3. Stats Input UI

**Add this to the ProjectModal** (in the appropriate tab):
```typescript
<div>
  <div className="flex items-center justify-between mb-2">
    <Label>Key Metrics</Label>
    <Button type="button" onClick={addStat} size="sm" variant="outline">
      <Plus className="w-4 h-4 mr-1" />
      Add Metric
    </Button>
  </div>
  
  <div className="space-y-2">
    {statsList.map((stat, index) => (
      <div key={index} className="flex gap-2">
        <Input
          placeholder="Metric name (e.g., Users)"
          value={stat.key}
          onChange={(e) => updateStat(index, 'key', e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Value (e.g., 10K+)"
          value={stat.value}
          onChange={(e) => updateStat(index, 'value', e.target.value)}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => removeStat(index)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ))}
    
    {statsList.length === 0 && (
      <p className="text-sm text-gray-500">No metrics added yet</p>
    )}
  </div>
</div>
```

#### 4. Save Stats Correctly

When saving the project, convert the stats array back to an object:

```typescript
const handleSave = () => {
  // Convert statsList array to object
  const statsObj: Record<string, string> = {};
  statsList.forEach((stat) => {
    if (stat.key && stat.key.trim()) {
      statsObj[stat.key.trim()] = stat.value;
    }
  });
  
  const projectData = {
    ...localProject,
    stats: statsObj,  // Save as object
  };
  
  onSave(projectData);
};
```

---

## Quick Test

### Test Category Fix:
1. Edit a project
2. Change category to "Ed-Tech"
3. Save
4. Edit again
5. Category should show "Ed-Tech", not "mobile"

### Test Stats Fix:
1. Edit a project
2. Add key metrics:
   - Key: "Users", Value: "10K+"
   - Key: "Revenue", Value: "$1M"
3. Save
4. Check the project detail page - stats should display
5. Edit again - stats should be retained

---

## Debug Steps

### For Category Issue:
1. Open browser DevTools Console
2. Edit a project
3. Check `console.log(localProject.category)` - what does it show?
4. Change category dropdown
5. Check again - did it update?
6. Save
7. Check the network request - what category value is being sent?

### For Stats Issue:
1. Check if the stats input fields exist in the ProjectModal
2. If not, add them using the code above
3. Check the network request when saving - is stats being sent?
4. Check the backend response - is stats being saved?
5. Check the project detail page - is stats being displayed?

---

## Files to Check/Modify

1. **`temp_page.tsx`**
   - ProjectModal component (around line 1788)
   - Category dropdown
   - Stats input section
   - handleSave function

2. **`account/models.py`** (Optional)
   - Line 78: Remove `default='mobile'` from category field

3. **`src/WebSite/ClientPage1/Projects/Projects.js`** (If stats not showing on public page)
   - Check how stats are being rendered
   - Make sure it's reading from `project.stats`

---

## Expected Behavior

### Category:
- **New Project**: Defaults to "mobile"
- **Edit Project**: Shows the saved category value
- **After Save**: Retains the selected category

### Stats:
- **Input**: Key-value pairs (e.g., "Users" → "10K+")
- **Storage**: JSON object `{"Users": "10K+", "Revenue": "$1M"}`
- **Display**: Shows all metrics on the project detail page
- **Edit**: Loads existing metrics for editing

---

## Status

- 🔲 Category dropdown fix (needs frontend update)
- 🔲 Stats input UI (needs to be added/verified)
- 🔲 Stats save/load logic (needs to be verified)
- 🔲 Stats display on public page (needs to be verified)

Apply these fixes and the issues should be resolved!
