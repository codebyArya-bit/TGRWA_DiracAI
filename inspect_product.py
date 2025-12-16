
import os
import django
import sys

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

from account.models import Product

def check_latest_product():
    try:
        # Get the most recently updated product
        product = Product.objects.order_by('-updated_at').first()
        if not product:
            print("No products found.")
            return

        print(f"Product: {product.name} (ID: {product.id})")
        print(f"Updated At: {product.updated_at}")
        print("-" * 20)
        print(f"Outcomes ({type(product.outcomes)}): {product.outcomes}")
        print(f"Challenges ({type(product.challenges)}): {product.challenges}")
        print(f"Stats ({type(product.stats)}): {product.stats}")
        print("-" * 20)
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_latest_product()
