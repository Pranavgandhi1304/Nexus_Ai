"""
Nexus AI – Mock Generator
Provides realistic AI responses when no API key is configured.
Powers a live demo without any external dependencies.
"""
import random
import json
from typing import Any, Dict, List


CAREER_OUTPUTS = [
    {
        "agent": "Career Agent",
        "analysis": "Based on your goal, I've identified critical skill gaps between your current profile and industry requirements.",
        "missing_skills": ["MLOps", "System Design", "LangChain/LangGraph", "Vector Databases", "Cloud Deployment (AWS/GCP)"],
        "learning_path": [
            {"week": "1-2", "focus": "Python Advanced + Data Structures", "hours": 14},
            {"week": "3-4", "focus": "Machine Learning Fundamentals", "hours": 20},
            {"week": "5-8", "focus": "Deep Learning + Transformers", "hours": 40},
            {"week": "9-12", "focus": "LLMs + Agentic AI + LangChain", "hours": 45},
        ],
        "career_plan": "Target ML Engineer → Senior AI Engineer → Lead AI Architect within 24 months.",
        "job_readiness_score": round(random.uniform(0.45, 0.75), 2),
        "debate_position": "Focus on building a strong employment foundation first. The AI market is competitive—employers want proven skills over unvalidated projects.",
        "confidence": 0.87,
    }
]

LEARNING_OUTPUTS = [
    {
        "agent": "Learning Agent",
        "weekly_plan": {
            "Week 1": ["Complete Python OOP mastery", "Solve 10 LeetCode medium problems", "Read 'Hands-On ML' Ch 1-3"],
            "Week 2": ["NumPy + Pandas deep dive", "Kaggle Titanic dataset project", "Andrew Ng ML Course Module 1-2"],
            "Week 3": ["Neural Networks from scratch", "Backpropagation implementation", "PyTorch basics"],
            "Week 4": ["CNN architecture study", "Transfer learning project", "Milestone review + quiz"],
        },
        "progress_metrics": {
            "completion_rate": "82% target",
            "knowledge_retention": "spaced repetition schedule",
            "practical_ratio": "60% coding : 40% theory",
        },
        "recommended_resources": [
            {"title": "fast.ai Practical Deep Learning", "type": "Course", "url": "https://fast.ai", "priority": "High"},
            {"title": "Andrej Karpathy's Neural Net Series", "type": "Video", "url": "https://youtube.com", "priority": "High"},
            {"title": "Hugging Face NLP Course", "type": "Course", "url": "https://huggingface.co/course", "priority": "Medium"},
            {"title": "Hands-On ML with Scikit-Learn & TF", "type": "Book", "url": "", "priority": "High"},
        ],
        "debate_position": "Structured learning with clear milestones is the foundation of any career pivot. Without systematic knowledge, entrepreneurial ventures and career transitions fail within 12 months.",
        "confidence": 0.91,
    }
]

STARTUP_OUTPUTS = [
    {
        "agent": "Startup Agent",
        "market_analysis": {
            "market_size": "$1.3 Trillion (Global AI Market by 2030)",
            "growth_rate": "36.2% CAGR",
            "key_players": ["OpenAI", "Anthropic", "Google DeepMind", "Mistral AI"],
            "gap_identified": "Affordable AI agents for SMBs in emerging markets",
        },
        "business_model": {
            "model": "SaaS + API marketplace",
            "revenue_streams": ["Subscription tiers ($29/$99/$299 per month)", "API usage credits", "Enterprise contracts", "Data insights marketplace"],
            "target_customer": "Startups, freelancers, and SMBs needing AI automation",
            "go_to_market": "Product Hunt launch → Dev community → B2B outreach",
        },
        "swot": {
            "strengths": ["First-mover advantage in agentic AI", "Low infra cost via API aggregation", "Network effect from user data"],
            "weaknesses": ["Dependency on LLM providers", "High customer acquisition cost", "Regulatory uncertainty"],
            "opportunities": ["India's $100B startup ecosystem", "AI adoption acceleration post-ChatGPT", "Government Digital India push"],
            "threats": ["OpenAI launching competing products", "Regulatory changes on AI data", "Big Tech incumbents"],
        },
        "mvp_roadmap": ["Week 1-2: Core agent API", "Week 3-4: Web interface", "Week 5-6: Beta users (50 users)", "Month 2-3: Revenue generation"],
        "debate_position": "The market window for AI-native startups is NOW. Waiting for traditional employment first means missing the 2024-2026 wave of AI infrastructure investment.",
        "confidence": 0.79,
    }
]

RESEARCH_OUTPUTS = [
    {
        "agent": "Research Agent",
        "key_insights": [
            "Agentic AI will replace 40% of knowledge worker tasks by 2027 (McKinsey 2024)",
            "India produces 1.5M engineers annually but only 8% are AI-ready",
            "Open-source LLMs (Llama, Mistral) have democratized AI development costs by 90%",
            "Multi-agent systems outperform single LLMs on complex reasoning by 3-5x",
        ],
        "trends": [
            {"trend": "Mixture of Experts (MoE) Architecture", "impact": "High", "timeline": "2024-2025"},
            {"trend": "Edge AI & On-device inference", "impact": "Medium", "timeline": "2025-2026"},
            {"trend": "AI Regulation (EU AI Act)", "impact": "High", "timeline": "2024"},
            {"trend": "Multimodal AI Agents", "impact": "Very High", "timeline": "2025"},
        ],
        "innovation_opportunities": [
            "Build AI agents for Indian language processing (Hindi, Tamil, Telugu)",
            "AgriTech AI: Precision farming recommendations for rural India",
            "AI-powered legal aid for affordable justice access",
            "Vernacular EdTech: Personalized tutoring in regional languages",
        ],
        "debate_position": "Data confirms the optimal path is skill-first → prototype → market entry. The research clearly supports a hybrid approach: build employable skills while developing a side project.",
        "confidence": 0.93,
    }
]

PRODUCTIVITY_OUTPUTS = [
    {
        "agent": "Productivity Agent",
        "daily_tasks": [
            "6:00-7:00 AM: Morning deep work – algorithm practice (LeetCode)",
            "9:00-11:00 AM: Primary learning block (course/book)",
            "2:00-4:00 PM: Project building / implementation",
            "7:00-8:00 PM: Review + planning next day",
            "8:00-9:00 PM: Community engagement (GitHub, Discord, LinkedIn)",
        ],
        "weekly_objectives": [
            "Complete 1 mini-project per week",
            "Write 1 technical blog post",
            "Apply to 5 opportunities (jobs/hackathons)",
            "Connect with 3 industry professionals",
            "Complete 80% of planned learning hours",
        ],
        "sprint_plan": [
            {"sprint": "Sprint 1 (Week 1-2)", "goal": "Foundation", "deliverable": "Portfolio project skeleton"},
            {"sprint": "Sprint 2 (Week 3-4)", "goal": "Core Skills", "deliverable": "Working ML model deployed"},
            {"sprint": "Sprint 3 (Week 5-6)", "goal": "Advanced AI", "deliverable": "LLM-powered application"},
            {"sprint": "Sprint 4 (Week 7-8)", "goal": "Launch", "deliverable": "Public portfolio + job applications"},
        ],
        "time_allocation": {
            "Deep Learning": "30%",
            "Project Building": "25%",
            "Job Applications": "20%",
            "Networking": "10%",
            "Health & Rest": "15%",
        },
        "debate_position": "Both career and startup paths require the same foundation: disciplined daily execution. I propose a hybrid productivity system that keeps both paths alive simultaneously.",
        "confidence": 0.88,
    }
]


CONSENSUS_TEMPLATES = [
    {
        "summary": "After rigorous multi-agent analysis and debate, here is the synthesized action plan:",
        "decision": "Hybrid Path: Career-First with Startup Incubation",
        "rationale": "The Career Agent and Research Agent data align: building strong AI skills over 12 weeks creates the credibility needed for both employment AND startup viability. The Startup Agent's market timing concern is valid—we address this by launching a GitHub portfolio and open-source side project immediately.",
        "phase_1": {
            "title": "Foundation (Weeks 1-4)",
            "actions": ["Complete Python + ML fundamentals", "Build 2 GitHub projects", "Apply to Google Summer of Code", "Start LinkedIn content creation"],
            "kpi": "80% course completion + 2 deployed projects",
        },
        "phase_2": {
            "title": "Specialization (Weeks 5-8)",
            "actions": ["Deep dive into LLMs + LangChain", "Build an AI agent project", "Attend 2 hackathons", "First 3 job applications"],
            "kpi": "1 AI agent in production + hackathon participation",
        },
        "phase_3": {
            "title": "Launch (Weeks 9-12)",
            "actions": ["Apply to 20+ positions", "Submit startup idea to incubators", "Publish 4 technical articles", "Build initial user base for side project"],
            "kpi": "Interview calls + 50 users on side project",
        },
        "success_probability": round(random.uniform(0.72, 0.89), 2),
    }
]


def generate_agent_outputs(goal: str, twin_context: Dict = None) -> Dict[str, Any]:
    """Generate realistic mock outputs for all agents based on user goal."""
    
    goal_lower = goal.lower()
    
    # Determine category from goal
    category = "general"
    if any(w in goal_lower for w in ["career", "job", "engineer", "work", "placement"]):
        category = "career"
    elif any(w in goal_lower for w in ["startup", "business", "launch", "entrepreneur"]):
        category = "startup"
    elif any(w in goal_lower for w in ["learn", "study", "gate", "exam", "course", "skill"]):
        category = "learning"
    elif any(w in goal_lower for w in ["research", "paper", "thesis", "phd"]):
        category = "research"
    elif any(w in goal_lower for w in ["hackathon", "win", "compete", "competition"]):
        category = "hackathon"
    
    career_out = CAREER_OUTPUTS[0].copy()
    learning_out = LEARNING_OUTPUTS[0].copy()
    startup_out = STARTUP_OUTPUTS[0].copy()
    research_out = RESEARCH_OUTPUTS[0].copy()
    productivity_out = PRODUCTIVITY_OUTPUTS[0].copy()
    consensus = CONSENSUS_TEMPLATES[0].copy()
    
    # Personalize based on goal
    if "ai engineer" in goal_lower or "machine learning" in goal_lower:
        career_out["career_plan"] = "Target: AI Engineer at FAANG/Unicorn within 12 months → Senior MLE within 24 months"
    elif "startup" in goal_lower:
        career_out["career_plan"] = "Build startup with technical co-founder while maintaining consulting income"
    elif "gate" in goal_lower:
        learning_out["weekly_plan"]["Week 1"] = ["GATE CS syllabus audit", "Data Structures (Trees, Graphs)", "NPTEL lectures"]
        career_out["career_plan"] = "Target GATE score > 700 → IIT/NIT MTech admission → Research/PSU placement"
    elif "hackathon" in goal_lower:
        productivity_out["daily_tasks"][2] = "2:00-5:00 PM: Hackathon project sprint – build MVP feature"
        consensus["decision"] = "Hackathon Domination Strategy"
        consensus["rationale"] = "Win hackathons through rapid prototyping, strong presentation skills, and a differentiated AI use case that judges haven't seen before."
    
    return {
        "goal": goal,
        "category": category,
        "agents_activated": ["Career Agent", "Learning Agent", "Startup Agent", "Research Agent", "Productivity Agent"],
        "outputs": {
            "career": career_out,
            "learning": learning_out,
            "startup": startup_out,
            "research": research_out,
            "productivity": productivity_out,
        },
        "debate": [
            {
                "agent": "Career Agent",
                "emoji": "💼",
                "color": "#6366f1",
                "position": career_out["debate_position"],
                "timestamp": "0.8s",
            },
            {
                "agent": "Startup Agent",
                "emoji": "🚀",
                "color": "#f59e0b",
                "position": startup_out["debate_position"],
                "timestamp": "1.6s",
            },
            {
                "agent": "Research Agent",
                "emoji": "🔬",
                "color": "#10b981",
                "position": research_out["debate_position"],
                "timestamp": "2.4s",
            },
            {
                "agent": "Learning Agent",
                "emoji": "📚",
                "color": "#06b6d4",
                "position": learning_out["debate_position"],
                "timestamp": "3.2s",
            },
            {
                "agent": "Productivity Agent",
                "emoji": "⚡",
                "color": "#ec4899",
                "position": productivity_out["debate_position"],
                "timestamp": "4.0s",
            },
        ],
        "consensus": consensus,
    }


def generate_simulation(scenario: str, timeframe: int = 6, variables: Dict = None) -> Dict[str, Any]:
    """Generate a realistic future simulation."""
    vars_ = variables or {}
    hours_per_day = vars_.get("hours_per_day", 2)
    focus_area = vars_.get("focus_area", "AI Engineering")
    
    base_probability = min(0.95, 0.4 + (hours_per_day * 0.05) + random.uniform(0.05, 0.15))
    
    months = list(range(1, timeframe + 1))
    skill_growth = {
        f"Month {m}": {
            "Python": min(100, 30 + m * 10 + random.randint(-3, 5)),
            "Machine Learning": min(100, 10 + m * 12 + random.randint(-3, 5)),
            "Deep Learning": min(100, 5 + m * 11 + random.randint(-3, 5)),
            "LLMs": min(100, 0 + m * 14 + random.randint(-3, 5)),
            "System Design": min(100, 15 + m * 9 + random.randint(-3, 5)),
        } for m in months
    }
    
    timeline = [
        {"month": 1, "milestone": "Python + ML Fundamentals Complete", "probability": 0.92, "icon": "🎯"},
        {"month": 2, "milestone": "First ML Project Deployed", "probability": 0.85, "icon": "🚀"},
        {"month": 3, "milestone": "LLM Applications Built", "probability": 0.78, "icon": "🤖"},
        {"month": 4, "milestone": "Portfolio Launch + Job Applications", "probability": 0.71, "icon": "💼"},
        {"month": 5, "milestone": "Interview Rounds + Hackathon Win", "probability": 0.65, "icon": "🏆"},
        {"month": 6, "milestone": "Job Offer / Startup Launch", "probability": round(base_probability, 2), "icon": "⭐"},
    ][:timeframe]
    
    return {
        "scenario": scenario,
        "timeframe_months": timeframe,
        "variables": vars_,
        "success_probability": round(base_probability, 2),
        "readiness_score": round(base_probability * 0.9, 2),
        "skill_growth": skill_growth,
        "opportunity_forecast": [
            {"opportunity": "ML Engineer Role at Startup", "probability": 0.72, "timeline": "Month 4-5"},
            {"opportunity": "Freelance AI Projects", "probability": 0.85, "timeline": "Month 3+"},
            {"opportunity": "Open Source Contributor Recognition", "probability": 0.68, "timeline": "Month 2+"},
            {"opportunity": "Speaking at Tech Events", "probability": 0.45, "timeline": "Month 5+"},
        ],
        "risks": [
            {"risk": "Burnout from aggressive schedule", "probability": 0.35, "mitigation": "Schedule mandatory rest days"},
            {"risk": "Market saturation in AI roles", "probability": 0.4, "mitigation": "Specialize in niche (AgriTech AI, LegalTech)"},
            {"risk": "Technology stack becoming outdated", "probability": 0.25, "mitigation": "Focus on fundamentals + stay updated"},
        ],
        "timeline": timeline,
    }


def generate_project_blueprint(idea: str) -> Dict[str, Any]:
    """Generate a complete project blueprint for a given idea."""
    idea_lower = idea.lower()
    
    # Choose appropriate tech stack based on idea
    if any(w in idea_lower for w in ["ai", "ml", "chatbot", "llm", "agent"]):
        tech_stack = {
            "frontend": ["Next.js 15", "TypeScript", "TailwindCSS", "Framer Motion"],
            "backend": ["FastAPI", "Python 3.12", "LangChain", "LangGraph"],
            "ai_layer": ["OpenAI GPT-4o", "LangChain", "Pinecone/ChromaDB", "Whisper"],
            "database": ["PostgreSQL", "Redis", "Pinecone (Vector DB)"],
            "deployment": ["Vercel (Frontend)", "Railway (Backend)", "Docker"],
        }
    elif any(w in idea_lower for w in ["ecommerce", "shop", "store", "marketplace"]):
        tech_stack = {
            "frontend": ["Next.js 15", "TypeScript", "TailwindCSS", "Zustand"],
            "backend": ["Node.js", "Express", "Stripe API"],
            "database": ["PostgreSQL", "Redis"],
            "deployment": ["Vercel", "Railway", "Cloudflare"],
        }
    else:
        tech_stack = {
            "frontend": ["React + Vite", "TypeScript", "TailwindCSS"],
            "backend": ["FastAPI", "Python"],
            "database": ["PostgreSQL", "Redis"],
            "deployment": ["Vercel", "Railway"],
        }
    
    return {
        "idea": idea,
        "tech_stack": tech_stack,
        "architecture": {
            "pattern": "Microservices with API Gateway",
            "components": [
                {"name": "Frontend SPA", "tech": tech_stack["frontend"][0], "responsibility": "User interface and state management"},
                {"name": "API Gateway", "tech": "FastAPI/Express", "responsibility": "Route requests, auth, rate limiting"},
                {"name": "Core Service", "tech": "Python/Node.js", "responsibility": "Business logic and AI orchestration"},
                {"name": "Database Layer", "tech": "PostgreSQL + Redis", "responsibility": "Persistent storage and caching"},
                {"name": "AI Pipeline", "tech": "LangChain + LangGraph", "responsibility": "Multi-agent coordination and inference"},
            ],
        },
        "database_design": {
            "tables": [
                {"name": "users", "columns": ["id", "email", "name", "created_at"]},
                {"name": "sessions", "columns": ["id", "user_id", "data", "timestamp"]},
                {"name": "outputs", "columns": ["id", "session_id", "content", "type"]},
            ]
        },
        "dev_roadmap": [
            {"sprint": 1, "week": "Week 1-2", "goal": "Project Setup & Core Architecture", "tasks": ["Repo setup", "Database schema", "API skeleton", "Auth integration"]},
            {"sprint": 2, "week": "Week 3-4", "goal": "Core Features", "tasks": ["Main CRUD operations", "UI components", "AI integration", "Testing"]},
            {"sprint": 3, "week": "Week 5-6", "goal": "Advanced Features + Polish", "tasks": ["Real-time features", "Mobile responsiveness", "Performance optimization", "Error handling"]},
            {"sprint": 4, "week": "Week 7-8", "goal": "Deployment & Launch", "tasks": ["CI/CD setup", "Staging deployment", "Beta testing", "Production launch"]},
        ],
        "deployment_strategy": {
            "staging": "Railway free tier for backend + Vercel preview for frontend",
            "production": "Railway Pro + Vercel Pro + Cloudflare CDN",
            "ci_cd": "GitHub Actions for automated testing and deployment",
            "monitoring": "Sentry for errors + Grafana for metrics + Uptime Robot",
            "estimated_cost": "$25-50/month for production infrastructure",
        },
    }
