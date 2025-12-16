
import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from account.models import Project

ids_to_delete = [11, 24]

for pid in ids_to_delete:
    try:
        p = Project.objects.get(id=pid)
        print(f"Deleting Project: {p.title} (ID: {p.id})")
        p.delete()
    except Project.DoesNotExist:
        print(f"Project ID {pid} already deleted or not found.")

print("Cleanup complete.")
