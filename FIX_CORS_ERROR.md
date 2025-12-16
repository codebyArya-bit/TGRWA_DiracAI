# 🔧 Fix "Failed to fetch" CORS Error - Quick Solution

## ❌ Error Details
```
Failed to fetch
  at AuthProvider.useCallback[fetchUser] (context/AuthContext.js:26:25)
  
Code:
const res = await fetch(`${API_URL}/api/`, {
  headers: { Authorization: `JWT ${access}` },
});
```

---

## ✅ Solution Steps

### Step 1: Ensure Django Backend is Running

Open a terminal and run:
```bash
cd c:\Users\Oppen\OneDrive\Desktop\DiracAI-Backend\TGRWA_DiracAI-main
.venv_win\Scripts\python.exe manage.py runserver
```

**Expected output**:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

Leave this terminal running!

---

### Step 2: Verify the Endpoint Works

Open a NEW terminal and test:
```bash
curl http://127.0.0.1:8000/api/
```

Or visit in browser: `http://127.0.0.1:8000/api/`

**Expected**: Should return user data or authentication error (not connection error)

---

### Step 3: Check Your Next.js Environment Variable

In your Next.js project, verify `API_URL` is correct.

**Check file**: `.env.local` or `.env`

Should contain:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Or if using different port:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Important**: Restart Next.js dev server after changing .env files!

---

### Step 4: Verify CORS Configuration (Already Fixed)

Your Django `settings.py` already has CORS enabled:

```python
# Line 85
CORS_ALLOW_ALL_ORIGINS = True  # ✅ This allows all origins

# Line 248-250
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',  # ✅ Your Next.js app
    'http://127.0.0.1:8000',
]

# Line 252
CORS_ALLOW_CREDENTIALS = True  # ✅ Allows cookies/auth headers
```

✅ CORS is properly configured!

---

## 🧪 Quick Test

### Test 1: Direct API Call
```bash
# Test if backend is accessible
curl -X GET http://127.0.0.1:8000/api/ \
  -H "Content-Type: application/json"
```

### Test 2: With Authentication
```bash
# If you have a JWT token
curl -X GET http://127.0.0.1:8000/api/ \
  -H "Authorization: JWT your_token_here"
```

### Test 3: From Browser Console
Open `http://localhost:3000` in browser, open DevTools console, run:
```javascript
fetch('http://127.0.0.1:8000/api/')
  .then(res => res.json())
  .then(data => console.log('Success:', data))
  .catch(err => console.error('Error:', err));
```

---

## 🔍 Common Issues & Fixes

### Issue 1: "Connection refused" or "Failed to fetch"
**Cause**: Django server not running  
**Fix**: Start Django server (see Step 1)

### Issue 2: "CORS policy blocked"
**Cause**: CORS not configured properly  
**Fix**: Your CORS is already configured correctly! Check if:
- Django server is running
- `corsheaders` installed: `pip install django-cors-headers`

### Issue 3: "401 Unauthorized"
**Cause**: Missing or invalid JWT token  
**Fix**: This is expected if not logged in. The endpoint exists and CORS works!

### Issue 4: "404 Not Found" at /api/
**Cause**: Wrong URL pattern  
**Fix**: Ensure you're calling `/api/` (with trailing slash)

---

## 🎯 Next.js AuthContext Fix

If your Next.js `AuthContext.js` is calling the wrong URL, update it:

```javascript
// ❌ WRONG - Missing protocol or wrong format
const API_URL = "127.0.0.1:8000"  // Missing http://

// ✅ CORRECT
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
```

**Full example**:
```javascript
const fetchUser = useCallback(async () => {
  setLoading(true);
  try {
    // Make sure API_URL includes http://
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    
    const res = await fetch(`${apiUrl}/api/`, {
      headers: { 
        Authorization: `JWT ${access}`,
        'Content-Type': 'application/json'
      },
    });
    
    if (!res.ok) throw new Error("Failed to fetch user");
    
    const data = await res.json();
    setUser(data);
  } catch (error) {
    console.error('Fetch user error:', error);
    setUser(null);
  } finally {
    setLoading(false);
  }
}, [access]);
```

---

## ✅ Verification Checklist

- [ ] Django server is running on `http://127.0.0.1:8000`
- [ ] `/api/` endpoint returns data (test with curl or browser)
- [ ] Next.js `.env` has correct `NEXT_PUBLIC_API_URL`
- [ ] Next.js dev server restarted after .env changes
- [ ] Browser console shows no CORS errors
- [ ] Both servers on same machine (localhost)

---

## 🚀 Quick Fix Command Sequence

```bash
# Terminal 1: Start Django Backend
cd c:\Users\Oppen\OneDrive\Desktop\DiracAI-Backend\TGRWA_DiracAI-main
.venv_win\Scripts\python.exe manage.py runserver

# Terminal 2: Test API
curl http://127.0.0.1:8000/api/

# Terminal 3: Start Next.js Frontend (if not running)
cd <your-nextjs-project-directory>
npm run dev
```

---

## 📋 Summary

**Root Cause**: Most likely Django backend is not running

**Solution**: 
1. Start Django server: `.venv_win\Scripts\python.exe manage.py runserver`
2. Verify API works: `curl http://127.0.0.1:8000/api/`  
3. Check Next.js .env has: `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000`

**CORS is already configured correctly** - no changes needed!

---

## 🆘 Still Not Working?

Run this diagnostic:

```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Try accessing different endpoints
curl http://127.0.0.1:8000/api/projects/
curl http://127.0.0.1:8000/admin/

# Check Django logs for errors
# Look at the terminal where you ran 'manage.py runserver'
```

If you see errors in Django logs, share them for specific troubleshooting!
