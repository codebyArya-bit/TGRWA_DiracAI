import sqlite3

conn = sqlite3.connect('db.sqlite3')
cursor = conn.cursor()
cursor.execute('SELECT id, name, category FROM account_product')
rows = cursor.fetchall()

print('Current products in database:')
print('-' * 60)
for row in rows:
    print(f'ID {row[0]}: {row[1]}')
    print(f'  Category: "{row[2]}"')
    print()

conn.close()
