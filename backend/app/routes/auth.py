"""Authentication routes – JWT-based auth with demo mode support."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta
import json

from app.db.database import get_session
from app.db.models import User, DigitalTwin
from app.config import settings

try:
    from passlib.context import CryptContext
    from jose import JWTError, jwt
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    JWT_AVAILABLE = True
except ImportError:
    JWT_AVAILABLE = False

router = APIRouter()


class RegisterRequest(BaseModel):
    email: str
    name: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: dict


def create_token(data: dict) -> str:
    if not JWT_AVAILABLE:
        import base64
        return base64.b64encode(json.dumps(data).encode()).decode()
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def hash_password(password: str) -> str:
    if not JWT_AVAILABLE:
        return f"hashed_{password}"
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    if not JWT_AVAILABLE:
        return hashed == f"hashed_{plain}"
    return pwd_context.verify(plain, hashed)


@router.post("/register", response_model=TokenResponse)
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_session)):
    # Check if user exists
    existing = await db.exec(select(User).where(User.email == req.email))
    if existing.first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(
        email=req.email,
        name=req.name,
        hashed_password=hash_password(req.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    
    # Create digital twin
    twin = DigitalTwin(user_id=user.id)
    db.add(twin)
    await db.commit()
    
    token = create_token({"sub": user.id, "email": user.email})
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user={"id": user.id, "email": user.email, "name": user.name},
    )


@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_session)):
    user_result = await db.exec(select(User).where(User.email == req.email))
    user = user_result.first()
    
    if not user or not verify_password(req.password, user.hashed_password or ""):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token({"sub": user.id, "email": user.email})
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user={"id": user.id, "email": user.email, "name": user.name},
    )


@router.post("/demo-login", response_model=TokenResponse)
async def demo_login(db: AsyncSession = Depends(get_session)):
    """Instant demo login without credentials – for hackathon judges."""
    demo_email = "demo@nexus.ai"
    
    user_result = await db.exec(select(User).where(User.email == demo_email))
    user = user_result.first()
    
    if not user:
        user = User(
            email=demo_email,
            name="Alex Chen",
            hashed_password=hash_password("demo"),
            avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
        twin = DigitalTwin(
            user_id=user.id,
            skills=json.dumps(["Python", "Machine Learning", "React", "FastAPI", "SQL"]),
            interests=json.dumps(["AI/ML", "Web Development", "Startups", "Open Source"]),
            career_stage="Student",
            ai_readiness_score=0.62,
            skill_score=0.58,
            goal_completion_rate=0.45,
            context_summary="Final year CS student passionate about AI/ML. Has built 3 projects and is exploring career options between joining a startup vs pursuing GATE.",
        )
        db.add(twin)
        await db.commit()
    
    token = create_token({"sub": user.id, "email": user.email})
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user={"id": user.id, "email": user.email, "name": user.name},
    )


@router.get("/me")
async def get_me():
    """Return demo user info."""
    return {
        "id": "demo-user",
        "email": "demo@nexus.ai",
        "name": "Alex Chen",
    }
