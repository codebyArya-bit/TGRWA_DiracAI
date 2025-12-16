# -*- coding: utf-8 -*-
"""
Comprehensive Category Validator Test
Tests all category variations to ensure the validator works correctly
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

from account.serializers import ProductSerializer

# Test cases: (input_value, expected_output)
test_cases = [
    # E-Commerce variations
    ('E-Commerce', 'ecommerce'),
    ('eCommerce', 'ecommerce'),
    ('e-commerce', 'ecommerce'),
    ('ecommerce', 'ecommerce'),
    ('ECOMMERCE', 'ecommerce'),
    
    # AI & ML variations
    ('AI & ML', 'ai-ml'),
    ('AI/ML', 'ai-ml'),
    ('ai', 'ai-ml'),
    ('ai-ml', 'ai-ml'),
    ('AI-ML', 'ai-ml'),
    
    # FinTech variations
    ('FinTech', 'fintech'),
    ('Finance', 'fintech'),
    ('finance', 'fintech'),
    ('fintech', 'fintech'),
    ('FINTECH', 'fintech'),
    
    # SaaS variations
    ('SaaS', 'saas'),
    ('saas', 'saas'),
    ('SAAS', 'saas'),
    
    # Education variations
    ('Education', 'education'),
    ('education', 'education'),
    ('EDUCATION', 'education'),
    
    # Healthcare variations
    ('Healthcare', 'healthcare'),
    ('healthcare', 'healthcare'),
    ('HEALTHCARE', 'healthcare'),
    
    # Business variations
    ('Business', 'business'),
    ('business', 'business'),
    ('BUSINESS', 'business'),
    
    # Productivity variations
    ('Productivity', 'productivity'),
    ('productivity', 'productivity'),
    ('PRODUCTIVITY', 'productivity'),
    
    # Analytics variations
    ('Analytics', 'analytics'),
    ('analytics', 'analytics'),
    ('ANALYTICS', 'analytics'),
    
    # Communication variations
    ('Communication', 'communication'),
    ('communication', 'communication'),
    ('COMMUNICATION', 'communication'),
    
    # Development variations
    ('Development', 'development'),
    ('development', 'development'),
    ('DEVELOPMENT', 'development'),
    
    # Design variations
    ('Design', 'design'),
    ('design', 'design'),
    ('DESIGN', 'design'),
    
    # Marketing variations
    ('Marketing', 'marketing'),
    ('marketing', 'marketing'),
    ('MARKETING', 'marketing'),
    
    # Enterprise variations
    ('Enterprise', 'enterprise'),
    ('enterprise', 'enterprise'),
    ('ENTERPRISE', 'enterprise'),
]

print("=" * 70)
print("CATEGORY VALIDATOR TEST")
print("=" * 70)
print()

serializer = ProductSerializer()
passed = 0
failed = 0
errors = []

for input_value, expected in test_cases:
    try:
        result = serializer.validate_category(input_value)
        if result == expected:
            print(f"OK: '{input_value}' -> '{result}'")
            passed += 1
        else:
            print(f"FAIL: '{input_value}' -> '{result}' (expected: '{expected}')")
            failed += 1
            errors.append(f"'{input_value}' returned '{result}' instead of '{expected}'")
    except Exception as e:
        print(f"ERROR: '{input_value}' -> {e}")
        failed += 1
        errors.append(f"'{input_value}' raised exception: {e}")

print()
print("=" * 70)
print(f"RESULTS: {passed} passed, {failed} failed out of {len(test_cases)} tests")
print("=" * 70)

if errors:
    print("\nERRORS:")
    for error in errors:
        print(f"  - {error}")
else:
    print("\nALL TESTS PASSED!")

print()
print("Valid backend categories:")
print("  education, healthcare, fintech, saas, ai-ml, ecommerce, enterprise,")
print("  business, productivity, analytics, communication, development,")
print("  design, marketing")
