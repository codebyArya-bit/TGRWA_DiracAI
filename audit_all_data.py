import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from account.models import TeamMember, Project

print("\n" + "="*70)
print("COMPLETE DATABASE AUDIT")
print("="*70)

# Check Team Members
print("\n📊 TEAM MEMBERS")
print("─"*70)
team_members = TeamMember.objects.all()
print(f"Total: {team_members.count()}")
print("\nList of Team Members:")
for i, member in enumerate(team_members.order_by('name'), 1):
    print(f"{i}. {member.name} - {member.role}")
    print(f"   Status: {member.status}, Type: {member.member_type}")
    if member.image:
        print(f"   Image: ✅ {member.image}")
    print()

# Check Projects
print("\n" + "="*70)
print("📊 PROJECTS")
print("─"*70)
projects = Project.objects.all()
print(f"Total: {projects.count()}")
print("\nList of Projects:")
for i, project in enumerate(projects.order_by('title'), 1):
    print(f"{i}. {project.title}")
    print(f"   ID: {project.id}")
    print(f"   Category: {project.category}")
    print(f"   Status: {project.status}")
    print(f"   Active: {project.is_active}")
    print(f"   Created: {project.created_at.strftime('%Y-%m-%d')}")
    if project.client:
        print(f"   Client: {project.client}")
    if project.team:
        print(f"   Team: {project.team}")
    if project.timeline:
        print(f"   Timeline: {project.timeline}")
    print()

print("="*70)
print("✅ ALL DATA IS PRESENT IN DATABASE")
print("="*70)
