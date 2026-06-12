"""Goals API – submits goal, triggers LangGraph agent workflow, stores results."""
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import json

from app.db.database import get_session
from app.db.models import Goal, Session as UserSession, AgentOutput, Agent, Message, DigitalTwin
from app.agents.graph import run_agent_workflow

router = APIRouter()


class GoalRequest(BaseModel):
    user_id: str
    title: str
    description: str
    category: Optional[str] = "general"
    target_date: Optional[str] = None


class GoalResponse(BaseModel):
    goal_id: str
    session_id: str
    status: str
    action_plan: dict


@router.post("/", response_model=GoalResponse)
async def submit_goal(req: GoalRequest, db: AsyncSession = Depends(get_session)):
    """Submit a goal and trigger the full multi-agent workflow."""
    
    # Create the goal
    goal = Goal(
        user_id=req.user_id,
        title=req.title,
        description=req.description,
        category=req.category or "general",
    )
    db.add(goal)
    await db.commit()
    await db.refresh(goal)
    
    # Create a session
    session = UserSession(
        user_id=req.user_id,
        goal_input=req.description,
        status="running",
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    
    # Get twin context
    twin_result = await db.exec(select(DigitalTwin).where(DigitalTwin.user_id == req.user_id))
    twin = twin_result.first()
    twin_context = {}
    if twin:
        twin_context = {
            "skills": json.loads(twin.skills),
            "interests": json.loads(twin.interests),
            "career_stage": twin.career_stage,
            "context_summary": twin.context_summary,
        }
    
    # Run the agent workflow
    action_plan = await run_agent_workflow(
        goal=req.description,
        user_id=req.user_id,
        twin_context=twin_context,
    )
    
    # Store agent outputs
    agents_result = await db.exec(select(Agent))
    agents = agents_result.all()
    agent_map = {a.role: a for a in agents}
    
    output_map = {
        "career_advisor": action_plan.get("career_analysis"),
        "learning_advisor": action_plan.get("learning_plan"),
        "startup_advisor": action_plan.get("startup_blueprint"),
        "research_advisor": action_plan.get("research_insights"),
        "productivity_advisor": action_plan.get("productivity_plan"),
    }
    
    for role, output_data in output_map.items():
        if output_data and role in agent_map:
            agent_output = AgentOutput(
                session_id=session.id,
                goal_id=goal.id,
                agent_id=agent_map[role].id,
                output_type="analysis",
                content=json.dumps(output_data),
                summary=output_data.get("debate_position", "Analysis complete")[:200],
                confidence=output_data.get("confidence", 0.85),
            )
            db.add(agent_output)
    
    # Store debate messages
    for entry in action_plan.get("debate_transcript", []):
        msg = Message(
            session_id=session.id,
            role=entry.get("agent", "agent").lower().replace(" ", "_"),
            content=entry.get("position", ""),
            agent_name=entry.get("agent"),
            is_debate=True,
        )
        db.add(msg)
    
    # Update session
    session.status = "completed"
    session.agents_activated = json.dumps(action_plan.get("agents_activated", []))
    session.orchestrator_plan = json.dumps(action_plan.get("decomposed_tasks", []))
    session.completed_at = datetime.utcnow()
    db.add(session)
    
    # Update goal
    goal.status = "active"
    goal.progress = 0.05  # 5% on first analysis
    db.add(goal)
    
    # Update digital twin
    if twin:
        twin.context_summary = f"Latest goal: {req.title}. {twin.context_summary}"[:500]
        twin.goal_completion_rate = min(1.0, twin.goal_completion_rate + 0.05)
        twin.updated_at = datetime.utcnow()
        db.add(twin)
    
    await db.commit()
    
    return GoalResponse(
        goal_id=goal.id,
        session_id=session.id,
        status="completed",
        action_plan=action_plan,
    )


@router.get("/{user_id}")
async def get_user_goals(user_id: str, db: AsyncSession = Depends(get_session)):
    """Get all goals for a user."""
    result = await db.exec(select(Goal).where(Goal.user_id == user_id).order_by(Goal.created_at.desc()))
    goals = result.all()
    return [
        {
            "id": g.id,
            "title": g.title,
            "description": g.description,
            "category": g.category,
            "status": g.status,
            "progress": g.progress,
            "created_at": g.created_at.isoformat(),
        }
        for g in goals
    ]


@router.put("/{goal_id}/progress")
async def update_progress(goal_id: str, progress: float, db: AsyncSession = Depends(get_session)):
    """Update goal progress."""
    result = await db.exec(select(Goal).where(Goal.id == goal_id))
    goal = result.first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    goal.progress = min(1.0, max(0.0, progress))
    goal.status = "completed" if progress >= 1.0 else "active"
    goal.updated_at = datetime.utcnow()
    db.add(goal)
    await db.commit()
    return {"status": "updated", "progress": goal.progress}
