import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"
LOGIN_URL = f"{BASE_URL}/token/"
PROJECT_ID = 6

def test_update():
    # Login
    resp = requests.post(LOGIN_URL, json={"username": "admin", "password": "dirac23"})
    if resp.status_code != 200:
        print("Login failed")
        return
    token = resp.json()['access']
    headers = {"Authorization": f"JWT {token}"}
    
    # Get Project 6 to confirm existence
    url = f"{BASE_URL}/projects/{PROJECT_ID}/"
    resp = requests.get(url, headers=headers)
    if resp.status_code != 200:
        print(f"Project not found: {resp.status_code}")
        # Fetch any project
        resp = requests.get(f"{BASE_URL}/projects/", headers=headers)
        if resp.status_code == 200 and len(resp.json()) > 0:
            pid = resp.json()[0]['id']
            print(f"Using Project ID {pid} instead")
            url = f"{BASE_URL}/projects/{pid}/"
        else:
            print("No projects found")
            return

    print(f"Testing UPDATE on Project {PROJECT_ID}")
    
    # Try PUT with partial data (simulating frontend issue)
    # Frontend usually sends FormData.
    # Case 1: JSON Partial
    print("\n--- Test 1: Multipart Update with Empty Title ---")
    data = {
        "title": "",
        "category": "edtech"
    }
    # Note: requests.put with 'data' param sends multipart/form-data or form-urlencoded
    # We want to mimic frontend which uses FormData
    resp = requests.put(url, data=data, headers=headers)
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.text}")
    with open("output_test.txt", "w") as f:
        f.write(f"Status: {resp.status_code}\n")
        f.write(f"Response: {resp.text}\n")
    return

    # Case 2: JSON Update
    print("\n--- Test 2: JSON Update ---")
    headers['Content-Type'] = 'application/json'
    resp = requests.put(url, json=data, headers=headers)
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.text}")

if __name__ == "__main__":
    test_update()
