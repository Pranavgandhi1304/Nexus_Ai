"""AI Boardroom – agent opinions and debate history."""
from fastapi import APIRouter, Depends, Query
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from typing import Optional
import json

from app.db.database import get_session
from app.db.models import Agent, AgentOutput, Session as UserSession, Message

router = APIRouter()


@router.get("/agents")
async def get_agents(db: AsyncSession = Depends(get_session)):
    """Get all registered agents."""
    result = await db.exec(select(Agent).where(Agent.is_active == True))
    agents = result.all()
    return [
        {
            "id": a.id,
            "name": a.name,
            "role": a.role,
            "description": a.description,
            "capabilities": json.loads(a.capabilities),
            "avatar_emoji": a.avatar_emoji,
            "color": a.color,
        }
        for a in agents
    ]


@router.get("/latest/{user_id}")
async def get_latest_boardroom(user_id: str, db: AsyncSession = Depends(get_session)):
    """Get latest agent outputs and debate for a user."""
    # Get latest completed session
    session_result = await db.exec(
        select(UserSession)
        .where(UserSession.user_id == user_id, UserSession.status == "completed")
        .order_by(UserSession.created_at.desc())
    )
    session = session_result.first()
    
    if not session:
        # Return demo data
        return _demo_boardroom_data()
    
    # Get agent outputs
    outputs_result = await db.exec(
        select(AgentOutput).where(AgentOutput.session_id == session.id)
    )
    outputs = outputs_result.all()
    
    # Get debate messages
    messages_result = await db.exec(
        select(Message).where(Message.session_id == session.id, Message.is_debate == True)
    )
    messages = messages_result.all()
    
    return {
        "session_id": session.id,
        "goal": session.goal_input,
        "agents_activated": json.loads(session.agents_activated),
        "outputs": [
            {
                "agent_id": o.agent_id,
                "output_type": o.output_type,
                "summary": o.summary,
                "content": json.loads(o.content),
                "confidence": o.confidence,
                "created_at": o.created_at.isoformat(),
            }
            for o in outputs
        ],
        "debate": [
            {
                "agent": m.agent_name,
                "position": m.content,
                "timestamp": m.timestamp.isoformat(),
            }
            for m in messages
        ],
    }


def _demo_boardroom_data():
    return {
        "session_id": "demo-session",
        "goal": "I want to become an AI Engineer",
        "agents_activated": ["Career Agent", "Learning Agent", "Startup Agent", "Research Agent", "Productivity Agent"],
        "outputs": [],
        "debate": [
            {"agent": "Career Agent", "position": "Focus on employment first—build FAANG-ready skills in 12 weeks.", "timestamp": "2024-01-01T00:00:00"},
            {"agent": "Startup Agent", "position": "The AI startup wave is NOW. Launch a side project while learning.", "timestamp": "2024-01-01T00:00:01"},
            {"agent": "Research Agent", "position": "Data shows a hybrid approach maximizes long-term outcomes.", "timestamp": "2024-01-01T00:00:02"},
        ],
    }
