
import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from account.models import Project

# Force UTF-8 stdout
sys.stdout.reconfigure(encoding='utf-8')

print(f"{'ID':<5} | {'Title':<40} | {'Created At'}")
print("-" * 70)
for p in Project.objects.all().order_by('created_at'):
    print(f"{p.id:<5} | {p.title[:40]:<40} | {p.created_at}")
