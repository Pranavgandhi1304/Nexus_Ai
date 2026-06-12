from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
import json
import uuid


def generate_id() -> str:
    return str(uuid.uuid4())


# ─── User ──────────────────────────────────────────────────────────────────────

class User(SQLModel, table=True):
    __tablename__ = "users"
    id: str = Field(default_factory=generate_id, primary_key=True)
    email: str = Field(unique=True, index=True)
    name: str
    hashed_password: Optional[str] = None
    avatar_url: Optional[str] = None
    clerk_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    digital_twin: Optional["DigitalTwin"] = Relationship(back_populates="user")
    goals: List["Goal"] = Relationship(back_populates="user")
    projects: List["Project"] = Relationship(back_populates="user")
    sessions: List["Session"] = Relationship(back_populates="user")
    simulations: List["Simulation"] = Relationship(back_populates="user")


# ─── Digital Twin ──────────────────────────────────────────────────────────────

class DigitalTwin(SQLModel, table=True):
    __tablename__ = "digital_twins"
    id: str = Field(default_factory=generate_id, primary_key=True)
    user_id: str = Field(foreign_key="users.id", unique=True, index=True)
    
    # JSON stored as strings for SQLite compatibility
    skills: str = Field(default="[]")           # JSON list of skills
    interests: str = Field(default="[]")        # JSON list
    current_goals: str = Field(default="[]")    # JSON list
    projects_summary: str = Field(default="[]") # JSON list
    career_stage: str = Field(default="Student")
    learning_progress: str = Field(default="{}")# JSON dict
    achievements: str = Field(default="[]")     # JSON list
    
    ai_readiness_score: float = Field(default=0.0)
    skill_score: float = Field(default=0.0)
    goal_completion_rate: float = Field(default=0.0)
    
    context_summary: str = Field(default="")   # Cross-session memory
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    user: Optional[User] = Relationship(back_populates="digital_twin")


# ─── Goal ──────────────────────────────────────────────────────────────────────

class Goal(SQLModel, table=True):
    __tablename__ = "goals"
    id: str = Field(default_factory=generate_id, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    title: str
    description: str
    category: str = Field(default="general")  # career, learning, startup, research, productivity
    status: str = Field(default="active")     # active, completed, paused
    progress: float = Field(default=0.0)
    target_date: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional[User] = Relationship(back_populates="goals")
    agent_outputs: List["AgentOutput"] = Relationship(back_populates="goal")
    roadmaps: List["Roadmap"] = Relationship(back_populates="goal")


# ─── Project ───────────────────────────────────────────────────────────────────

class Project(SQLModel, table=True):
    __tablename__ = "projects"
    id: str = Field(default_factory=generate_id, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    name: str
    description: str
    tech_stack: str = Field(default="[]")       # JSON list
    architecture: str = Field(default="{}")     # JSON dict
    database_design: str = Field(default="{}")  # JSON dict
    dev_roadmap: str = Field(default="[]")      # JSON list of sprints
    deployment_strategy: str = Field(default="{}") # JSON dict
    status: str = Field(default="planning")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional[User] = Relationship(back_populates="projects")


# ─── Session ───────────────────────────────────────────────────────────────────

class Session(SQLModel, table=True):
    __tablename__ = "sessions"
    id: str = Field(default_factory=generate_id, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    goal_input: str
    orchestrator_plan: str = Field(default="{}")
    agents_activated: str = Field(default="[]")
    status: str = Field(default="running")  # running, completed, failed
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None

    user: Optional[User] = Relationship(back_populates="sessions")
    messages: List["Message"] = Relationship(back_populates="session")
    agent_outputs: List["AgentOutput"] = Relationship(back_populates="session")


# ─── Message ───────────────────────────────────────────────────────────────────

class Message(SQLModel, table=True):
    __tablename__ = "messages"
    id: str = Field(default_factory=generate_id, primary_key=True)
    session_id: str = Field(foreign_key="sessions.id", index=True)
    role: str  # user, orchestrator, career_agent, learning_agent, startup_agent, research_agent, productivity_agent, consensus
    content: str
    agent_name: Optional[str] = None
    is_debate: bool = Field(default=False)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    session: Optional[Session] = Relationship(back_populates="messages")


# ─── Agent ─────────────────────────────────────────────────────────────────────

class Agent(SQLModel, table=True):
    __tablename__ = "agents"
    id: str = Field(default_factory=generate_id, primary_key=True)
    name: str = Field(unique=True)
    role: str
    description: str
    capabilities: str = Field(default="[]")  # JSON list
    avatar_emoji: str = Field(default="🤖")
    color: str = Field(default="#6366f1")
    is_active: bool = Field(default=True)

    outputs: List["AgentOutput"] = Relationship(back_populates="agent")


# ─── Agent Output ──────────────────────────────────────────────────────────────

class AgentOutput(SQLModel, table=True):
    __tablename__ = "agent_outputs"
    id: str = Field(default_factory=generate_id, primary_key=True)
    session_id: str = Field(foreign_key="sessions.id", index=True)
    goal_id: Optional[str] = Field(default=None, foreign_key="goals.id")
    agent_id: str = Field(foreign_key="agents.id")
    output_type: str  # analysis, roadmap, debate, consensus, simulation
    content: str      # JSON string of structured output
    summary: str      # Short summary for display
    confidence: float = Field(default=0.8)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    session: Optional[Session] = Relationship(back_populates="agent_outputs")
    goal: Optional[Goal] = Relationship(back_populates="agent_outputs")
    agent: Optional[Agent] = Relationship(back_populates="outputs")


# ─── Roadmap ───────────────────────────────────────────────────────────────────

class Roadmap(SQLModel, table=True):
    __tablename__ = "roadmaps"
    id: str = Field(default_factory=generate_id, primary_key=True)
    goal_id: str = Field(foreign_key="goals.id", index=True)
    title: str
    phase: str         # Week 1-4, Month 1-3, etc.
    tasks: str = Field(default="[]")      # JSON list
    resources: str = Field(default="[]")  # JSON list
    milestones: str = Field(default="[]") # JSON list
    status: str = Field(default="pending")
    order: int = Field(default=0)

    goal: Optional[Goal] = Relationship(back_populates="roadmaps")


# ─── Opportunity ───────────────────────────────────────────────────────────────

class Opportunity(SQLModel, table=True):
    __tablename__ = "opportunities"
    id: str = Field(default_factory=generate_id, primary_key=True)
    title: str
    organization: str
    category: str  # hackathon, internship, scholarship, competition, research
    description: str
    deadline: Optional[datetime] = None
    url: Optional[str] = None
    prize_or_benefit: Optional[str] = None
    tags: str = Field(default="[]")  # JSON list for skill matching
    is_active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ─── Simulation ────────────────────────────────────────────────────────────────

class Simulation(SQLModel, table=True):
    __tablename__ = "simulations"
    id: str = Field(default_factory=generate_id, primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    scenario: str
    timeframe_months: int = Field(default=6)
    variables: str = Field(default="{}")    # JSON dict (hours/day, capital, etc.)
    
    success_probability: float = Field(default=0.0)
    skill_growth: str = Field(default="{}")          # JSON dict
    opportunity_forecast: str = Field(default="[]")  # JSON list
    readiness_score: float = Field(default=0.0)
    timeline: str = Field(default="[]")              # JSON list of milestones
    risks: str = Field(default="[]")                 # JSON list
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional[User] = Relationship(back_populates="simulations")


# ─── Analytics ─────────────────────────────────────────────────────────────────

class Analytics(SQLModel, table=True):
    __tablename__ = "analytics"
    id: str = Field(default_factory=generate_id, primary_key=True)
    user_id: str = Field(index=True)
    event_type: str   # goal_created, session_run, simulation_run, opportunity_matched
    event_data: str = Field(default="{}")  # JSON
    created_at: datetime = Field(default_factory=datetime.utcnow)
