"""Opportunity Radar route."""
from fastapi import APIRouter, Depends, Query
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from typing import Optional
import json

from app.db.database import get_session
from app.db.models import Opportunity, DigitalTwin

router = APIRouter()


@router.get("/")
async def get_opportunities(
    user_id: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_session),
):
    """Get opportunities, optionally matched to user's digital twin."""
    query = select(Opportunity).where(Opportunity.is_active == True)
    if category:
        query = query.where(Opportunity.category == category)
    
    result = await db.exec(query)
    opportunities = result.all()
    
    # Match with digital twin if user provided
    user_skills = []
    if user_id:
        twin_result = await db.exec(select(DigitalTwin).where(DigitalTwin.user_id == user_id))
        twin = twin_result.first()
        if twin:
            user_skills = [s.lower() for s in json.loads(twin.skills)]
            interests = [i.lower() for i in json.loads(twin.interests)]
            user_skills.extend(interests)
    
    def compute_match(opp: Opportunity) -> float:
        if not user_skills:
            return 0.75
        tags = [t.lower() for t in json.loads(opp.tags)]
        matches = sum(1 for tag in tags if any(skill in tag or tag in skill for skill in user_skills))
        return min(1.0, 0.3 + (matches / max(len(tags), 1)) * 0.7)
    
    return [
        {
            "id": o.id,
            "title": o.title,
            "organization": o.organization,
            "category": o.category,
            "description": o.description,
            "deadline": o.deadline.isoformat() if o.deadline else None,
            "url": o.url,
            "prize_or_benefit": o.prize_or_benefit,
            "tags": json.loads(o.tags),
            "match_score": compute_match(o),
        }
        for o in sorted(opportunities, key=compute_match, reverse=True)
    ]


@router.get("/categories")
async def get_categories():
    return ["hackathon", "internship", "scholarship", "competition", "research"]
