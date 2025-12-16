import os, sys, django
sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")
django.setup()
from account.models import Project

BATCH_3 = [
    {
        "title": "Llama3 Industry AI", "slug": "llama3-industry-ai", "category": "ai", "status": "completed",
        "shortDescription": "Fine-tuned LLM for specialized sectors",
        "description": "Custom fine-tuned large language model based on Llama3 for industry-specific applications. Specialized in legal, healthcare, and financial domains with domain-specific knowledge.",
        "client": "Enterprise Clients", "team": "3 ML engineers", "timeline": "7 months",
        "technologies": ["Python", "PyTorch", "CUDA", "Hugging Face", "Ray", "MLflow", "AWS SageMaker"],
        "bullets": ["Domain-specific fine-tuning", "RAG implementation for accuracy", "Low-latency inference optimization", "Multi-modal support (text + docs)", "Privacy-preserving deployment", "Continuous learning pipeline"],
        "challenges": ["Curating high-quality domain datasets", "Balancing model size vs performance", "Ensuring data privacy compliance", "Optimizing inference costs"],
        "outcomes": ["95% accuracy on domain tasks", "3x faster than GPT-4 for specific use cases", "Deployed for 5 enterprise clients", "60% cost reduction vs cloud APIs"],
        "stats": [{"label": "Accuracy", "value": "95%"}, {"label": "Speed vs GPT-4", "value": "3x"}, {"label": "Cost Saving", "value": "60%"}],
        "external_image_url": "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800", "is_active": True
    },
    {
        "title": "Assertive US Crypto", "slug": "assertive-us-crypto", "category": "blockchain", "status": "completed",
        "shortDescription": "Custom blockchain & cryptocurrency",
        "description": "Complete blockchain solution with custom cryptocurrency for secure, transparent transactions. Features smart contracts, DeFi capabilities, and regulatory compliance.",
        "client": "US-based FinTech", "team": "4 blockchain developers", "timeline": "11 months",
        "technologies": ["Solidity", "Web3.js", "React", "Ethereum", "IPFS", "Node.js", "MongoDB"],
        "bullets": ["Custom ERC-20 token implementation", "Smart contract audit and security", "DeFi staking and yield farming", "KYC/AML compliance integration", "Multi-signature wallet support", "Cross-chain bridge capabilities"],
        "challenges": ["Ensuring smart contract security", "Meeting US regulatory requirements", "Scaling transaction throughput", "Implementing gas-efficient contracts"],
        "outcomes": ["$10M+ in transactions processed", "Zero security breaches", "SEC compliance achieved", "1000+ active wallet users"],
        "stats": [{"label": "Transactions", "value": "$10M+"}, {"label": "Security", "value": "0 breaches"}, {"label": "Users", "value": "1000+"}],
        "external_image_url": "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800", "is_active": True
    },
    {
        "title": "EAtech Monitoring", "slug": "eatech-monitoring", "category": "devops", "status": "completed",
        "shortDescription": "Real-time server monitoring dashboard",
        "description": "Comprehensive monitoring solution for infrastructure and applications. Features real-time metrics, alerting, log aggregation, and custom dashboards for DevOps teams.",
        "client": "SaaS Company", "team": "3 DevOps engineers", "timeline": "5 months",
        "technologies": ["Grafana", "Prometheus", "Docker", "Kubernetes", "ELK Stack", "Ansible", "Terraform"],
        "bullets": ["Real-time infrastructure monitoring", "Custom alerting with PagerDuty integration", "Log aggregation and analysis", "Automated incident response", "Performance trending and forecasting", "Multi-cloud support (AWS, Azure, GCP)"],
        "challenges": ["Monitoring 500+ microservices", "Handling high cardinality metrics", "Reducing alert fatigue", "Ensuring monitoring system reliability"],
        "outcomes": ["99.99% monitoring uptime", "60% reduction in MTTR", "80% fewer false alerts", "Monitoring 10TB+ logs daily"],
        "stats": [{"label": "Uptime", "value": "99.99%"}, {"label": "MTTR Reduction", "value": "60%"}, {"label": "Logs/Day", "value": "10TB+"}],
        "external_image_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800", "is_active": True
    },
    {
        "title": "Health Institute IT", "slug": "health-institute-it", "category": "enterprise", "status": "completed",
        "shortDescription": "Complete IT & digital marketing solution",
        "description": "End-to-end IT infrastructure and digital presence for healthcare institute. Includes cloud migration, security hardening, website, SEO, and digital marketing.",
        "client": "Healthcare Institute", "team": "4 IT specialists", "timeline": "12 months",
        "technologies": ["AWS", "Microsoft 365", "WordPress", "Google Analytics", "Cloudflare", "Docker", "GitHub Actions"],
        "bullets": ["Cloud infrastructure on AWS", "Microsoft 365 business setup", "HIPAA-compliant security", "SEO-optimized website", "Social media management", "Email marketing automation"],
        "challenges": ["Migrating legacy systems without downtime", "Ensuring HIPAA compliance", "Training non-technical staff", "Balancing cost vs performance"],
        "outcomes": ["Zero downtime during migration", "150% increase in web traffic", "HIPAA certification achieved", "40% IT cost reduction"],
        "stats": [{"label": "Downtime", "value": "0 hours"}, {"label": "Traffic Growth", "value": "150%"}, {"label": "Cost Saving", "value": "40%"}],
        "external_image_url": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800", "is_active": True
    }
]

print("\n" + "="*70)
print("BATCH 3: SEEDING 4 MORE PROJECTS")
print("="*70 + "\n")

for p in BATCH_3:
    project, created = Project.objects.update_or_create(slug=p['slug'], defaults={k:v for k,v in p.items() if k!='slug'})
    status = "CREATED" if created else "UPDATED"
    print(f"✅ {status}: {p['title']}")
    print(f"   Category: {p['category']} | Team: {p['team']}\n")

print("="*70)
print(f"✨ Batch 3 Complete! Total: {Project.objects.count()} projects")
print("="*70)
