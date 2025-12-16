
import os
import sys
import json
import django

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings") # Assuming myproject is the project name based on file list
django.setup()

from account.models import Project

def seed():
    seed_file = 'seed/projects.json'
    if not os.path.exists(seed_file):
        print(f"File not found: {seed_file}")
        return

    with open(seed_file, 'r') as f:
        projects = json.load(f)

    print(f"Found {len(projects)} projects to seed.")

    for p in projects:
        slug = p.get('slug')
        if not slug:
            print(f"Skipping project without slug: {p.get('title')}")
            continue

        defaults = {
            'title': p.get('title', ''),
            'description': p.get('description', ''),
            'bullets': p.get('bullets', []),
            'links': p.get('links', []),
            'external_image_url': p.get('imageUrl'),
            'technologies': p.get('tech', []),
            'is_active': p.get('isActive', True),
            'status': 'ongoing' if p.get('isActive', True) else 'planned',
             # Fill other fields if necessary
             'details': p.get('description', '')
        }

        project, created = Project.objects.update_or_create(
            slug=slug,
            defaults=defaults
        )
        action = "Created" if created else "Updated"
        print(f"{action}: {project.title} ({project.slug})")

if __name__ == "__main__":
    seed()
