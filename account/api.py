import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import TeamMember, Project, GalleryItem, Product, ProductGallery
from .serializers import TeamMemberSerializer, ProjectSerializer, GalleryItemSerializer, ProductSerializer, ProductGallerySerializer


class AdminDashboardAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # optional: ensure staff/superuser
        if not (request.user.is_staff or request.user.is_superuser):
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        
        # Return admin user details
        # Return admin user details and counts
        stats = {
            "products": Product.objects.count(),
            "projects": Project.objects.count(),
            "team": TeamMember.objects.count(),
            "gallery": GalleryItem.objects.count()
        }
        
        return Response({
            "msg": "ok", 
            "stats": stats,
            "user": {
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
                "phoneno": request.user.phoneno,
            }
        })

    def delete(self, request, pk):
        member = TeamMember.objects.get(id=pk)
        member.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# ------------------ PROJECT API ------------------
class ProjectAPI(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return []  # No authentication required for GET
        return [IsAuthenticated()] 
    
    def get(self, request, pk=None):
        if pk is not None:
            try:
                project = Project.objects.get(pk=pk)
                serializer = ProjectSerializer(project)
                return Response(serializer.data)
            except Project.DoesNotExist:
                return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    def post(self, request):
        return self.handle_project_request(request)
    
    def put(self, request, pk=None):
        try:
            project = Project.objects.get(pk=pk)
        except (Project.DoesNotExist, ValueError):
            return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
        return self.handle_project_request(request, project, partial=False)

    def patch(self, request, pk=None):
        try:
            project = Project.objects.get(pk=pk)
        except (Project.DoesNotExist, ValueError):
            return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
        return self.handle_project_request(request, project, partial=True)

    def delete(self, request, pk=None):
        try:
            project = Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
        
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def handle_project_request(self, request, instance=None, partial=False):
        # Handle file upload and JSON data
        # We pass request.data directly to the serializer.
        # The serializer's to_internal_value method handles JSON parsing for fields like 'technologies', etc.
        
        print(f"=== DEBUG: PROJECT REQUEST ({request.method}) ===")
        # print(f"Data keys: {list(request.data.keys())}") 

        # Create or update the project
        if instance:
            serializer = ProjectSerializer(instance, data=request.data, partial=partial)
        else:
            serializer = ProjectSerializer(data=request.data)
            
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK if instance else status.HTTP_201_CREATED)
        
        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectBulkUpsertAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        items = request.data
        if not isinstance(items, list):
            return Response({"error": "Expected a list of items"}, status=status.HTTP_400_BAD_REQUEST)
        
        results = []
        for p in items:
            slug = p.get('slug')
            if not slug:
                continue
            
            # Use defaults to update everything except slug
            defaults = {
                'title': p.get('title', ''),
                'description': p.get('description', ''),
                'bullets': p.get('bullets', []),
                'links': p.get('links', []),
                'external_image_url': p.get('imageUrl'),
                'technologies': p.get('tech', []),
                'is_active': p.get('isActive', True),
                'status': 'ongoing' if p.get('isActive', True) else 'planned',
                # Fallback for other fields if needed, but defaults in model handle most.
            }
            
            project, created = Project.objects.update_or_create(
                slug=slug,
                defaults=defaults
            )
            results.append({'slug': slug, 'created': created, 'id': project.id})
            
        return Response({"count": len(results), "items": results}, status=status.HTTP_200_OK)


# ------------------ GALLERY API ------------------
class GalleryAPI(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return []  # No authentication required for GET
        return [IsAuthenticated()]  # Authentication required for POST, etc.

    def get(self, request):
        images = GalleryItem.objects.all().order_by("-created_at")
        serializer = GalleryItemSerializer(images, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = GalleryItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GalleryDetailAPI(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.request.method == 'GET':
            return []  # No authentication required for GET
        return [IsAuthenticated()]  # Authentication required for PUT, DELETE

    def get(self, request, pk):
        try:
            item = GalleryItem.objects.get(id=pk)
            serializer = GalleryItemSerializer(item)
            return Response(serializer.data)
        except GalleryItem.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            item = GalleryItem.objects.get(id=pk)
        except GalleryItem.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = GalleryItemSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        return self.put(request, pk)

    def delete(self, request, pk):
        try:
            item = GalleryItem.objects.get(id=pk)
        except GalleryItem.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class GallerySyncAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        import requests
        from django.core.files.base import ContentFile
        import urllib3
        import uuid
        
        # Disable SSL warnings
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
        
        print("Fetching live gallery data from diracai.com...")
        try:
            response = requests.get('https://diracai.com/api/gallery/', verify=False)
            response.raise_for_status()
            live_items = response.json()
            
            print(f"Found {len(live_items)} items on live site.")
            
            # Clear existing items
            GalleryItem.objects.all().delete()
            
            count = 0
            for item in live_items:
                title = item['title'][:150]
                category = item.get('category', 'office')
                if len(category) > 20:
                    category = 'others'
                description = item.get('description', '') or ''
                
                img_url = item['image']
                if not img_url.startswith('http'):
                    img_url = f"https://diracai.com{img_url}"
                    
                try:
                    img_resp = requests.get(img_url, verify=False)
                    img_resp.raise_for_status()
                    
                    gallery_item = GalleryItem(
                        title=title,
                        description=description,
                        category=category
                    )
                    
                    ext = 'jpg'
                    if '.png' in img_url.lower(): ext = 'png'
                    elif '.gif' in img_url.lower(): ext = 'gif'
                    
                    file_name = f"gallery_{uuid.uuid4().hex[:8]}.{ext}"
                    gallery_item.image.save(file_name, ContentFile(img_resp.content), save=True)
                    count += 1
                except Exception as e:
                    print(f"Error processing item {title}: {e}")
            
            # Return new list
            images = GalleryItem.objects.all().order_by("-created_at")
            serializer = GalleryItemSerializer(images, many=True)
            return Response({"message": f"Synced {count} items", "gallery": serializer.data}, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ------------------ PRODUCT API ------------------
class ProductAPI(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return []  # No authentication required for GET
        return [IsAuthenticated()]
    
    def get(self, request, pk=None):
        if pk:
            try:
                product = Product.objects.get(pk=pk)
                serializer = ProductSerializer(product)
                return Response(serializer.data)
            except Product.DoesNotExist:
                return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            products = Product.objects.all()
            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data)

    def post(self, request):
        return self.handle_product_request(request)
    
    def put(self, request, pk=None):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        return self.handle_product_request(request, product)

    def delete(self, request, pk=None):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def handle_product_request(self, request, instance=None):
     # Handle file upload and JSON data
     data = {key: value for key, value in request.data.items()}
     
     print("=== DEBUG: PRODUCT REQUEST DATA ===")
     print(f"Method: {request.method}")
     print(f"Instance: {instance}")
     print(f"FILES received: {list(request.FILES.keys())}")
     
     # ✅ FIX: Get ALL gallery files (gallery_0, gallery_1, etc.)
     gallery_files = []
     for key in request.FILES:
         if key.startswith('gallery_'):
             gallery_files.append(request.FILES[key])
     
     print(f"Gallery files found: {[f.name for f in gallery_files]}")
     
     for key, value in data.items():
         print(f"{key}: {repr(value)} (type: {type(value)})")

     # Handle cover image removal
     if data.get('remove_cover') == 'true' and instance:
         print("Removing cover image...")
         data['cover'] = None
 
     # Process JSON fields is now handled by ProductSerializer's to_internal_value
     # We don't need to manually parse strings here anymore as the serializer handles both
     # JSON strings and Python objects/lists correctly.


     print("=== DEBUG: PROCESSED PRODUCT DATA ===")
     for key, value in data.items():
         print(f"{key}: {repr(value)}")
 
 
     # Create or update the product
     if instance:
         serializer = ProductSerializer(instance, data=data, partial=True)
     else:
         serializer = ProductSerializer(data=data)
         
     if serializer.is_valid():
         product = serializer.save()
         
         # ✅ FIX: Use the gallery_files we collected earlier
         print(f"Processing {len(gallery_files)} gallery files for product {product.id}")
         
         for gallery_file in gallery_files:
             print(f"Creating gallery entry for: {gallery_file.name}")
             ProductGallery.objects.create(
                 product=product,
                 image=gallery_file
             )
         
         # Return the complete product data with gallery images
         response_serializer = ProductSerializer(product)
         return Response(response_serializer.data, status=status.HTTP_200_OK if instance else status.HTTP_201_CREATED)
     
     print("Product serializer errors:", serializer.errors)
     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ------------------ PRODUCT GALLERY API ------------------
class ProductGalleryAPI(APIView):
    parser_classes = [MultiPartParser, FormParser]
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return []  # No authentication required for GET
        return [IsAuthenticated()]

    def get(self, request, product_pk=None, gallery_pk=None):
        # Handle GET /api/products/gallery/ (all gallery images)
        if not product_pk and not gallery_pk:
            gallery_images = ProductGallery.objects.all().order_by("-created_at")
            serializer = ProductGallerySerializer(gallery_images, many=True)
            return Response(serializer.data)
        
        # Handle GET /api/products/<product_pk>/gallery/ (product-specific gallery)
        elif product_pk and not gallery_pk:
            gallery_images = ProductGallery.objects.filter(product_id=product_pk).order_by("-created_at")
            serializer = ProductGallerySerializer(gallery_images, many=True)
            return Response(serializer.data)
        
        # Handle GET /api/products/gallery/<gallery_pk>/ (single gallery item)
        elif gallery_pk:
            try:
                gallery_item = ProductGallery.objects.get(pk=gallery_pk)
                serializer = ProductGallerySerializer(gallery_item)
                return Response(serializer.data)
            except ProductGallery.DoesNotExist:
                return Response({'error': 'Gallery image not found'}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, product_pk=None):
        # Handle POST /api/products/<product_pk>/gallery/ (add images to product)
        if not product_pk:
            return Response({'error': 'Product ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            product = Product.objects.get(pk=product_pk)
        except Product.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        
        gallery_files = request.FILES.getlist('images')
        created_images = []
        
        for gallery_file in gallery_files:
            gallery_item = ProductGallery.objects.create(
                product=product,
                image=gallery_file
            )
            created_images.append(ProductGallerySerializer(gallery_item).data)
        
        return Response(created_images, status=status.HTTP_201_CREATED)

    def delete(self, request, gallery_pk=None, product_pk=None):
        # Handle DELETE /api/products/gallery/<gallery_pk>/
        if not gallery_pk:
            return Response({'error': 'Gallery image ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            gallery_item = ProductGallery.objects.get(pk=gallery_pk)
        except ProductGallery.DoesNotExist:
            return Response({'error': 'Gallery image not found'}, status=status.HTTP_404_NOT_FOUND)
        
        gallery_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
