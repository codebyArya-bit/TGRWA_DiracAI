#!/usr/bin/env python
"""
Test script to create a product using multipart/form-data
This matches how the frontend form should submit data
"""
import requests
import json

# API endpoint
url = "http://127.0.0.1:8000/api/products/"

# Login first to get token
login_url = "http://127.0.0.1:8000/api/token/"
login_data = {
    "username": "admin",
    "password": "dirac23"
}

print("Logging in...")
login_response = requests.post(login_url, json=login_data)
if login_response.status_code == 200:
    token = login_response.json()['access']
    print(f"Login successful! Token: {token[:20]}...")
else:
    print(f"Login failed: {login_response.status_code}")
    print(login_response.text)
    exit(1)

# Product data as form data (matching the frontend form)
product_data = {
    "name": "DiracAI Platform",
    "tagline": "AI-Powered Workflow Automation",
    "iconText": "DA",
    "category": "education",
    "status": "In Development",
    "description": "A comprehensive AI platform for automating workflows",
    "fullDescription": "DiracAI is a cutting-edge platform that leverages artificial intelligence to streamline and automate complex business workflows.",
    # JSON fields as strings (will be parsed by the API)
    "features": json.dumps(["AI-Powered Automation", "Real-time Analytics", "Custom Integrations"]),
    "outcomes": json.dumps(["50% time savings", "Improved accuracy", "Better insights"]),
    "challenges": json.dumps(["Complex integration requirements", "Data security"]),
    "technologies": json.dumps(["Python", "Django", "React", "TensorFlow"]),
    "stats": json.dumps([
        {"label": "Users", "value": "1000+"},
        {"label": "Automations", "value": "500+"}
    ]),
    "platforms": json.dumps(["Web", "Mobile", "API"]),
    "integrations": json.dumps(["Slack", "Google Workspace", "Microsoft Teams"]),
    "support": json.dumps(["Email", "Chat", "Phone"]),
    "liveUrl": "https://diracai.com",
    "demoUrl": "https://demo.diracai.com",
    "documentationUrl": "https://docs.diracai.com",
    "featured": "true",
    "sortOrder": "1"
}

# Headers with authentication (NO Content-Type for multipart)
headers = {
    "Authorization": f"JWT {token}"
}

print("\nCreating product...")

response = requests.post(url, data=product_data, headers=headers)

if response.status_code in [200, 201]:
    print(f"\nProduct created successfully!")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
else:
    print(f"\nFailed to create product: {response.status_code}")
    print(f"Error: {response.text}")

# List all products
print("\nFetching all products...")
list_response = requests.get(url)
if list_response.status_code == 200:
    products = list_response.json()
    print(f"Found {len(products)} product(s)")
    for product in products:
        print(f"  - {product['name']} ({product['status']})")
else:
    print(f"Failed to fetch products: {list_response.status_code}")
