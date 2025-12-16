
import os
import django
import requests
from django.core.files.base import ContentFile
import urllib3
import uuid

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from account.models import GalleryItem

def sync_gallery():
    print("Fetching live gallery data from diracai.com...")
    try:
        response = requests.get('https://diracai.com/api/gallery/', verify=False)
        response.raise_for_status()
        live_items = response.json()
        
        print(f"Found {len(live_items)} items on live site.")
        
        print("Clearing local gallery...")
        GalleryItem.objects.all().delete()
        
        count = 0
        for item in live_items:
            title = item['title'][:150] # Truncate title
            
            category = item.get('category', 'office')
            if len(category) > 20:
                category = 'others' # Fallback if category invalid/too long
            
            # Ensure description is string
            description = item.get('description', '') or ''
                
            print(f"Processing: {title[:30]}...")
            
            img_url = item['image']
            if not img_url.startswith('http'):
                img_url = f"https://diracai.com{img_url}"
                
            try:
                img_resp = requests.get(img_url, verify=False)
                img_resp.raise_for_status()
                
                gallery_item = GalleryItem(
                    title=title,
                    description=description,
                    category=category
                )
                
                # Create short safe filename
                ext = 'jpg'
                if '.png' in img_url.lower(): ext = 'png'
                elif '.gif' in img_url.lower(): ext = 'gif'
                
                file_name = f"gallery_{uuid.uuid4().hex[:8]}.{ext}"
                
                gallery_item.image.save(file_name, ContentFile(img_resp.content), save=True)
                count += 1
                print(f"Saved: {title[:30]}")
                
            except Exception as e:
                print(f"!!! Error processing item {title[:20]}: {str(e)}")

        print(f"Successfully synced {count} items.")
        
    except Exception as e:
        print(f"Failed to fetch live data: {e}")

if __name__ == '__main__':
    sync_gallery()
