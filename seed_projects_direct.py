import os
import sys
import django

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()

from account.models import Project

def seed_projects():
    """Seed projects from diracai.com/projects into the database"""
    
    projects_data = [
        {
            "title": "DashoApp Mobile App",
            "slug": "dashoapp-mobile-app",
            "description": "A comprehensive mobile application for business management and analytics",
            "bullets": [
                "Real-time dashboard analytics",
                "Multi-platform support (iOS & Android)",
                "Secure data synchronization",
                "Offline mode capabilities"
            ],
            "links": [],
            "external_image_url": "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800",
            "technologies": ["React Native", "Node.js", "MongoDB", "Redux"],
            "is_active": True,
            "category": "mobile",
            "status": "completed",
            "shortDescription": "Comprehensive mobile business management app"
        },
        {
            "title": "No-Code Trading Platform",
            "slug": "no-code-trading-platform",
            "description": "Revolutionary trading platform with no-code automation for retail investors",
            "bullets": [
                "Drag-and-drop strategy builder",
                "Real-time market data integration",
                "Backtesting capabilities",
                "Risk management tools"
            ],
            "links": [],
            "external_image_url": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
            "technologies": ["React", "Python", "PostgreSQL", "WebSocket"],
            "is_active": True,
            "category": "fintech",
            "status": "completed",
            "shortDescription": "No-code automation for retail trading"
        },
        {
            "title": "Invoice Builder",
            "slug": "invoice-builder",
            "description": "Smart invoicing solution for small businesses and freelancers",
            "bullets": [
                "Customizable invoice templates",
                "Automated payment reminders",
                "Multi-currency support",
                "Tax calculation and reporting"
            ],
            "links": [],
            "external_image_url": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800",
            "technologies": ["Vue.js", "Laravel", "MySQL", "Stripe API"],
            "is_active": True,
            "category": "saas",
            "status": "completed",
            "shortDescription": "Smart invoicing for small businesses"
        },
        {
            "title": "Nijje Self-Learning App",
            "slug": "nijje-self-learning-app",
            "description": "AI-powered personalized learning platform for students",
            "bullets": [
                "Adaptive learning algorithms",
                "Progress tracking and analytics",
                "Gamification features",
                "Interactive practice modules"
            ],
            "links": [],
            "external_image_url": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800",
            "technologies": ["React", "Python", "TensorFlow", "Firebase"],
            "is_active": True,
            "category": "edtech",
            "status": "completed",
            "shortDescription": "AI-powered personalized learning platform"
        },
        {
            "title": "HelloToppers",
            "slug": "hellotoppers",
            "description": "Educational platform connecting top performers with aspiring students",
            "bullets": [
                "Mentor-mentee matching system",
                "Live video sessions",
                "Study material repository",
                "Performance analytics"
            ],
            "links": [],
            "external_image_url": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
            "technologies": ["Angular", "Django", "PostgreSQL", "WebRTC"],
            "is_active": True,
            "category": "edtech",
            "status": "completed",
            "shortDescription": "Connect top performers with students"
        },
        {
            "title": "DashoApp Web Platform",
            "slug": "dashoapp-web-platform",
            "description": "Enterprise-grade web platform for business intelligence and analytics",
            "bullets": [
                "Advanced data visualization",
                "Custom report generation",
                "Team collaboration tools",
                "API integration capabilities"
            ],
            "links": [],
            "external_image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
            "technologies": ["React", "Node.js", "MongoDB", "D3.js"],
            "is_active": True,
            "category": "enterprise",
            "status": "completed",
            "shortDescription": "Enterprise business intelligence platform"
        }
    ]
    
    print(f"Seeding {len(projects_data)} projects...")
    
    created_count = 0
    updated_count = 0
    
    for project_data in projects_data:
        slug = project_data.get('slug')
        if not slug:
            print(f"Skipping project without slug: {project_data.get('title')}")
            continue
        
        # Extract defaults (everything except slug)
        defaults = {k: v for k, v in project_data.items() if k != 'slug'}
        
        project, created = Project.objects.update_or_create(
            slug=slug,
            defaults=defaults
        )
        
        if created:
            created_count += 1
            print(f"✅ Created: {project.title} (ID: {project.id})")
        else:
            updated_count += 1
            print(f"🔄 Updated: {project.title} (ID: {project.id})")
    
    print(f"\n{'='*50}")
    print(f"✨ Seeding complete!")
    print(f"   Created: {created_count} projects")
    print(f"   Updated: {updated_count} projects")
    print(f"   Total: {created_count + updated_count} projects")
    print(f"{'='*50}")

if __name__ == "__main__":
    seed_projects()
