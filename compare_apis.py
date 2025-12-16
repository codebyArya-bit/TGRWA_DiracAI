
import requests
import json
import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from account.models import Project

def normalize(text):
    if not text: return ""
    return str(text).strip()

def check_sync():
    print("Fetching LIVE data...")
    try:
        live_resp = requests.get("https://diracai.com/api/projects/")
        live_data = live_resp.json()
    except Exception as e:
        print(f"Error fetching live data: {e}")
        return

    print("Fetching LOCAL data (from DB)...")
    # API might apply filters, so let's check DB directly first to see raw state, 
    # but we really care about what the API returns to the frontend.
    # Actually, accessing DB directly is better for "truth" of data, 
    # but accessing Local API is better for "what the frontend sees".
    # Let's use Local API to match the user experience.
    try:
        local_resp = requests.get("http://127.0.0.1:8000/api/projects/")
        local_data = local_resp.json()
    except Exception as e:
        print(f"Error fetching local API: {e}")
        return

    print(f"\nLIVE Count: {len(live_data)}")
    print(f"LOCAL Count: {len(local_data)}")

    print("\n--- COMPARISON (Order matters) ---")
    max_len = max(len(live_data), len(local_data))
    
    all_match = True
    
    print(f"{'IDX':<5} | {'LIVE TITLE':<40} | {'LOCAL TITLE':<40} | {'STATUS'}")
    print("-" * 100)
    
    for i in range(max_len):
        live_title = "---"
        local_title = "---"
        status = "MATCH"
        
        if i < len(live_data):
            live_title = normalize(live_data[i].get('title'))
            
        if i < len(local_data):
            local_title = normalize(local_data[i].get('title'))
            
        if live_title != local_title:
            status = "MISMATCH"
            all_match = False
            
        print(f"{i+1:<5} | {live_title[:40]:<40} | {local_title[:40]:<40} | {status}")
        
    print("-" * 100)
    if all_match:
        print("PERFECT SYNC: Order and Titles match exactly!")
    else:
        print("SYNC ISSUES FOUND.")

if __name__ == "__main__":
    check_sync()
