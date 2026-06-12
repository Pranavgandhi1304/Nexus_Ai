"""Project Builder route."""
from fastapi import APIRouter, Depends
from sqlmodel.ext.asyncio.session import AsyncSession
from pydantic import BaseModel
import json

from app.db.database import get_session
from app.db.models import Project
from app.agents.mock_generator import generate_project_blueprint

router = APIRouter()


class ProjectRequest(BaseModel):
    user_id: str
    name: str
    description: str


@router.post("/")
async def build_project(req: ProjectRequest, db: AsyncSession = Depends(get_session)):
    """Generate a complete project blueprint for an idea."""
    blueprint = generate_project_blueprint(req.description)
    
    project = Project(
        user_id=req.user_id,
        name=req.name,
        description=req.description,
        tech_stack=json.dumps(blueprint["tech_stack"]),
        architecture=json.dumps(blueprint["architecture"]),
        database_design=json.dumps(blueprint["database_design"]),
        dev_roadmap=json.dumps(blueprint["dev_roadmap"]),
        deployment_strategy=json.dumps(blueprint["deployment_strategy"]),
        status="planning",
    )
    db.add(project)
    await db.commit()
    await db.refresh(project)
    
    return {**blueprint, "project_id": project.id}


@router.get("/{user_id}")
async def get_projects(user_id: str, db: AsyncSession = Depends(get_session)):
    """Get all projects for a user."""
    from sqlmodel import select
    result = await db.exec(select(Project).where(Project.user_id == user_id).order_by(Project.created_at.desc()))
    projects = result.all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "status": p.status,
            "tech_stack": json.loads(p.tech_stack),
            "created_at": p.created_at.isoformat(),
        }
        for p in projects
    ]
