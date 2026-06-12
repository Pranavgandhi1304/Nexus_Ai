from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.db.database import init_db
from app.routes import goals, twin, simulate, project_builder, radar, boardroom, auth, history


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="Nexus AI – Autonomous Personal Operating System",
    description="Multi-agent AI OS with Digital Twin, LangGraph orchestration, and real-time agent collaboration.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(goals.router, prefix="/api/goals", tags=["Goals"])
app.include_router(twin.router, prefix="/api/twin", tags=["Digital Twin"])
app.include_router(simulate.router, prefix="/api/simulate", tags=["Future Simulator"])
app.include_router(project_builder.router, prefix="/api/project-builder", tags=["Project Builder"])
app.include_router(radar.router, prefix="/api/radar", tags=["Opportunity Radar"])
app.include_router(boardroom.router, prefix="/api/boardroom", tags=["AI Boardroom"])
app.include_router(history.router, prefix="/api/history", tags=["History"])


@app.get("/")
async def root():
    return {
        "name": "Nexus AI",
        "status": "operational",
        "version": "1.0.0",
        "agents": ["Career", "Learning", "Startup", "Research", "Productivity"],
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
