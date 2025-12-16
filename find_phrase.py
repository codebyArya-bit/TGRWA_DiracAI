
import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from account.models import Project

# Find project with "Secure Online Exam" in any text field
for p in Project.objects.all():
    text_blob = f"{p.title} {p.shortDescription} {p.description} {p.details}"
    if "Secure Online Exam" in text_blob:
        print(f"MATCH: ID {p.id}")
        print(f"Title: {p.title}")
        print(f"ShortDesc: {p.shortDescription}")
        print("-" * 20)
