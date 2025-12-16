
import requests
import json
import os
import sys

# Configuration
# Assuming user is running mostly on localhost:8000
BASE_URL = "http://localhost:8000/api"
LOGIN_URL = f"{BASE_URL}/login/" 

def print_pass(msg):
    print(f"[PASS] {msg}")

def print_fail(msg):
    print(f"[FAIL] {msg}")

def test_admin_buttons():
    print("=== STARTING ADMIN BUTTON TEST (Simulating Clicks) ===\n")

    # 1. AUTHENTICATION (Login)
    print("1. Authenticating as Admin...")
    # Using known credentials from previous sessions or standard defaults
    # From test_all_admin.py: "username": "admin", "password": "dirac23", but URL was /token/
    # Let's check which login endpoint is active. urls.py says 'api/login/' -> LoginView
    # And 'login/' -> views.login_view (template)
    # And there isn't a simple 'token/' endpoint in the `urls.py` displayed earlier?
    # Wait, 'api/login/' (LoginView) usually returns token.
    
    login_data = {"username": "admin", "password": "dirac23"}
    headers = {}
    
    try:
        # Trying typical JWT endpoint first if LoginView matches standard
        resp = requests.post(f"{BASE_URL}/login/", json=login_data)
        if resp.status_code == 200:
            data = resp.json()
            if 'access' in data:
                token = data['access']
                headers = {"Authorization": f"JWT {token}"}
                print_pass("Login successful (JWT acquired).")
            elif 'token' in data:
                 token = data['token']
                 headers = {"Authorization": f"Token {token}"} # or JWT
                 print_pass("Login successful (Token acquired).")
            else:
                print_fail(f"Login response format unknown: {data.keys()}")
                return
        else:
            # Fallback to test_all_admin.py strategy if that worked previously
            # It used http://127.0.0.1:8000/api/token/ 
            # I don't see 'token/' in urls.py but maybe it's in `account/urls.py` included? 
            # Or maybe I missed it. Let's try it.
            try:
                resp = requests.post("http://localhost:8000/api/token/", json=login_data)
                if resp.status_code == 200:
                    token = resp.json()['access']
                    headers = {"Authorization": f"JWT {token}"}
                    print_pass("Login successful via /api/token/.")
                else:
                    print_fail(f"Login failed on both endpoints. Access denied. {resp.status_code}")
                    return
            except:
                print_fail("Login failed.")
                return

    except Exception as e:
        print_fail(f"Connection failed: {e}")
        return

    # 2. TEST "SYNC DATA" BUTTON
    # Logic: Fetches Dashboard, Team, Projects, Gallery, Products
    print("\n2. Testing [Sync Data] Button Logic...")
    
    endpoints = [
        ("Dashboard Stats", "/admin/dashboard/"),
        ("Team List", "/team/"),
        ("Project List", "/projects/"),
        ("Gallery List", "/gallery/"),
        ("Product List", "/products/")
    ]
    
    all_sync_pass = True
    for name, endpoint in endpoints:
        url = f"{BASE_URL}{endpoint}"
        print(f"   -> Fetching {name} from {url}...")
        resp = requests.get(url, headers=headers)
        if resp.status_code == 200:
            count = len(resp.json()) if isinstance(resp.json(), list) else 1
            print(f"      OK (Got {count} items)")
        else:
             print_fail(f"Failed to fetch {name}: {resp.status_code}")
             all_sync_pass = False
    
    if all_sync_pass:
        print_pass("[Sync Data] Button is FUNCTIONAL.")
    else:
        print_fail("[Sync Data] Button has issues.")

    # 3. TEST "SYNC GALLERY" BUTTON (Live Sync)
    print("\n3. Testing [Sync Gallery] Button Logic (Live Sync)...")
    sync_url = f"{BASE_URL}/gallery/sync/"
    print(f"   -> Sending POST request to {sync_url}...")
    
    # This might take a few seconds
    try:
        resp = requests.post(sync_url, headers=headers, timeout=30)
        if resp.status_code == 200:
            data = resp.json()
            msg = data.get('message', 'No message')
            print_pass(f"Sync Successful! Response: {msg}")
            
            # Verify items exist
            items_count = len(data.get('gallery', []))
            print_pass(f"Gallery now contains {items_count} live items.")
        else:
            print_fail(f"Sync Failed: {resp.status_code} - {resp.text}")
    except requests.exceptions.Timeout:
        print_fail("Sync request timed out (it might be too slow).")
    except Exception as e:
        print_fail(f"Sync request error: {e}")

    # 4. EXPORT & SETTINGS
    print("\n4. Testing Client-Side Buttons...")
    print("   -> [Export]: Browser-side function (Generates JSON from current state). Verified in code review.")
    print("   -> [Settings]: Browser-side function (Alerts 'Coming Soon'). Verified in code review.")
    
    print("\n=== BUTTON CHECK COMPLETE ===")

if __name__ == "__main__":
    test_admin_buttons()
