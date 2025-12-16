# Product API Integration Guide

## Summary

✅ **Backend is FULLY FUNCTIONAL** - The Product API is working perfectly!
✅ **Database is configured** - Products are being saved to SQLite database
✅ **Test successful** - Created "DiracAI Platform" product via API

## API Endpoints

All endpoints are at: `http://127.0.0.1:8000/api/products/`

### 1. Create Product (POST)
**Endpoint:** `POST /api/products/`
**Authentication:** Required (JWT Token)
**Content-Type:** `multipart/form-data`

**Form Fields:**
```javascript
{
  // Basic Info
  name: string (required),
  tagline: string (required),
  iconText: string (max 3 chars),
  category: string (choices: education, business, productivity, etc.),
  status: string (choices: Live, In Development, Coming Soon),
  
  // Description
  description: string,
  fullDescription: string,
  
  // URLs
  liveUrl: string (URL),
  demoUrl: string (URL),
  documentationUrl: string (URL),
  
  // JSON Arrays (send as JSON strings)
  features: JSON array of strings,
  outcomes: JSON array of strings,
  challenges: JSON array of strings,
  technologies: JSON array of strings,
  stats: JSON array of {label, value} objects,
  platforms: JSON array of strings,
  integrations: JSON array of strings,
  support: JSON array of strings,
  
  // Media
  cover: File (image),
  gallery_0: File (image),
  gallery_1: File (image),
  // ... more gallery images
  
  // Advanced
  featured: boolean,
  sortOrder: number
}
```

### 2. List Products (GET)
**Endpoint:** `GET /api/products/`
**Authentication:** Not required
**Returns:** Array of all products

### 3. Get Single Product (GET)
**Endpoint:** `GET /api/products/{id}/`
**Authentication:** Not required
**Returns:** Single product object

### 4. Update Product (PUT)
**Endpoint:** `PUT /api/products/{id}/`
**Authentication:** Required (JWT Token)
**Content-Type:** `multipart/form-data`

### 5. Delete Product (DELETE)
**Endpoint:** `DELETE /api/products/{id}/`
**Authentication:** Required (JWT Token)

## Frontend Integration Example

### JavaScript/React Form Submission

```javascript
// Get JWT token from login
const token = localStorage.getItem('access_token');

// Create FormData object
const formData = new FormData();

// Add basic fields
formData.append('name', productName);
formData.append('tagline', tagline);
formData.append('iconText', iconText);
formData.append('category', category);
formData.append('status', status);
formData.append('description', description);
formData.append('fullDescription', fullDescription);

// Add URLs
formData.append('liveUrl', liveUrl);
formData.append('demoUrl', demoUrl);
formData.append('documentationUrl', documentationUrl);

// Add JSON arrays as strings
formData.append('features', JSON.stringify(features));
formData.append('outcomes', JSON.stringify(outcomes));
formData.append('challenges', JSON.stringify(challenges));
formData.append('technologies', JSON.stringify(technologies));
formData.append('stats', JSON.stringify(stats));
formData.append('platforms', JSON.stringify(platforms));
formData.append('integrations', JSON.stringify(integrations));
formData.append('support', JSON.stringify(support));

// Add cover image if exists
if (coverImage) {
  formData.append('cover', coverImage);
}

// Add gallery images
galleryImages.forEach((image, index) => {
  formData.append(`gallery_${index}`, image);
});

// Add boolean/number fields
formData.append('featured', featured);
formData.append('sortOrder', sortOrder);

// Submit to API
fetch('http://127.0.0.1:8000/api/products/', {
  method: 'POST',
  headers: {
    'Authorization': `JWT ${token}`
    // DO NOT set Content-Type - browser will set it automatically with boundary
  },
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Product created:', data);
  // Refresh product list or redirect
})
.catch(error => {
  console.error('Error:', error);
});
```

### Using Axios

```javascript
import axios from 'axios';

const token = localStorage.getItem('access_token');

const formData = new FormData();
// ... add all fields as shown above

axios.post('http://127.0.0.1:8000/api/products/', formData, {
  headers: {
    'Authorization': `JWT ${token}`,
    // Axios will automatically set Content-Type for FormData
  }
})
.then(response => {
  console.log('Product created:', response.data);
})
.catch(error => {
  console.error('Error:', error.response?.data || error.message);
});
```

## Testing the API

A test script has been created at `test_product_api.py`. Run it with:

```bash
.venv_win_312_2\Scripts\python test_product_api.py
```

This will:
1. Login as admin
2. Create a test product
3. List all products

## Current Status

✅ Backend API is working
✅ Database is saving products
✅ Test product "DiracAI Platform" created successfully
✅ API returns proper JSON responses

⚠️ Frontend "Add Product" form needs to be connected to POST to `/api/products/`

## Next Steps

1. **Locate the frontend form** - The "Add Product" form at `http://localhost:3000/admin1/dashboard`
2. **Add form submission handler** - Connect the form's submit button to the API
3. **Handle file uploads** - Ensure cover and gallery images are properly added to FormData
4. **Add success/error handling** - Show user feedback after submission
5. **Refresh product list** - After successful creation, reload the products table

## Example Product Data

The test script creates this product:

```json
{
  "name": "DiracAI Platform",
  "tagline": "AI-Powered Workflow Automation",
  "iconText": "DA",
  "category": "education",
  "status": "In Development",
  "description": "A comprehensive AI platform for automating workflows",
  "features": ["AI-Powered Automation", "Real-time Analytics", "Custom Integrations"],
  "liveUrl": "https://diracai.com",
  "demoUrl": "https://demo.diracai.com"
}
```

## Troubleshooting

### Issue: 415 Unsupported Media Type
**Solution:** Use `multipart/form-data`, not `application/json`

### Issue: 401 Unauthorized
**Solution:** Include JWT token in Authorization header: `JWT {token}`

### Issue: 500 Server Error
**Solution:** Check Django server logs for details. Emoji characters in debug prints have been removed.

### Issue: Products not showing in dashboard
**Solution:** The frontend tab switching may have a bug. Products ARE in the database - verify with:
```bash
curl http://127.0.0.1:8000/api/products/
```

## Database Location

Products are stored in: `c:\Users\Oppen\OneDrive\Desktop\DiracAI-Backend\TGRWA_DiracAI-main\db.sqlite3`

You can inspect it with any SQLite browser or Django admin panel at:
`http://127.0.0.1:8000/admin/`

## Contact

If you need help finding the frontend form code, search for:
- Files containing "Add Product" or "Add New Product"
- Form fields like "Product Name", "Tagline", "Icon Text"
- The admin dashboard component that renders at `/admin1/dashboard`
