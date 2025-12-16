import os, sys, django
sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()
from account.models import Project

BATCH_2 = [
    {
        "title": "Nijje Self-Learning App", "slug": "nijje-self-learning-app", "category": "edtech", "status": "completed",
        "shortDescription": "AI-powered personalized education",
        "description": "AI-driven learning platform that adapts to each student's pace and style. Features personalized learning paths, real-time progress tracking, gamification, and interactive practice modules.",
        "client": "EdTech Startup", "team": "5 developers", "timeline": "10 months",
        "technologies": ["Flutter", "Python", "TensorFlow", "Firebase", "Node.js", "MongoDB", "AWS"],
        "bullets": ["Adaptive learning algorithms", "Real-time progress tracking", "Gamification elements", "Interactive practice modules", "Personalized learning paths", "AI-powered recommendations"],
        "challenges": ["Building accurate student learning models", "Scaling AI recommendations", "Engaging UI for different age groups", "Offline learning support"],
        "outcomes": ["15K+ active students", "30% improvement in test scores", "85% course completion rate", "Featured in top EdTech apps"],
        "stats": [{"label": "Students", "value": "15K+"}, {"label": "Score Improvement", "value": "30%"}, {"label": "Completion", "value": "85%"}],
        "external_image_url": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800", "is_active": True
    },
    {
        "title": "HelloToppers", "slug": "hellotoppers", "category": "edtech", "status": "completed",
        "shortDescription": "Peer-to-peer learning platform",
        "description": "Connect top academic performers with aspiring students for mentorship. Features mentor-mentee matching, live video sessions, study material sharing, and performance analytics.",
        "client": "Education Non-Profit", "team": "6 developers", "timeline": "9 months",
        "technologies": ["React", "Node.js", "MongoDB", "WebRTC", "Socket.io", "AWS S3", "Redis"],
        "bullets": ["Smart mentor-mentee matching algorithm", "HD video sessions with whiteboard", "Study material repository", "Performance analytics dashboard", "Scheduling and calendar integration", "Payment integration for premium features"],
        "challenges": ["Implementing stable video conferencing", "Matching algorithm accuracy", "Content moderation at scale", "Handling peak concurrent sessions"],
        "outcomes": ["10K+ students matched with mentors", "1M+ study materials shared", "95% student satisfaction", "500+ hours of sessions weekly"],
        "stats": [{"label": "Matches", "value": "10K+"}, {"label": "Materials", "value": "1M+"}, {"label": "Satisfaction", "value": "95%"}],
        "external_image_url": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800", "is_active": True
    },
    {
        "title": "DashoApp Web Platform", "slug": "dashoapp-web-platform", "category": "edtech", "status": "completed",
        "shortDescription": "Educational institution management system",
        "description": "Comprehensive web-based platform for managing educational institutions. Handles admissions, academics, finance, HR, and communications in one unified system.",
        "client": "Multiple Universities", "team": "8 full-stack developers", "timeline": "1 Year",
        "technologies": ["React.js", "Node.js", "PostgreSQL", "Redis", "Docker", "Nginx", "AWS EC2"],
        "bullets": ["Complete student lifecycle management", "Online admissions portal", "Academic management and timetabling", "Finance and fee management", "HR and payroll integration", "Parent portal and mobile app sync"],
        "challenges": ["Migrating legacy data from multiple systems", "Ensuring 99.9% uptime during exams", "Handling 50K+ concurrent users", "Multi-campus deployment"],
        "outcomes": ["20+ institutions using platform", "500K+ students managed", "Rs 50Cr+ fees processed annually", "60% reduction in admin costs"],
        "stats": [{"label": "Institutions", "value": "20+"}, {"label": "Students", "value": "500K+"}, {"label": "Fees Processed", "value": "₹50Cr+"}],
        "external_image_url": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800", "is_active": True
    },
    {
        "title": "DSpace Court System", "slug": "dspace-court-system", "category": "govtech", "status": "completed",
        "shortDescription": "Digital document management for courts",
        "description": "Comprehensive digital case management system for court operations. Features electronic filing, document management, case tracking, hearing scheduling, and judgment archival.",
        "client": "State Judiciary", "team": "7 developers", "timeline": "14 months",
        "technologies": ["Java", "Angular", "PostgreSQL", "Elasticsearch", "Apache Solr", "Kubernetes", "MinIO"],
        "bullets": ["E-filing with digital signatures", "Automated case number generation", "Hearing scheduling and calendar", "Document search and retrieval", "Judge assignment algorithms", "Mobile app for lawyers and litigants"],
        "challenges": ["Ensuring legal compliance and security", "Digitizing 10+ years of physical records", "Multi-language support for regional courts", "Integration with existing government systems"],
        "outcomes": ["50+ court complexes deployed", "2M+ cases digitized", "70% reduction in paper usage", "90% faster case retrieval"],
        "stats": [{"label": "Courts", "value": "50+"}, {"label": "Cases Digitized", "value": "2M+"}, {"label": "Paper Saved", "value": "70%"}],
        "external_image_url": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800", "is_active": True
    }
]

print("\n" + "="*70)
print("BATCH 2: SEEDING 4 MORE PROJECTS")
print("="*70 + "\n")

for p in BATCH_2:
    project, created = Project.objects.update_or_create(slug=p['slug'], defaults={k:v for k,v in p.items() if k!='slug'})
    status = "CREATED" if created else "UPDATED"
    print(f"✅ {status}: {p['title']}")
    print(f"   Team: {p['team']} | Timeline: {p['timeline']}")
    print(f"   Technologies: {len(p['technologies'])} | Outcomes: {len(p['outcomes'])}\n")

print("=" * 70)
print(f"✨ Batch 2 Complete! {len(BATCH_2)} projects seeded.")
print(f"📊 Total so far: {Project.objects.count()} projects in database")
print("="*70)
