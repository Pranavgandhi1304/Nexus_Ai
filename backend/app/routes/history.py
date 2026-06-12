"""History route – session and goal history."""
from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
import json

from app.db.database import get_session
from app.db.models import Session as UserSession, Goal, Simulation

router = APIRouter()


@router.get("/{user_id}")
async def get_history(user_id: str, db: AsyncSession = Depends(get_session)):
    """Get complete history for a user."""
    sessions_result = await db.exec(
        select(UserSession).where(UserSession.user_id == user_id).order_by(UserSession.created_at.desc())
    )
    sessions = sessions_result.all()
    
    goals_result = await db.exec(
        select(Goal).where(Goal.user_id == user_id).order_by(Goal.created_at.desc())
    )
    goals = goals_result.all()
    
    sims_result = await db.exec(
        select(Simulation).where(Simulation.user_id == user_id).order_by(Simulation.created_at.desc())
    )
    sims = sims_result.all()
    
    return {
        "sessions": [
            {
                "id": s.id,
                "goal_input": s.goal_input,
                "status": s.status,
                "agents_activated": json.loads(s.agents_activated) if s.agents_activated else [],
                "created_at": s.created_at.isoformat(),
                "completed_at": s.completed_at.isoformat() if s.completed_at else None,
            }
            for s in sessions
        ],
        "goals": [
            {
                "id": g.id,
                "title": g.title,
                "category": g.category,
                "status": g.status,
                "progress": g.progress,
                "created_at": g.created_at.isoformat(),
            }
            for g in goals
        ],
        "simulations": [
            {
                "id": s.id,
                "scenario": s.scenario,
                "success_probability": s.success_probability,
                "created_at": s.created_at.isoformat(),
            }
            for s in sims
        ],
    }
