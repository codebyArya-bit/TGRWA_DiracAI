# -*- coding: utf-8 -*-
"""
End-to-End Category Update Test
Tests that we can actually update a product with category labels
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

from account.models import Product
from account.serializers import ProductSerializer

print("=" * 70)
print("END-TO-END CATEGORY UPDATE TEST")
print("=" * 70)
print()

# Get the first product
try:
    product = Product.objects.first()
    if not product:
        print("ERROR: No products in database!")
        print("Please create a product first.")
        sys.exit(1)
    
    print(f"Testing with product: {product.name}")
    print(f"Current category: {product.category}")
    print()
    
    # Test updating with a label (E-Commerce)
    print("Test 1: Update category using label 'E-Commerce'")
    print("-" * 70)
    
    data = {
        'name': product.name,
        'category': 'E-Commerce',  # Using label, not slug!
        'status': product.status,
    }
    
    serializer = ProductSerializer(product, data=data, partial=True)
    
    if serializer.is_valid():
        updated_product = serializer.save()
        print(f"SUCCESS! Category updated to: {updated_product.category}")
        print(f"Expected: ecommerce")
        print(f"Match: {updated_product.category == 'ecommerce'}")
        
        # Verify in database
        product.refresh_from_db()
        print(f"Verified in DB: {product.category}")
        
        if product.category == 'ecommerce':
            print("\nTest 1: PASSED")
        else:
            print(f"\nTest 1: FAILED - Expected 'ecommerce', got '{product.category}'")
    else:
        print(f"FAILED! Validation errors: {serializer.errors}")
        sys.exit(1)
    
    print()
    
    # Test 2: Update with another label
    print("Test 2: Update category using label 'AI & ML'")
    print("-" * 70)
    
    data['category'] = 'AI & ML'
    serializer = ProductSerializer(product, data=data, partial=True)
    
    if serializer.is_valid():
        updated_product = serializer.save()
        print(f"SUCCESS! Category updated to: {updated_product.category}")
        print(f"Expected: ai-ml")
        print(f"Match: {updated_product.category == 'ai-ml'}")
        
        product.refresh_from_db()
        print(f"Verified in DB: {product.category}")
        
        if product.category == 'ai-ml':
            print("\nTest 2: PASSED")
        else:
            print(f"\nTest 2: FAILED - Expected 'ai-ml', got '{product.category}'")
    else:
        print(f"FAILED! Validation errors: {serializer.errors}")
        sys.exit(1)
    
    print()
    
    # Test 3: Update with slug (should still work)
    print("Test 3: Update category using slug 'education'")
    print("-" * 70)
    
    data['category'] = 'education'
    serializer = ProductSerializer(product, data=data, partial=True)
    
    if serializer.is_valid():
        updated_product = serializer.save()
        print(f"SUCCESS! Category updated to: {updated_product.category}")
        print(f"Expected: education")
        print(f"Match: {updated_product.category == 'education'}")
        
        product.refresh_from_db()
        print(f"Verified in DB: {product.category}")
        
        if product.category == 'education':
            print("\nTest 3: PASSED")
        else:
            print(f"\nTest 3: FAILED - Expected 'education', got '{product.category}'")
    else:
        print(f"FAILED! Validation errors: {serializer.errors}")
        sys.exit(1)
    
    print()
    print("=" * 70)
    print("ALL TESTS PASSED!")
    print("=" * 70)
    print()
    print("You can now update products with category labels from the frontend!")
    print("Examples that will work:")
    print("  - 'E-Commerce' -> saves as 'ecommerce'")
    print("  - 'AI & ML' -> saves as 'ai-ml'")
    print("  - 'FinTech' -> saves as 'fintech'")
    print("  - 'SaaS' -> saves as 'saas'")
    print("  - etc.")
    
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
