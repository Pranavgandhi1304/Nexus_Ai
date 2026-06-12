# Nexus AI – The Autonomous Personal Operating System

> **Not a chatbot. A board of expert AI advisors working together on your behalf.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js)](https://nextjs.org)
[![LangGraph](https://img.shields.io/badge/LangGraph-Powered-green)](https://langchain-ai.github.io/langgraph)

---

## 🌟 What is Nexus AI?

Nexus AI is an **autonomous multi-agent operating system** that:
1. Creates a **Digital Twin** of the user (skills, goals, interests, context)
2. Coordinates **5 specialist AI agents** (Career, Learning, Startup, Research, Productivity)
3. Runs agents through a **structured debate** to challenge and refine recommendations
4. **Simulates future outcomes** with probability scores
5. Delivers a **phased action plan** with weekly objectives

---

## 🚀 Quick Start (Demo Mode – No API Key Needed)

```bash
# 1. Start Backend
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000

# 2. Start Frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` → Click **"Try Demo"** → Instant access!

---

## 📁 Project Structure

```
nexus-ai/
├── backend/                  # FastAPI + LangGraph
│   ├── app/
│   │   ├── agents/
│   │   │   ├── graph.py      # LangGraph StateGraph workflow
│   │   │   └── mock_generator.py  # Fallback realistic responses
│   │   ├── db/
│   │   │   ├── models.py     # SQLModel schema (12 entities)
│   │   │   └── database.py   # Async engine + seeding
│   │   └── routes/           # FastAPI routers
│   │       ├── auth.py       # JWT auth + demo login
│   │       ├── goals.py      # Goal submission + agent workflow trigger
│   │       ├── twin.py       # Digital Twin CRUD
│   │       ├── simulate.py   # Future Simulator
│   │       ├── project_builder.py # Project blueprints
│   │       ├── radar.py      # Opportunity matching
│   │       ├── boardroom.py  # Agent debate access
│   │       └── history.py    # Session history
│   ├── main.py               # FastAPI app + CORS
│   ├── .env                  # Environment config
│   └── requirements.txt      # Python dependencies
│
├── frontend/                 # Next.js 15 + TypeScript
│   ├── src/
│   │   ├── app/              # Next.js App Router pages
│   │   │   ├── page.tsx      # Landing page
│   │   │   ├── auth/         # Login + Register
│   │   │   ├── dashboard/    # Dashboard with 6 widgets
│   │   │   ├── goal/         # Goal submission + result
│   │   │   ├── workspace/    # AI Boardroom + Debate Terminal
│   │   │   ├── simulator/    # Future Simulator
│   │   │   ├── radar/        # Opportunity Radar
│   │   │   ├── project-builder/ # Project Blueprint Generator
│   │   │   ├── profile/      # Digital Twin profile
│   │   │   ├── history/      # Session + goal history
│   │   │   └── settings/     # App configuration
│   │   ├── components/
│   │   │   ├── AppLayout.tsx # Sidebar + topbar layout
│   │   │   └── Providers.tsx # React Query + Auth
│   │   └── lib/
│   │       ├── api.ts        # Axios API client
│   │       ├── auth-context.tsx # Authentication context
│   │       └── utils.ts      # Helpers, formatting
│   └── .env.local            # Frontend environment
│
├── docker-compose.yml        # Full stack orchestration
└── README.md                 # This file
```

---

## 🤖 Agent Architecture

```
User Goal Input
      ↓
  Orchestrator  (Intent Detection, Task Decomposition)
      ↓
  ┌────────────────────────────────────────────────┐
  │  Career Agent  │  Learning Agent  │  Startup   │
  │  Research Agent │  Productivity Agent           │
  └────────────────────────────────────────────────┘
      ↓
  Debate Phase  (Agents challenge each other)
      ↓
  Consensus Engine  (Synthesizes optimal path)
      ↓
  Future Simulator  (Probability + timelines)
      ↓
  Action Plan  (Phased roadmap + weekly objectives)
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TypeScript, TailwindCSS, Framer Motion |
| State | React Query (TanStack), React Context |
| Backend | FastAPI, Python 3.12, SQLModel |
| Database | SQLite (dev) / PostgreSQL (prod) |
| AI/Agents | LangGraph, LangChain, OpenAI/Gemini/Mock |
| Charts | Recharts |
| Auth | JWT (custom) + demo mode |
| Deploy | Vercel (frontend) + Railway (backend) |

---

## 🔧 Environment Configuration

### Backend (`backend/.env`)
```env
# Database (SQLite default, no setup needed)
DATABASE_URL=sqlite+aiosqlite:///./nexus.db

# AI Provider: "mock", "openai", or "google"
AI_PROVIDER=mock
OPENAI_API_KEY=sk-...          # Optional
GOOGLE_API_KEY=AIza...         # Optional

# Auth
SECRET_KEY=your-secret-key

# Demo Mode
DEMO_MODE=true
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🎭 AI Providers

| Mode | Setup Required | Quality |
|------|---------------|---------|
| `mock` (default) | None | High-quality realistic responses |
| `openai` | OpenAI API key | Real GPT-4o responses |
| `google` | Gemini API key | Real Gemini Pro responses |

---

## 📊 Features

### ✅ Implemented
- [x] **Landing Page** — Animated hero, orbiting agents, workflow steps
- [x] **Auth** — Login, Register, Instant Demo Login
- [x] **Dashboard** — Score rings, stat cards, activity feed, opportunity alerts
- [x] **Goal Submission** — Category selection, animated agent activation, results display
- [x] **AI Boardroom/Workspace** — Agent debate terminal, network visualization
- [x] **Future Simulator** — Scenario + slider config, charts, risk analysis
- [x] **Opportunity Radar** — Animated radar, match scores, category filters
- [x] **Project Builder** — Full tech stack, architecture, sprint roadmap generator
- [x] **User Profile** — Digital Twin editor with skills, career stage, scores
- [x] **History** — All sessions, goals, simulations
- [x] **Settings** — AI provider config, API keys, notification toggles
- [x] **Digital Twin Engine** — Skills, interests, career stage, cross-session context
- [x] **LangGraph Workflow** — Orchestrator → Specialists → Debate → Consensus → Simulator
- [x] **Mock AI Mode** — Full demo without any API keys
- [x] **SQLite + PostgreSQL support**
- [x] **Docker Compose**

---

## 🐳 Docker Deployment

```bash
docker-compose up --build
```

Services:
- PostgreSQL on port 5432
- FastAPI backend on port 8000
- Next.js frontend on port 3000

---

## 🔗 API Documentation

FastAPI auto-generates interactive docs at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

