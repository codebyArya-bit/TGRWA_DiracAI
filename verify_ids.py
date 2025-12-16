
import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from account.models import Project

p6 = Project.objects.get(id=6)
print(f"ID 6: {p6.title} | {p6.shortDescription}")

try:
    p9 = Project.objects.get(id=9)
    print(f"ID 9: {p9.title} | {p9.shortDescription}")
except:
    print("ID 9 not found")
