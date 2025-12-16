
import requests
import os

BASE_URL = "http://127.0.0.1:8000/api"
LOGIN_URL = f"{BASE_URL}/token/"
PRODUCT_URL = f"{BASE_URL}/products/"

def test_image_removal():
    print("=== TESTING IMAGE REMOVAL ===")

    # 1. Login
    login_data = {"username": "admin", "password": "dirac23"}
    resp = requests.post(LOGIN_URL, json=login_data)
    if resp.status_code != 200:
        print("Login failed")
        return
    token = resp.json()['access']
    headers = {"Authorization": f"JWT {token}"}
    print("Login successful.")

    # 2. Create Product with Dummy Image
    # Create a valid minimal GIF
    with open("temp_test_image.gif", "wb") as f:
        f.write(b'GIF89a\x01\x00\x01\x00\x80\xff\x00\xff\xff\xff\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b')

    files = {'cover': open('temp_test_image.gif', 'rb')}
    data = {
        "name": "Image Removal Test Product",
        "tagline": "Test Tagline",
        "description": "Test Description",
        "fullDescription": "Test Full Description",
        "category": "education"
    }

    print("Creating product with image...")
    resp = requests.post(PRODUCT_URL, data=data, files=files, headers=headers)
    files['cover'].close()
    
    if resp.status_code != 201:
        print(f"Creation failed: {resp.text}")
        return
    
    product_id = resp.json()['id']
    print(f"Product created (ID: {product_id}). Checking for image...")
    
    if resp.json().get('cover'):
        print(f"Image confirmed present: {resp.json()['cover']}")
    else:
        print("Image NOT present after creation!")
        return

    # 3. Update to REMOVE Image
    print("\nSending update to remove cover image...")
    # NOTE: We construct FormData equivalent by sending data dict
    update_data = {
        "remove_cover": "true",
        "name": "Image Removed Product"
    }
    
    # We use PUT or PATCH. Admin dashboard uses PUT mostly, but we patched it.
    # Let's use PUT as confirmed by APIView methods.
    resp = requests.put(f"{PRODUCT_URL}{product_id}/", data=update_data, headers=headers)
    
    if resp.status_code == 200:
        updated_product = resp.json()
        print("Update successful.")
        
        # 4. Verify Removal
        print(f"Checking cover field: '{updated_product.get('cover')}'")
        
        if updated_product.get('cover') is None:
            print("\nSUCCESS: Image was successfully removed!")
        else:
            print(f"\nFAILURE: Image still exists: {updated_product['cover']}")
    else:
        print(f"Update failed: {resp.status_code} - {resp.text}")

    # Cleanup
    if os.path.exists("temp_test_image.gif"):
        os.remove("temp_test_image.gif")
    # requests.delete(f"{PRODUCT_URL}{product_id}/", headers=headers)

if __name__ == "__main__":
    test_image_removal()
