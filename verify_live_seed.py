
import os
import sys
import django

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from account.models import Project

def verify():
    print("Verifying Project Overviews (details)...")
    projects = Project.objects.all().order_by('-updated_at')[:5]
    for p in projects:
        print(f"\nProject: {p.title}")
        print(f"Overview (first 100 chars): {p.details[:100]}...")
        print(f"Stats: {p.stats}")
        print(f"Image used: {p.image if p.image else p.external_image_url}")

if __name__ == "__main__":
    verify()
