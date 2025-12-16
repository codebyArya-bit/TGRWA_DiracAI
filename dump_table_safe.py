
import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from account.models import Project

# Force UTF-8 for stdout
sys.stdout.reconfigure(encoding='utf-8')

with open('current_projects.txt', 'w', encoding='utf-8') as f:
    f.write(f"{'ID':<5} | {'Title':<50} | {'Short Description'}\n")
    f.write("-" * 100 + "\n")
    for p in Project.objects.all().order_by('id'):
        title = p.title.replace('\n', ' ')
        s_desc = (p.shortDescription or "").replace('\n', ' ')[:50]
        f.write(f"{p.id:<5} | {title[:50]:<50} | {s_desc}\n")
