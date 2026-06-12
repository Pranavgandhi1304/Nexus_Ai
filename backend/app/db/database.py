from sqlmodel import SQLModel, create_engine, Session
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.config import settings
import json


# Create async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
)

async_session_maker = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def init_db():
    """Initialize database and seed data."""
    async with engine.begin() as conn:
        from app.db.models import (
            User, DigitalTwin, Goal, Project, Session as UserSession,
            Message, Agent, AgentOutput, Roadmap, Opportunity, Simulation, Analytics
        )
        await conn.run_sync(SQLModel.metadata.create_all)
    
    await seed_agents()
    await seed_opportunities()


async def get_session():
    """Dependency for getting async database session."""
    async with async_session_maker() as session:
        yield session


async def seed_agents():
    """Seed the agents table with our 5 specialist agents."""
    from app.db.models import Agent
    from sqlmodel import select
    
    agents_data = [
        {
            "name": "Career Agent",
            "role": "career_advisor",
            "description": "Expert in career planning, resume analysis, skill gap detection, and job readiness assessment.",
            "capabilities": json.dumps(["Resume Analysis", "Skill Gap Detection", "Career Roadmaps", "Job Readiness Scoring", "Interview Preparation"]),
            "avatar_emoji": "💼",
            "color": "#6366f1",
        },
        {
            "name": "Learning Agent",
            "role": "learning_advisor",
            "description": "Designs personalized learning plans, adaptive study roadmaps, and tracks skill acquisition progress.",
            "capabilities": json.dumps(["Personalized Learning Plans", "Adaptive Study Roadmaps", "Skill Tracking", "Weekly Goals", "Resource Curation"]),
            "avatar_emoji": "📚",
            "color": "#06b6d4",
        },
        {
            "name": "Startup Agent",
            "role": "startup_advisor",
            "description": "Analyzes markets, designs business models, and creates monetization strategies for entrepreneurs.",
            "capabilities": json.dumps(["Market Research", "Competitor Analysis", "Business Model Design", "Revenue Planning", "SWOT Analysis"]),
            "avatar_emoji": "🚀",
            "color": "#f59e0b",
        },
        {
            "name": "Research Agent",
            "role": "research_advisor",
            "description": "Explores topics, analyzes trends, identifies opportunities, and synthesizes research findings.",
            "capabilities": json.dumps(["Topic Exploration", "Trend Analysis", "Opportunity Discovery", "Research Summaries", "Innovation Mapping"]),
            "avatar_emoji": "🔬",
            "color": "#10b981",
        },
        {
            "name": "Productivity Agent",
            "role": "productivity_advisor",
            "description": "Breaks down goals into sprints, allocates time, and manages priorities for maximum output.",
            "capabilities": json.dumps(["Goal Breakdown", "Sprint Planning", "Time Allocation", "Priority Management", "Progress Tracking"]),
            "avatar_emoji": "⚡",
            "color": "#ec4899",
        },
    ]
    
    async with async_session_maker() as session:
        for agent_data in agents_data:
            existing = await session.exec(select(Agent).where(Agent.name == agent_data["name"]))
            if not existing.first():
                agent = Agent(**agent_data)
                session.add(agent)
        await session.commit()


async def seed_opportunities():
    """Seed sample opportunities for the radar."""
    from app.db.models import Opportunity
    from sqlmodel import select
    from datetime import datetime, timedelta
    
    opportunities_data = [
        {
            "title": "Smart India Hackathon 2025",
            "organization": "Government of India",
            "category": "hackathon",
            "description": "India's biggest hackathon open to all college students. Build solutions for real government problems.",
            "deadline": datetime.utcnow() + timedelta(days=45),
            "url": "https://www.sih.gov.in",
            "prize_or_benefit": "₹1,00,000 cash prize + mentorship",
            "tags": json.dumps(["AI", "ML", "Web Dev", "Mobile", "IoT", "Blockchain"]),
        },
        {
            "title": "Google Summer of Code 2025",
            "organization": "Google",
            "category": "research",
            "description": "Contribute to open source projects under Google mentorship over summer.",
            "deadline": datetime.utcnow() + timedelta(days=30),
            "url": "https://summerofcode.withgoogle.com",
            "prize_or_benefit": "$1500-$3300 stipend",
            "tags": json.dumps(["Open Source", "Python", "ML", "Web Dev", "Systems"]),
        },
        {
            "title": "Microsoft Intern – AI Platform",
            "organization": "Microsoft",
            "category": "internship",
            "description": "Summer internship on the Azure AI platform team. Work on cutting-edge LLM infrastructure.",
            "deadline": datetime.utcnow() + timedelta(days=20),
            "url": "https://careers.microsoft.com",
            "prize_or_benefit": "₹80,000/month + PPO opportunity",
            "tags": json.dumps(["AI", "LLM", "Python", "Azure", "Machine Learning"]),
        },
        {
            "title": "GATE 2026 – CS/DA",
            "organization": "IIT Roorkee",
            "category": "competition",
            "description": "Graduate Aptitude Test in Engineering for CS and Data Science streams.",
            "deadline": datetime.utcnow() + timedelta(days=120),
            "url": "https://gate2026.iitr.ac.in",
            "prize_or_benefit": "MTech/PhD/PSU admission + stipend",
            "tags": json.dumps(["Computer Science", "Data Science", "Algorithms", "Mathematics", "Machine Learning"]),
        },
        {
            "title": "Kalpana Chawla Scholarship",
            "organization": "AICTE",
            "category": "scholarship",
            "description": "Scholarship for meritorious women students pursuing technical education in India.",
            "deadline": datetime.utcnow() + timedelta(days=60),
            "url": "https://aicte-india.org",
            "prize_or_benefit": "₹50,000 per year",
            "tags": json.dumps(["Engineering", "Technology", "Women in STEM"]),
        },
        {
            "title": "Meta AI Research Residency",
            "organization": "Meta AI",
            "category": "research",
            "description": "One-year research program working with Meta AI scientists on frontier ML research.",
            "deadline": datetime.utcnow() + timedelta(days=90),
            "url": "https://ai.facebook.com/research",
            "prize_or_benefit": "$100,000+ annual compensation",
            "tags": json.dumps(["AI", "Machine Learning", "Deep Learning", "NLP", "Computer Vision"]),
        },
        {
            "title": "HackWithInfy 2025",
            "organization": "Infosys",
            "category": "hackathon",
            "description": "Infosys flagship hackathon for engineering students. Top performers get PPO at Infosys.",
            "deadline": datetime.utcnow() + timedelta(days=35),
            "url": "https://www.hackerrank.com/hackwithinfy",
            "prize_or_benefit": "₹3,00,000 + PPO",
            "tags": json.dumps(["Web Dev", "AI", "Cloud", "DevOps", "Full Stack"]),
        },
        {
            "title": "Amazon ML Summer School",
            "organization": "Amazon",
            "category": "research",
            "description": "Intensive 2-month ML program by Amazon scientists. Covers advanced ML topics.",
            "deadline": datetime.utcnow() + timedelta(days=15),
            "url": "https://mlss.amazon.com",
            "prize_or_benefit": "Free learning + Amazon merch + fast-track interviews",
            "tags": json.dumps(["Machine Learning", "Data Science", "Python", "Statistics"]),
        },
    ]
    
    async with async_session_maker() as session:
        existing = await session.exec(select(Opportunity))
        if existing.first():
            return
        for opp_data in opportunities_data:
            opp = Opportunity(**opp_data)
            session.add(opp)
        await session.commit()
