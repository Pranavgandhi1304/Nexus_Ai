"""Future Simulator route."""
from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession
from pydantic import BaseModel
from typing import Optional, Dict
import json

from app.db.database import get_session
from app.db.models import Simulation
from app.agents.mock_generator import generate_simulation

router = APIRouter()


class SimulationRequest(BaseModel):
    user_id: str
    scenario: str
    timeframe_months: Optional[int] = 6
    variables: Optional[Dict] = None


@router.post("/")
async def run_simulation(req: SimulationRequest, db: AsyncSession = Depends(get_session)):
    """Run a future simulation for the given scenario."""
    result = generate_simulation(
        scenario=req.scenario,
        timeframe=req.timeframe_months or 6,
        variables=req.variables,
    )
    
    simulation = Simulation(
        user_id=req.user_id,
        scenario=req.scenario,
        timeframe_months=req.timeframe_months or 6,
        variables=json.dumps(req.variables or {}),
        success_probability=result["success_probability"],
        skill_growth=json.dumps(result["skill_growth"]),
        opportunity_forecast=json.dumps(result["opportunity_forecast"]),
        readiness_score=result["readiness_score"],
        timeline=json.dumps(result["timeline"]),
        risks=json.dumps(result["risks"]),
    )
    db.add(simulation)
    await db.commit()
    
    return result


@router.get("/{user_id}/history")
async def get_simulation_history(user_id: str, db: AsyncSession = Depends(get_session)):
    """Get past simulations for the user."""
    from sqlmodel import select
    result = await db.exec(select(Simulation).where(Simulation.user_id == user_id).order_by(Simulation.created_at.desc()))
    sims = result.all()
    return [
        {
            "id": s.id,
            "scenario": s.scenario,
            "timeframe_months": s.timeframe_months,
            "success_probability": s.success_probability,
            "readiness_score": s.readiness_score,
            "created_at": s.created_at.isoformat(),
        }
        for s in sims
    ]
