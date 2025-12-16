import os
import django
from django.conf import settings

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from account.models import GalleryItem
from django.core.files import File

def seed_gallery():
    print("Seeding gallery items...")
    
    items = [
        {
            "title": "Office Innovation Lab",
            "category": "office",
            "description": "Our dedicated space for brainstorming and developing cutting-edge AI solutions.",
        },
        {
            "title": "Global Tech Conference 2024",
            "category": "events",
            "description": "DiracAI team presenting our latest findings on Large Language Models.",
        },
        {
            "title": "Annual Team Retreat",
            "category": "celebration",
            "description": "Building bonds and celebrating our achievements in the mountains.",
        },
        {
            "title": "Community Workshop",
            "category": "others",
            "description": "Teaching the next generation of developers about Python and AI.",
        }
    ]
    
    # Use existing temp image or create one
    image_path = "temp_test_image.jpg"
    if not os.path.exists(image_path):
        # Create a minimalistic valid JPG
        with open(image_path, "wb") as f:
            f.write(b'\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xFF\xDB\x00C\x00\xFF\xC0\x00\x11\x08\x00\x10\x00\x10\x03\x01"\x00\x02\x11\x01\x03\x11\x01\xFF\xC4\x00\x1F\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0B\xFF\xDA\x00\x0C\x03\x01\x00\x02\x11\x03\x11\x00?\x00\xBF\x00')

    for item in items:
        if not GalleryItem.objects.filter(title=item["title"]).exists():
            with open(image_path, "rb") as f:
                g = GalleryItem(
                    title=item["title"],
                    description=item["description"],
                    category=item["category"]
                )
                g.image.save(f"seed_{item['category']}.jpg", File(f), save=True)
                print(f"Created gallery item: {item['title']}")
        else:
            print(f"Gallery item already exists: {item['title']}")

    print("Gallery seeding complete.")

if __name__ == '__main__':
    seed_gallery()
