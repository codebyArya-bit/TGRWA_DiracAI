"""
Quick test to verify the Projects API is working correctly
Run the Django server first: .venv_win\Scripts\python.exe manage.py runserver
Then run this script to test the API endpoints
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

print("\n" + "="*70)
print("PROJECTS API TEST")
print("="*70 + "\n")

# Test 1: Get all projects
print("📡 Test 1: GET /api/projects/")
print("-" * 70)

try:
    response = requests.get(f"{BASE_URL}/api/projects/", timeout=5)
    
    if response.status_code == 200:
        projects = response.json()
        print(f"✅ SUCCESS - Found {len(projects)} projects\n")
        
        for i, project in enumerate(projects, 1):
            print(f"{i}. {project['title']}")
            print(f"   Category: {project.get('category', 'N/A')}")
            print(f"   Technologies: {', '.join(project.get('technologies', [])[:3])}")
            print(f"   Image: {'✅ Present' if project.get('image') else '❌ Missing'}")
            print()
    else:
        print(f"❌ FAILED - Status Code: {response.status_code}")
        print(f"Response: {response.text[:200]}")
        
except requests.exceptions.ConnectionError:
    print("❌ ERROR: Cannot connect to server")
    print("👉 Make sure Django server is running:")
    print("   .venv_win\\Scripts\\python.exe manage.py runserver")
except Exception as e:
    print(f"❌ ERROR: {str(e)}")

print("\n" + "="*70)

# Test 2: Get single project (if any exist)
print("📡 Test 2: GET /api/projects/<id>/")
print("-" * 70)

try:
    # Get first project ID
    response = requests.get(f"{BASE_URL}/api/projects/", timeout=5)
    if response.status_code == 200 and response.json():
        first_project_id = response.json()[0]['id']
        
        detail_response = requests.get(f"{BASE_URL}/api/projects/{first_project_id}/", timeout=5)
        
        if detail_response.status_code == 200:
            project = detail_response.json()
            print(f"✅ SUCCESS - Retrieved project: {project['title']}\n")
            print(f"Full details:")
            print(f"  - Description: {project.get('description', 'N/A')[:80]}...")
            print(f"  - Short Description: {project.get('shortDescription', 'N/A')}")
            print(f"  - Status: {project.get('status', 'N/A')}")
            print(f"  - Bullets: {len(project.get('bullets', []))} items")
            print(f"  - Links: {len(project.get('links', []))} items")
        else:
            print(f"❌ FAILED - Status Code: {detail_response.status_code}")
            
except Exception as e:
    print(f"❌ ERROR: {str(e)}")

print("\n" + "="*70)
print("🎯 NEXT STEPS:")
print("   1. Visit http://localhost:3000/projects to see the frontend")
print("   2. All 6 projects should display with images and categories")
print("   3. Admin Dashboard can now manage these projects via CRUD operations")
print("="*70 + "\n")
