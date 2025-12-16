# 🔧 Troubleshooting: Product Update Failed (500) & lucide-react

## ✅ Issue 1: lucide-react - FIXED

**Problem:** `lucide-react` package was missing

**Solution:** Installed with:
```bash
npm install lucide-react --legacy-peer-deps
```

**Status:** ✅ RESOLVED

---

## ⚠️ Issue 2: Product Update Failed (500)

**Problem:** Backend returns 500 error when trying to update a product

### Common Causes of 500 Error:

#### 1. **Backend Not Running**
Check if your Django backend is running:
```bash
# Check if backend is running
curl http://127.0.0.1:8000/api/products/

# Or in PowerShell
Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/products/"
```

**Solution:** Start the backend:
```bash
cd C:\Users\Oppen\OneDrive\Desktop\DiracAI-Backend\TGRWA_DiracAI-main
.\.venv_win_...\Scripts\activate
python manage.py runserver
```

#### 2. **Database Migration Issues**
The Product model might have changed but migrations weren't run.

**Solution:**
```bash
python manage.py makemigrations
python manage.py migrate
```

#### 3. **File Upload Issues**
If you're uploading images, the backend might not be configured to handle file uploads.

**Check:** Does your update include file uploads (images)?

**Solution:** Ensure your backend API accepts `multipart/form-data`:
```python
# In your Django view
@api_view(['PATCH', 'PUT'])
def update_product(request, pk):
    try:
        product = Product.objects.get(pk=pk)
        
        # Handle file uploads
        if 'cover' in request.FILES:
            product.cover = request.FILES['cover']
        
        # Handle JSON data
        data = request.data
        for key, value in data.items():
            if key != 'cover':  # Skip file fields
                setattr(product, key, value)
        
        product.save()
        return Response(ProductSerializer(product).data)
    except Exception as e:
        print(f"Error updating product: {str(e)}")  # Log the error
        return Response({'error': str(e)}, status=500)
```

#### 4. **Frontend Sending Wrong Data Format**
The frontend might be sending data in the wrong format.

**Check your update function in `temp_page.tsx`:**

```typescript
// ❌ WRONG - Sending JSON when backend expects FormData
const updateProduct = async (id, data) => {
  const response = await fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',  // ❌ Wrong for file uploads
    },
    body: JSON.stringify(data),
  });
};

// ✅ CORRECT - Sending FormData for file uploads
const updateProduct = async (id, data) => {
  const formData = new FormData();
  
  // Add all fields to FormData
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      if (Array.isArray(data[key])) {
        formData.append(key, JSON.stringify(data[key]));
      } else if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    }
  });
  
  const response = await fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
    method: 'PATCH',
    body: formData,  // ✅ No Content-Type header - browser sets it automatically
  });
};
```

#### 5. **Missing Required Fields**
The backend might require certain fields that aren't being sent.

**Solution:** Check your Product model for required fields:
```python
# In models.py
class Product(models.Model):
    name = models.CharField(max_length=200)  # Required
    category = models.CharField(max_length=100)  # Required
    # ... other fields
```

Make sure your frontend sends all required fields.

#### 6. **CORS Issues**
If backend and frontend are on different ports, CORS might be blocking the request.

**Solution:** Add CORS headers in Django:
```python
# settings.py
INSTALLED_APPS = [
    # ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ... other middleware
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

---

## 🔍 Debugging Steps

### Step 1: Check Backend Logs
Look at your Django terminal where the backend is running. You should see error details.

### Step 2: Check Browser Console
Open browser DevTools (F12) → Console tab
Look for:
- Network errors
- Request payload
- Response details

### Step 3: Check Network Tab
Browser DevTools → Network tab → Find the failed request
- Check Request Headers
- Check Request Payload
- Check Response

### Step 4: Test with Postman/cURL
Test the API directly:

```bash
# Test GET (should work)
curl http://127.0.0.1:8000/api/products/

# Test PATCH (update)
curl -X PATCH http://127.0.0.1:8000/api/products/1/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Product Name"}'
```

---

## 🛠️ Quick Fixes

### Fix 1: Restart Backend
```bash
# Stop the backend (Ctrl+C)
# Then restart:
python manage.py runserver
```

### Fix 2: Clear Browser Cache
- Press Ctrl+Shift+Delete
- Clear cache
- Reload page (Ctrl+F5)

### Fix 3: Check Backend URL
Make sure the API URL in your frontend matches your backend:

```typescript
// In temp_page.tsx
const API_URL = "http://127.0.0.1:8000";  // ✅ Correct
// NOT:
const API_URL = "http://localhost:8000";  // ⚠️ Might cause issues
```

### Fix 4: Add Error Logging
Add console.log to see what's being sent:

```typescript
const updateProduct = async (id, data) => {
  console.log('Updating product:', id);
  console.log('Data being sent:', data);
  
  try {
    const response = await fetch(`${API_URL}/api/products/${id}/`, {
      method: 'PATCH',
      body: formData,
    });
    
    console.log('Response status:', response.status);
    const result = await response.json();
    console.log('Response data:', result);
    
    if (!response.ok) {
      throw new Error(result.error || 'Update failed');
    }
    
    return result;
  } catch (error) {
    console.error('Update error:', error);
    throw error;
  }
};
```

---

## 📋 Checklist

Before updating a product, verify:

- [ ] Backend is running (`python manage.py runserver`)
- [ ] Database migrations are up to date
- [ ] `lucide-react` is installed (✅ Done)
- [ ] Frontend is sending correct data format
- [ ] All required fields are included
- [ ] CORS is configured (if needed)
- [ ] API URL is correct
- [ ] No console errors in browser

---

## 🆘 Still Not Working?

If you're still getting 500 errors:

1. **Share the backend error log** - Look at the Django terminal output
2. **Share the browser console error** - Open DevTools → Console
3. **Share the Network request details** - DevTools → Network → Failed request

This will help identify the exact issue.

---

## ✅ Summary

**lucide-react:** ✅ FIXED (Installed successfully)

**Product Update 500 Error:** ⚠️ NEEDS INVESTIGATION
- Check backend is running
- Check backend logs for error details
- Verify data format being sent
- Test API with Postman/cURL

Most likely causes:
1. Backend not running
2. Wrong data format (JSON vs FormData)
3. Missing required fields
4. Database migration needed
