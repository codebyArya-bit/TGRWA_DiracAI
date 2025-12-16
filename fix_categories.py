# -*- coding: utf-8 -*-
"""
Quick script to check and fix product categories in the database.
Run with: python fix_categories.py
"""

import os
import sys
import django

# Fix encoding for Windows console
if sys.platform == 'win32':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from account.models import Product

# Category mapping: old value -> new value
CATEGORY_MAPPING = {
    'E-Commerce': 'ecommerce',
    'e-commerce': 'ecommerce',
    'eCommerce': 'ecommerce',
    'AI/ML': 'ai-ml',
    'AI & ML': 'ai-ml',
    'ai': 'ai-ml',
    'Finance': 'fintech',
    'finance': 'fintech',
    'FinTech': 'fintech',
    'Healthcare': 'healthcare',
    'Education': 'education',
    'Business': 'business',
    'Productivity': 'productivity',
    'Analytics': 'analytics',
    'Communication': 'communication',
    'Development': 'development',
    'Design': 'design',
    'Marketing': 'marketing',
    'SaaS': 'saas',
    'Enterprise': 'enterprise',
}

print("=" * 60)
print("PRODUCT CATEGORY FIXER")
print("=" * 60)

# Check all products
products = Product.objects.all()
print(f"\nFound {products.count()} products\n")

fixed_count = 0
for product in products:
    old_category = product.category
    
    # Check if category needs fixing
    if old_category in CATEGORY_MAPPING:
        new_category = CATEGORY_MAPPING[old_category]
        print(f"Fixing: {product.name}")
        print(f"  Old category: {old_category}")
        print(f"  New category: {new_category}")
        
        product.category = new_category
        product.save()
        fixed_count += 1
    else:
        print(f"OK: {product.name}: {old_category}")

print(f"\n{'-' * 60}")
print(f"Fixed {fixed_count} products")
print(f"{'-' * 60}\n")

# Show final state
print("Final product categories:")
for product in Product.objects.all():
    print(f"  {product.id}: {product.name} -> {product.category}")

print("\nDone!")
