"""Digital Twin routes – get and update user's evolving AI profile."""
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import json

from app.db.database import get_session
from app.db.models import DigitalTwin, User

router = APIRouter()


class TwinUpdateRequest(BaseModel):
    skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    career_stage: Optional[str] = None
    achievements: Optional[List[str]] = None


@router.get("/{user_id}")
async def get_twin(user_id: str, db: AsyncSession = Depends(get_session)):
    """Get user's digital twin profile."""
    result = await db.exec(select(DigitalTwin).where(DigitalTwin.user_id == user_id))
    twin = result.first()
    
    if not twin:
        # Auto-create for demo users
        twin = DigitalTwin(
            user_id=user_id,
            skills=json.dumps(["Python", "JavaScript", "React", "Machine Learning"]),
            interests=json.dumps(["AI/ML", "Web Development", "Startups"]),
            career_stage="Student",
            ai_readiness_score=0.62,
            skill_score=0.58,
            goal_completion_rate=0.45,
        )
        db.add(twin)
        await db.commit()
        await db.refresh(twin)
    
    return {
        "id": twin.id,
        "user_id": twin.user_id,
        "skills": json.loads(twin.skills),
        "interests": json.loads(twin.interests),
        "current_goals": json.loads(twin.current_goals),
        "career_stage": twin.career_stage,
        "learning_progress": json.loads(twin.learning_progress),
        "achievements": json.loads(twin.achievements),
        "ai_readiness_score": twin.ai_readiness_score,
        "skill_score": twin.skill_score,
        "goal_completion_rate": twin.goal_completion_rate,
        "context_summary": twin.context_summary,
        "updated_at": twin.updated_at.isoformat(),
    }


@router.put("/{user_id}")
async def update_twin(user_id: str, req: TwinUpdateRequest, db: AsyncSession = Depends(get_session)):
    """Update digital twin profile."""
    result = await db.exec(select(DigitalTwin).where(DigitalTwin.user_id == user_id))
    twin = result.first()
    
    if not twin:
        raise HTTPException(status_code=404, detail="Digital Twin not found")
    
    if req.skills is not None:
        twin.skills = json.dumps(req.skills)
        twin.skill_score = min(1.0, len(req.skills) / 20.0)
        twin.ai_readiness_score = min(1.0, twin.ai_readiness_score + 0.02)
    if req.interests is not None:
        twin.interests = json.dumps(req.interests)
    if req.career_stage is not None:
        twin.career_stage = req.career_stage
    if req.achievements is not None:
        twin.achievements = json.dumps(req.achievements)
    
    twin.updated_at = datetime.utcnow()
    db.add(twin)
    await db.commit()
    
    return {"status": "updated", "skill_score": twin.skill_score, "ai_readiness_score": twin.ai_readiness_score}


@router.get("/{user_id}/scores")
async def get_scores(user_id: str, db: AsyncSession = Depends(get_session)):
    """Get dashboard scores for the user."""
    result = await db.exec(select(DigitalTwin).where(DigitalTwin.user_id == user_id))
    twin = result.first()
    
    if not twin:
        return {
            "ai_readiness_score": 0.62,
            "skill_score": 0.58,
            "goal_completion_rate": 0.45,
            "career_stage": "Student",
        }
    
    return {
        "ai_readiness_score": twin.ai_readiness_score,
        "skill_score": twin.skill_score,
        "goal_completion_rate": twin.goal_completion_rate,
        "career_stage": twin.career_stage,
    }
