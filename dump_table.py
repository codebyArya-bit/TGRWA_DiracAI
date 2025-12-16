
import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from account.models import Project

print(f"{'ID':<5} | {'Title':<40} | {'Short Description'}")
print("-" * 100)
for p in Project.objects.all().order_by('id'):
    s_desc = (p.shortDescription or "").replace('\n', ' ')[:50]
    print(f"{p.id:<5} | {p.title[:40]:<40} | {s_desc}")
