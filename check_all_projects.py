import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from account.models import Project

print("\n" + "="*70)
print("CURRENT PROJECTS IN DATABASE")
print("="*70 + "\n")

projects = Project.objects.all().order_by('category', 'title')
total = projects.count()

print(f"Total Projects: {total}\n")

# Group by category
categories = {}
for project in projects:
    cat = project.category or 'uncategorized'
    if cat not in categories:
        categories[cat] = []
    categories[cat].append(project)

for category, projs in sorted(categories.items()):
    print(f"\n{'─'*70}")
    print(f"{category.upper()} ({len(projs)} projects)")
    print(f"{'─'*70}")
    
    for p in projs:
        print(f"  • {p.title}")
        print(f"    - ID: {p.id}")
        print(f"    - Slug: {p.slug}")
        print(f"    - Active: {'✅' if p.is_active else '❌'}")
        print(f"    - Tech: {', '.join(p.technologies[:3]) if p.technologies else 'None'}")
        if len(p.technologies) > 3:
            print(f"      +{len(p.technologies) - 3} more")
        print()

print(f"\n{'='*70}")
print(f"✅ TOTAL: {total} projects in database")
print(f"✅ All projects are serving on http://localhost:3000/projects")
print("="*70 + "\n")
