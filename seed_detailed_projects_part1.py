import os, sys, django
sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()
from account.models import Project

# Complete project data with ALL details
PROJECTS = [
    {
        "title": "DashoApp Mobile App", "slug": "dashoapp-mobile-app", "category": "edtech", "status": "completed",
        "shortDescription": "Educational institution management platform",
        "description": "Comprehensive mobile app for educational institutions to manage students, faculty, courses, and admin tasks with real-time notifications, attendance, grades, and parent-teacher communication.",
        "client": "Multiple Educational Institutions", "team": "6 developers", "timeline": "12 months",
        "technologies": ["React Native", "Firebase", "Node.js", "MongoDB", "Redux", "TypeScript"],
        "bullets": ["Real-time notifications", "Biometric attendance", "Grade management", "Parent-teacher portal", "Offline-first", "Multi-language"],
        "challenges": ["Offline sync for thousands of users", "Biometric integration", "Student data privacy", "Multi-language support"],
        "outcomes": ["50+ institutions deployed", "40% admin overhead reduction", "95% satisfaction", "100K+ daily transactions"],
        "stats": [{"label": "Institutions", "value": "50+"}, {"label": "Users", "value": "25K+"}, {"label": "Rating", "value": "4.8/5"}],
        "external_image_url": "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800", "is_active": True
    },
    {
        "title": "No-Code Trading Platform", "slug": "no-code-trading-platform", "category": "fintech", "status": "completed",
        "shortDescription": "AI-powered trading strategy optimization",
        "description": "Revolutionary platform empowering retail investors to create, test, and deploy automated trading strategies without code. Features AI optimization and real-time market data.",
        "client": "FinTech Startup", "team": "8 developers", "timeline": "12 months",
        "technologies": ["Python", "React", "TensorFlow", "PostgreSQL", "WebSocket", "Docker", "Kubernetes"],
        "bullets": ["Drag-drop strategy builder", "Real-time market data", "Backtesting engine", "AI optimization", "Risk management", "Paper trading"],
        "challenges": ["Multi-exchange real-time data", "Accurate backtesting", "24/7 zero-downtime", "High-frequency trading"],
        "outcomes": ["10K+ strategies created", "$50M+ trading volume", "99.9% uptime", "15% AI performance improvement"],
        "stats": [{"label": "Traders", "value": "5K+"}, {"label": "Volume", "value": "$50M+"}, {"label": "Uptime", "value": "99.9%"}],
        "external_image_url": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800", "is_active": True
    },
    {
        "title": "DI Invoice", "slug": "di-invoice", "category": "saas", "status": "completed",
        "shortDescription": "Free production-ready SaaS invoicing platform",
        "description": "Complete invoicing for businesses: create orgs, manage customers, generate GST invoices, track payments, handle billing. Free with no hidden costs.",
        "client": "Open Source Community", "team": "2 developers", "timeline": "3 months",
        "technologies": ["React", "PDF.js", "Django", "PostgreSQL", "Stripe API"],
        "bullets": ["Multi-org management", "Customer database", "GST-compliant invoices", "Payment reminders", "Payment tracking", "PDF/Excel export"],
        "challenges": ["Complex GST calculations", "Pixel-perfect PDFs", "Multi-currency accuracy", "Data isolation"],
        "outcomes": ["2.5K+ organizations", "50K+ invoices", "$100K saved in costs", "95% paid within 30 days"],
        "stats": [{"label": "Orgs", "value": "2.5K+"}, {"label": "Invoices", "value": "50K+"}, {"label": "Savings", "value": "$100K+"}],
        "external_image_url": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800", "is_active": True, "liveUrl": "https://diinvoice.com"
    }
]

for p in PROJECTS:
    Project.objects.update_or_create(slug=p['slug'], defaults={k:v for k,v in p.items() if k!='slug'})
    print(f"✅ {p['title']}")

print(f"\n✨ Seeded {len(PROJECTS)} projects with complete details!")
