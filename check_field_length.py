
import os
import sys
import django

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from account.models import Project

field = Project._meta.get_field('external_image_url')
print(f"Field: {field.name}")
print(f"Max Length: {field.max_length}")
print(f"Null: {field.null}")
print(f"Blank: {field.blank}")
