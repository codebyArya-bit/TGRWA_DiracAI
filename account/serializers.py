import json
from rest_framework import serializers
from .models import TeamMember, Project, GalleryItem, Product, ProductGallery

class TeamMemberSerializer(serializers.ModelSerializer):
    joinDate = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = TeamMember
        fields = '__all__'
        extra_kwargs = {
            'education': {'required': False, 'allow_null': True},
            'joinDate': {'required': False, 'allow_null': True},
            'skills': {'required': False},
            'image': {'required': False, 'allow_null': True},
        }

    def validate_status(self, value):
        if value.lower() == 'active':
            return 'Active'
        elif value.lower() == 'alumni':
            return 'Alumni'
        raise serializers.ValidationError('Invalid status choice')

    def to_internal_value(self, data):
        data = data.copy()
        json_fields = ['skills', 'achievements']
        for field in json_fields:
            if field in data:
                if isinstance(data[field], str):
                    try:
                        data[field] = json.loads(data[field])
                    except json.JSONDecodeError:
                        data[field] = []
                elif isinstance(data[field], list):
                     # Filter empty strings if necessary, though list is usually fine
                     pass
        return super().to_internal_value(data)

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        extra_kwargs = {
            'shortDescription': {'required': False, 'allow_blank': True},
            'description': {'required': False, 'allow_blank': True},
            'details': {'required': False, 'allow_blank': True},
            'client': {'required': False, 'allow_blank': True},
            'timeline': {'required': False, 'allow_blank': True},
            'team': {'required': False, 'allow_blank': True},
            'liveUrl': {'required': False, 'allow_blank': True},
            'videoUrl': {'required': False, 'allow_blank': True},
            'testimonial_name': {'required': False, 'allow_blank': True},
            'testimonial_role': {'required': False, 'allow_blank': True},
            'testimonial_image': {'required': False, 'allow_blank': True},
            'testimonial_quote': {'required': False, 'allow_blank': True},
            'image': {'required': False, 'allow_null': True},
        }

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Fallback to external_image_url if local image is missing
        if not ret.get('image') and instance.external_image_url:
            ret['image'] = instance.external_image_url
        return ret

    def to_internal_value(self, data):
        # Convert to dict to ensure we can assign lists/dicts freely
        if hasattr(data, 'dict'):
            data = data.dict()
        else:
            data = data.copy()
        
        json_fields = ['technologies', 'challenges', 'outcomes', 'stats', 'gallery']
        
        for field in json_fields:
            if field in data:
                if isinstance(data[field], str):
                    try:
                        data[field] = json.loads(data[field])
                        # If the loaded data is still a string (e.g. "Item"), wrap it in a list
                        # But 'stats' is a dict/list, 'gallery' is list.
                        if field in ['technologies', 'challenges', 'outcomes', 'gallery'] and isinstance(data[field], str):
                             data[field] = [data[field]]
                    except json.JSONDecodeError:
                        if field in ['technologies', 'gallery']:
                            data[field] = [item.strip() for item in data[field].split(',') if item.strip()]
                        elif field in ['challenges', 'outcomes']:
                            data[field] = [item.strip() for item in data[field].split('\n') if item.strip()]
                        else:
                            data[field] = {}
                elif isinstance(data[field], list):
                    data[field] = [item.strip() if isinstance(item, str) else item for item in data[field] if item]
        
        return super().to_internal_value(data)
    
    def validate_stats(self, value):
        if isinstance(value, dict) and not value:
            # Empty dict is allowed (converted to empty list or kept as dict if model allows)
            # Model defines stats as JSONField(default=dict)
            return value
            
        if not isinstance(value, list):
            raise serializers.ValidationError("Stats must be a list of objects (e.g. [{'label': 'Users', 'value': '100'}])")
        
        for stat in value:
            if not isinstance(stat, dict):
                raise serializers.ValidationError("Each stat must be an object")
            if 'label' not in stat and 'key' not in stat:
                 # Allow 'key' as alias for 'label' for backward compatibility
                 raise serializers.ValidationError("Each stat must have 'label' (or 'key') and 'value' fields")
        
        return value

class GalleryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryItem
        fields = '__all__'
        extra_kwargs = {
            'title': {'required': False, 'allow_blank': True},
            'description': {'required': False, 'allow_blank': True},
            'category': {'required': False},
        }

    def validate_category(self, value):
        valid_categories = ['office', 'events', 'celebration', 'others']
        if value not in valid_categories:
            raise serializers.ValidationError(
                f'Invalid category. Must be one of: {", ".join(valid_categories)}'
            )
        return value

# Add ProductGallery Serializer
class ProductGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductGallery
        fields = ['id', 'image', 'created_at']
        read_only_fields = ['id', 'created_at']

# Fixed Product Serializer
class ProductSerializer(serializers.ModelSerializer):
    # Add gallery_images field for reading (not for creation/update)
    gallery_images = ProductGallerySerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'tagline', 'iconText', 'cover', 'description', 
            'fullDescription', 'category', 'status', 'timeline', 'team_info', 'features', 'outcomes',
            'challenges', 'technologies', 'stats', 'gallery_images',  # Changed from 'gallery' to 'gallery_images'
            'platforms', 'integrations', 'support', 'liveUrl', 'demoUrl',
            'documentationUrl', 'featured', 'sortOrder', 'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'description': {'required': False, 'allow_blank': True},
            'fullDescription': {'required': False, 'allow_blank': True},
            'tagline': {'required': False, 'allow_blank': True},
            'iconText': {'required': False, 'allow_blank': True},
            'timeline': {'required': False, 'allow_blank': True},
            'team_info': {'required': False, 'allow_blank': True},
            'liveUrl': {'required': False, 'allow_blank': True},
            'demoUrl': {'required': False, 'allow_blank': True},
            'documentationUrl': {'required': False, 'allow_blank': True},
            'cover': {'required': False, 'allow_null': True},
        }

    def to_internal_value(self, data):
        data = data.copy()
        
        # Handle JSON string conversion for array fields (EXCLUDE GALLERY)
        json_fields = [
            'features', 'outcomes', 'challenges', 'technologies', 
            'stats', 'platforms', 'integrations', 'support'
            # REMOVED 'gallery' - we handle gallery images separately via ProductGallery model
        ]
        
        for field in json_fields:
            if field in data:
                if isinstance(data[field], str):
                    try:
                        data[field] = json.loads(data[field])
                    except json.JSONDecodeError:
                        if field in ['technologies', 'platforms', 'integrations', 'support']:
                            data[field] = [item.strip() for item in data[field].split(',') if item.strip()]
                        elif field in ['features', 'outcomes', 'challenges']:
                            data[field] = [item.strip() for item in data[field].split('\n') if item.strip()]
                        elif field == 'stats':
                            if data[field].strip():
                                data[field] = [{"label": "", "value": data[field]}]
                            else:
                                data[field] = []
                        else:
                            data[field] = []
                elif isinstance(data[field], list):
                    # Filter only actual None or empty strings, but keep 0 or False if valid
                    data[field] = [
                        item.strip() if isinstance(item, str) else item 
                        for item in data[field] 
                        if item is not None and (not isinstance(item, str) or item.strip() != "")
                    ]
        
        return super().to_internal_value(data)

    def validate_category(self, value):
        """
        Accept both category slugs and labels, convert labels to slugs.
        This provides backward compatibility and fixes frontend issues.
        """
        # Mapping of labels to slugs
        label_to_slug = {
            'E-Commerce': 'ecommerce',
            'eCommerce': 'ecommerce',
            'e-commerce': 'ecommerce',
            'AI & ML': 'ai-ml',
            'AI/ML': 'ai-ml',
            'ai': 'ai-ml',
            'FinTech': 'fintech',
            'Finance': 'fintech',
            'finance': 'fintech',
            'SaaS': 'saas',
            'Education': 'education',
            'Healthcare': 'healthcare',
            'Business': 'business',
            'Productivity': 'productivity',
            'Analytics': 'analytics',
            'Communication': 'communication',
            'Development': 'development',
            'Design': 'design',
            'Marketing': 'marketing',
            'Enterprise': 'enterprise',
        }
        
        # If it's a label, convert to slug
        if value in label_to_slug:
            return label_to_slug[value]
        
        # Otherwise return lowercase version (should be a slug already)
        return value.lower()
    
    def validate_stats(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Stats must be a list")
        
        for stat in value:
            if not isinstance(stat, dict):
                raise serializers.ValidationError("Each stat must be an object")
            if 'label' not in stat or 'value' not in stat:
                raise serializers.ValidationError("Each stat must have 'label' and 'value' fields")
        
        return value

    def create(self, validated_data):
        # Remove gallery_images from validated_data as it's read-only
        validated_data.pop('gallery_images', None)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Remove gallery_images from validated_data as it's read-only
        validated_data.pop('gallery_images', None)
        return super().update(instance, validated_data)