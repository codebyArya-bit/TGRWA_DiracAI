
import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from account.models import Project

# User's desired start and end
start_title = "DashoApp Mobile App"
end_title = "Dasho Exams"

projects = Project.objects.filter(title__in=[start_title, end_title], title__icontains="Exams").order_by('created_at')

print(f"{'ID':<5} | {'Title':<40} | {'Created At'}")
print("-" * 70)
for p in Project.objects.all().order_by('created_at'):
    print(f"{p.id:<5} | {p.title[:40]:<40} | {p.created_at}")
