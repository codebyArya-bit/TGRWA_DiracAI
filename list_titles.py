
import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from account.models import Project

# Print titles encoded safely
for p in Project.objects.all():
    try:
        print(f"ID: {p.id} | {p.title}")
    except:
        print(f"ID: {p.id} | [Encoding Error]")
