
import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from account.models import Project

print("Checking ID 9 (DashoApp Mobile App):")
try:
    p9 = Project.objects.get(id=9)
    print(f"Title: {p9.title}")
    print(f"Desc: {p9.description}")
    print(f"ShortDesc: {p9.shortDescription}")
except Project.DoesNotExist:
    print("ID 9 not found")

print("\nChecking for description 'Secure Online Exam Platform':")
matches = Project.objects.filter(description__icontains="Secure Online Exam")
for p in matches:
    print(f"ID: {p.id} | Title: {p.title}")

matches_short = Project.objects.filter(shortDescription__icontains="Secure Online Exam")
for p in matches_short:
    print(f"ID: {p.id} | Title: {p.title} (ShortDesc match)")
