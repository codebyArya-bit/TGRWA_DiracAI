# -*- coding: utf-8 -*-
"""
Test Project Categories and Stats
Checks current project data in the database
"""

import os
import sys
import django

# Fix encoding for Windows
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from account.models import Project

print("=" * 70)
print("PROJECT CATEGORIES AND STATS TEST")
print("=" * 70)
print()

projects = Project.objects.all()
print(f"Found {projects.count()} projects\n")

if projects.count() == 0:
    print("No projects in database!")
    print("Create a project first to test.")
else:
    for project in projects:
        print(f"Project ID: {project.id}")
        print(f"  Title: {project.title}")
        print(f"  Category: '{project.category}'")
        print(f"  Status: {project.status}")
        
        if project.stats:
            print(f"  Stats: {project.stats}")
            if isinstance(project.stats, dict):
                for key, value in project.stats.items():
                    print(f"    - {key}: {value}")
        else:
            print(f"  Stats: (empty)")
        
        print()

print("=" * 70)
print("CATEGORY CHECK")
print("=" * 70)

categories_found = {}
for project in projects:
    cat = project.category or '(empty)'
    categories_found[cat] = categories_found.get(cat, 0) + 1

for cat, count in categories_found.items():
    print(f"  {cat}: {count} project(s)")

print()
print("Valid categories:")
print("  mobile, fintech, saas, edtech, ai, blockchain, devops,")
print("  ecommerce, govtech, enterprise")
