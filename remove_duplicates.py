
import os
import sys
import django
from django.db.models import Count

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from account.models import Project

def remove_duplicates():
    duplicates = Project.objects.values('title').annotate(count=Count('id')).filter(count__gt=1)
    
    if not duplicates:
        print("No duplicate projects found.")
        return

    print(f"Found {len(duplicates)} duplicate titles. Removing extras...")
    
    deleted_count = 0
    for dup in duplicates:
        title = dup['title']
        # Get all projects with this title, ordered by ID (so we keep the first one)
        projects = list(Project.objects.filter(title=title).order_by('id'))
        
        # Keep the first one, delete the rest
        to_keep = projects[0]
        to_delete = projects[1:]
        
        print(f"Keeping ID {to_keep.id} for title '{title}'")
        for p in to_delete:
            print(f" - Deleting ID {p.id} (Created: {p.created_at})")
            p.delete()
            deleted_count += 1
            
    print(f"\nSuccessfully deleted {deleted_count} duplicate projects.")

if __name__ == "__main__":
    remove_duplicates()
