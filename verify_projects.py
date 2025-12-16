
import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from account.models import Project

projects = Project.objects.all() # Ordering is already 'created_at' from model
print(f"Total Projects: {projects.count()}")
for i, p in enumerate(projects, 1):
    print(f"{i}. {p.title}")
