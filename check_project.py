# -*- coding: utf-8 -*-
"""
Check specific project data
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
print("PROJECT DETAIL CHECK")
print("=" * 70)
print()

# Find the project with team "6 developers, 2 designers, 1 project manager"
projects = Project.objects.filter(team__icontains="6 developers")

if projects.exists():
    for project in projects:
        print(f"Project ID: {project.id}")
        print(f"Title: {project.title}")
        print(f"Category: '{project.category}'")
        print(f"Team: {project.team}")
        print(f"Timeline: {project.timeline}")
        print(f"Client: {project.client}")
        print(f"Stats: {project.stats}")
        print(f"Status: {project.status}")
        print()
        
        # Check if category is correct
        if project.category == 'mobile':
            print("⚠️ WARNING: Category is 'mobile' - should this be 'edtech'?")
            print()
            
            # Offer to fix
            fix = input("Fix category to 'edtech'? (y/n): ")
            if fix.lower() == 'y':
                project.category = 'edtech'
                project.save()
                print("✅ Category updated to 'edtech'")
        
        # Check stats
        if not project.stats or len(project.stats) == 0:
            print("⚠️ WARNING: No stats/metrics defined")
            print()
            
            add_stats = input("Add sample stats? (y/n): ")
            if add_stats.lower() == 'y':
                project.stats = {
                    'Users': '10K+',
                    'Rating': '4.8',
                    'Downloads': '50K+'
                }
                project.save()
                print("✅ Stats added")
else:
    print("No project found with that team description")
    print()
    print("All projects:")
    for p in Project.objects.all():
        print(f"  ID {p.id}: {p.title} - Category: {p.category}")
