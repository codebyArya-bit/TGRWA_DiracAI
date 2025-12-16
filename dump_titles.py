
import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from account.models import Project

with open('project_titles.txt', 'w', encoding='utf-8') as f:
    for p in Project.objects.all():
        f.write(f"{p.id} | {p.title}\n")
