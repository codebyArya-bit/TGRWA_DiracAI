import requests
import json
import os

# Configuration
BASE_URL = "http://127.0.0.1:8000/api"
LOGIN_URL = f"{BASE_URL}/token/"

class Color:
    GREEN = '\033[92m'
    RED = '\033[91m'
    END = '\033[0m'

def print_pass(msg):
    # Determine if running in a terminal that supports colors, otherwise simple print
    # Simple print for Windows safety in this environment
    print(f"[PASS] {msg}")

def print_fail(msg):
    print(f"[FAIL] {msg}")

def test_admin_functions():
    print("=== STARTING ADMIN DASHBOARD HEALTH CHECK ===\n")

    # 1. AUTHENTICATION
    print("1. Checking Authentication...")
    login_data = {"username": "admin", "password": "dirac23"}
    try:
        resp = requests.post(LOGIN_URL, json=login_data)
        if resp.status_code == 200:
            token = resp.json()['access']
            headers = {"Authorization": f"JWT {token}"}
            print_pass("Login successful. Token acquired.")
        else:
            print_fail(f"Login failed: {resp.text}")
            return
    except Exception as e:
        print_fail(f"Connection failed: {e}")
        return

    # 2. DASHBOARD STATS
    print("\n2. Checking Dashboard Stats (Counts)...")
    stats_url = f"{BASE_URL}/admin/dashboard/"
    resp = requests.get(stats_url, headers=headers)
    if resp.status_code == 200:
        data = resp.json()
        print_pass(f"Fetched Stats: {json.dumps(data)}")
        print_pass(f"Fetched Stats: {json.dumps(data)}")
        if 'stats' in data and all(k in data['stats'] for k in ['products', 'projects', 'team', 'gallery']):
            print_pass(f"Data structure is correct. Counts: {data['stats']}")
        else:
            print_fail("Missing keys in stats response.")
    else:
        print_fail(f"Failed to get stats: {resp.status_code}")

    # 3. TEAM MEMBERS
    print("\n3. Checking Team Management...")
    team_url = f"{BASE_URL}/team/"
    # GET
    resp = requests.get(team_url, headers=headers)
    if resp.status_code == 200:
        print_pass(f"Team List: Found {len(resp.json())} members.")
    else:
        print_fail("Failed to fetch team list.")

    # CREATE (Test)
    new_member = {
        "name": "Test Member",
        "role": "Tester",
        "status": "Active", # Check case sensitivity in models if needed
        "order": 99
    }
    resp = requests.post(team_url, data=new_member, headers=headers)
    if resp.status_code in [200, 201]:
        created_id = resp.json().get('id')
        print_pass(f"Created Team Member (ID: {created_id})")
        # DELETE (Cleanup)
        del_resp = requests.delete(f"{team_url}{created_id}/", headers=headers)
        if del_resp.status_code == 204:
            print_pass("Deleted Test Team Member (Cleanup)")
        else:
            print_fail(f"Failed to delete test member: {del_resp.status_code}")
    else:
        print_fail(f"Failed to create team member: {resp.text}")

    # 4. PROJECTS
    print("\n4. Checking Project Management...")
    proj_url = f"{BASE_URL}/projects/"
    resp = requests.get(proj_url, headers=headers)
    if resp.status_code == 200:
        print_pass(f"Project List: Found {len(resp.json())} projects.")
    else:
        print_fail("Failed to fetch project list.")

    # 5. PRODUCTS
    print("\n5. Checking Product Management...")
    prod_url = f"{BASE_URL}/products/"
    resp = requests.get(prod_url, headers=headers)
    if resp.status_code == 200:
        print_pass(f"Product List: Found {len(resp.json())} products.")
    else:
        print_fail("Failed to fetch product list.")

    # 6. GALLERY (Global)
    print("\n6. Checking Global Gallery...")
    gal_url = f"{BASE_URL}/gallery/"
    resp = requests.get(gal_url, headers=headers)
    if resp.status_code == 200:
        print_pass(f"Gallery List: Found {len(resp.json())} items.")
    else:
        print_fail("Failed to fetch gallery.")

    print("\n=== HEALTH CHECK COMPLETE ===")

if __name__ == "__main__":
    test_admin_functions()
