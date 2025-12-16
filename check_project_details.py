import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from account.models import Project

print("\nCHECKING PROJECT DETAILS\n")
print("="*80)

# Get a sample project to see what fields are populated
project = Project.objects.first()
if project:
    print(f"Sample Project: {project.title}")
    print(f"ID: {project.id}")
    print(f"\nFIELD CHECK:")
    print(f"  title: {project.title}")
    print(f"  description: {project.description[:100] if project.description else 'EMPTY'}")
    print(f"  shortDescription: {project.shortDescription}")
    print(f"  category: {project.category}")
    print(f"  status: {project.status}")
    print(f"  client: {project.client or 'EMPTY'}")
    print(f"  team: {project.team or 'EMPTY'}")
    print(f"  timeline: {project.timeline or 'EMPTY'}")
    print(f"  technologies: {project.technologies}")
    print(f"  challenges: {project.challenges}")
    print(f"  outcomes: {project.outcomes}")
    print(f"  details: {project.details[:100] if project.details else 'EMPTY'}")
    print(f"  liveUrl: {project.liveUrl or 'EMPTY'}")
    print(f"  videoUrl: {project.videoUrl or 'EMPTY'}")
    print(f"  image: {project.image or 'EMPTY'}")
    print(f"  external_image_url: {project.external_image_url or 'EMPTY'}")
    
print("\n" + "="*80)
print(f"TOTAL PROJECTS IN DATABASE: {Project.objects.count()}")
print("="*80)
