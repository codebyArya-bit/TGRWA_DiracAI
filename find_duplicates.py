
import os
import sys
import django
from django.db.models import Count

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from account.models import Project

def check_duplicates():
    # Find titles that appear more than once
    duplicates = Project.objects.values('title').annotate(count=Count('id')).filter(count__gt=1)
    
    if not duplicates:
        print("No duplicate projects found.")
        return

    print(f"Found {len(duplicates)} duplicate titles:")
    for dup in duplicates:
        title = dup['title']
        count = dup['count']
        projects = Project.objects.filter(title=title).order_by('created_at')
        print(f"\nTitle: '{title}' (Count: {count})")
        for p in projects:
            print(f" - ID: {p.id}, Created: {p.created_at}")

if __name__ == "__main__":
    check_duplicates()
