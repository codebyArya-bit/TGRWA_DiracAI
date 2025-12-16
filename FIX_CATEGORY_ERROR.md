# Fix for "E-Commerce" Category Error

## Problem
The error `{"category":["\"E-Commerce\" is not a valid choice."]}` occurs because:
1. The backend expects lowercase slugs: `ecommerce`, `ai-ml`, `fintech`, etc.
2. The frontend dropdown is correctly configured to send slugs
3. BUT: There might be old data or the category is being transformed somewhere

## Quick Fix: Update Database Categories

Run this SQL command to fix any old category values:

```sql
UPDATE account_product SET category = 'ecommerce' WHERE category IN ('E-Commerce', 'e-commerce', 'eCommerce');
UPDATE account_product SET category = 'ai-ml' WHERE category IN ('AI/ML', 'ai', 'AI & ML');
UPDATE account_product SET category = 'fintech' WHERE category IN ('Finance', 'finance', 'FinTech');
```

## Or use Python:

```python
python manage.py shell

from account.models import Product

# Fix E-Commerce
Product.objects.filter(category__iexact='E-Commerce').update(category='ecommerce')
Product.objects.filter(category__iexact='e-commerce').update(category='ecommerce')

# Fix AI/ML  
Product.objects.filter(category__icontains='AI').update(category='ai-ml')

# Fix Finance/FinTech
Product.objects.filter(category__iexact='finance').update(category='fintech')

# List all products to verify
for p in Product.objects.all():
    print(f"{p.id}: {p.name} - {p.category}")
```

## Valid Categories (Backend)
The backend `account/models.py` accepts these exact values:
- `education`
- `healthcare`
- `fintech`
- `saas`
- `ai-ml`
- `ecommerce`
- `enterprise`
- `business`
- `productivity`
- `analytics`
- `communication`
- `development`
- `design`
- `marketing`

## Frontend Dropdown
The frontend dropdown in `temp_page.tsx` is correctly configured:
- **Value sent**: lowercase slug (e.g., `ecommerce`)
- **Label displayed**: human-readable (e.g., `E-Commerce`)

## Testing
1. Run the database fix above
2. Refresh the admin dashboard
3. Try editing a product
4. Select a category from the dropdown
5. Save - it should work now!
