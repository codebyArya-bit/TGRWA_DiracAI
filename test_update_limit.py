
import requests
import json
import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from account.models import Project

def test_update():
    try:
        p = Project.objects.first() # get any project
        if not p:
            print("No project found")
            return
            
        print(f"Testing update on project ID: {p.id} - {p.title}")
        
        url = f"http://127.0.0.1:8000/api/projects/{p.id}/"
        
        # Create a long URL
        long_url = "https://example.com/image.jpg?" + "a" * 300
        
        data = {
            "external_image_url": long_url,
            "title": p.title # keep title same
        }
        
        print(f"Sending PATCH request with external_image_url length: {len(long_url)}")
        
        response = requests.patch(url, json=data)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Content: {response.text}")
        
        if response.status_code == 200:
            print("SUCCESS: Updated successfully")
        else:
            print("FAILURE: Update failed")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_update()
