
import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from account.models import Project

# Filter for projects that contain "Exams" in the title
exams_projects = Project.objects.filter(title__icontains="Exams")

print(f"Found {exams_projects.count()} projects containing 'Exams':")
for p in exams_projects:
    print(f"ID: {p.id}")
    print(f"Title: '{p.title}'") # Quotes to see whitespace/special chars
    print(f"Desc: {p.description[:50]}...")
    print(f"Category: {p.category}")
    print(f"Created: {p.created_at}")
    print("-" * 20)
