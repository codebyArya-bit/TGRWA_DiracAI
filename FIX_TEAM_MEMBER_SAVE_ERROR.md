# Fix: Team Member Save Error

## Problem
Error when saving team member: `{}`
- Empty error response from backend
- Suggests authentication or validation issue

## Root Causes

### 1. Authentication Required
The TeamMemberViewSet requires authentication for POST/PUT/PATCH:
```python
def get_permissions(self):
    if self.request.method == 'GET':
        return [AllowAny()]
    return [IsAuthenticated()]  # ← Requires auth token
```

### 2. Possible Missing Fields
Check if all required fields are being sent.

## Solution

### Fix 1: Ensure Auth Token is Sent

In your `handleSaveTeamMember` function, make sure you include the auth token:

```typescript
const handleSaveTeamMember = async (memberData: any) => {
  try {
    const url = memberData.id 
      ? `${API_URL}/api/team/${memberData.id}/`
      : `${API_URL}/api/team/`;
    
    const method = memberData.id ? 'PATCH' : 'POST';
    
    // Get auth token from your auth context/storage
    const token = localStorage.getItem('access_token'); // or from context
    
    const res = await fetch(url, {
      method,
      headers: {
        'Authorization': `JWT ${token}`,  // ← ADD THIS
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memberData),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Team member saved:", data);
      // Refresh team members list
      fetchTeamMembers();
    } else {
      const errorData = await res.json();
      console.error("Failed to save team member:", errorData);
      
      // Better error message
      const errorMsg = errorData.detail 
        || Object.values(errorData).flat().join(', ')
        || "Unknown error";
      
      alert(`Failed to save team member: ${errorMsg}`);
    }
  } catch (error) {
    console.error("Network error:", error);
    alert("Network error. Check if backend is running.");
  }
};
```

### Fix 2: Use FormData for Image Upload

If you're uploading an image, use FormData instead of JSON:

```typescript
const handleSaveTeamMember = async (memberData: any) => {
  try {
    const url = memberData.id 
      ? `${API_URL}/api/team/${memberData.id}/`
      : `${API_URL}/api/team/`;
    
    const method = memberData.id ? 'PATCH' : 'POST';
    const token = localStorage.getItem('access_token');
    
    // If there's an image file, use FormData
    const hasFile = memberData.image instanceof File;
    
    let body;
    let headers: any = {
      'Authorization': `JWT ${token}`,
    };
    
    if (hasFile) {
      // Use FormData for file upload
      const formData = new FormData();
      Object.keys(memberData).forEach(key => {
        if (memberData[key] !== null && memberData[key] !== undefined) {
          if (key === 'skills' || key === 'achievements') {
            formData.append(key, JSON.stringify(memberData[key]));
          } else {
            formData.append(key, memberData[key]);
          }
        }
      });
      body = formData;
      // Don't set Content-Type for FormData - browser sets it automatically
    } else {
      // Use JSON for no file upload
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(memberData);
    }
    
    const res = await fetch(url, {
      method,
      headers,
      body,
    });

    if (res.ok) {
      const data = await res.json();
      toast({
        title: "Success!",
        description: "Team member saved successfully",
      });
      fetchTeamMembers();
    } else {
      const errorData = await res.json();
      console.error("Failed to save team member:", errorData);
      
      // Parse error messages
      const errorMsg = errorData.detail 
        || Object.entries(errorData).map(([k, v]) => `${k}: ${v}`).join(', ')
        || "Unknown error";
      
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error("Network error:", error);
    toast({
      title: "Network Error",
      description: "Could not connect to server",
      variant: "destructive",
    });
  }
};
```

### Fix 3: Check Required Fields

Ensure these fields are always included:
```typescript
const memberData = {
  name: "Required",
  role: "Required",
  status: "Active",  // or "Alumni"
  member_type: "employee",  // or "founder", "executive", "alumni"
  department: "",  // optional
  location: "",  // optional
  bio: "",  // optional
  // ... other fields
};
```

## Quick Test

Test the endpoint directly:
```bash
# Get auth token first (login)
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}'

# Use the token to create team member
curl -X POST http://127.0.0.1:8000/api/team/ \
  -H "Authorization: JWT YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Member","role":"Developer","status":"Active","member_type":"employee"}'
```

## Common Issues

1. **Empty `{}`** → Missing or invalid auth token
2. **401 Unauthorized** → Token expired or invalid
3. **400 Bad Request** → Missing required fields or validation error
4. **500 Server Error** → Backend exception (check Django logs)

## Check Backend Logs

Look at your Django terminal where `manage.py runserver` is running to see the actual error.

---

**Most likely fix**: Add the Authorization header with JWT token to all team member save requests.
