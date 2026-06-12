"""
Nexus AI – LangGraph Multi-Agent Orchestration
Defines the state machine and agent workflow graph.
"""
from typing import TypedDict, List, Optional, Any, Dict, Annotated
import json
import operator

from app.config import settings


# ─── State Definition ─────────────────────────────────────────────────────────

class AgentState(TypedDict):
    goal: str
    user_id: str
    twin_context: Dict[str, Any]
    
    # Orchestrator
    category: str
    agents_to_activate: List[str]
    decomposed_tasks: List[str]
    
    # Agent Outputs
    career_output: Optional[Dict]
    learning_output: Optional[Dict]
    startup_output: Optional[Dict]
    research_output: Optional[Dict]
    productivity_output: Optional[Dict]
    
    # Debate and Consensus
    debate_transcript: Annotated[List[Dict], operator.add]
    consensus_result: Optional[Dict]   # renamed from 'consensus' to avoid node name conflict
    
    # Simulation
    simulation: Optional[Dict]
    
    # Final output
    action_plan: Optional[Dict]
    session_id: Optional[str]
    error: Optional[str]


# ─── LLM Factory ───────────────────────────────────────────────────────────────

def get_llm():
    """Get the configured LLM or None if no API key."""
    if settings.AI_PROVIDER == "openai" and settings.OPENAI_API_KEY:
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            model=settings.AI_MODEL,
            api_key=settings.OPENAI_API_KEY,
            temperature=0.7,
        )
    elif settings.AI_PROVIDER == "google" and settings.GOOGLE_API_KEY:
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(
            model=settings.AI_MODEL or "gemini-pro",
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=0.7,
        )
    return None


# ─── Node Functions ────────────────────────────────────────────────────────────

def orchestrator_node(state: AgentState) -> AgentState:
    """Analyzes goal and determines which agents to activate."""
    
    goal = state["goal"]
    goal_lower = goal.lower()
    
    # Determine category and agents to activate
    if any(w in goal_lower for w in ["career", "job", "engineer", "placement", "interview", "resume"]):
        category = "career"
        agents = ["career", "learning", "productivity"]
    elif any(w in goal_lower for w in ["startup", "business", "launch", "entrepreneur", "product"]):
        category = "startup"
        agents = ["startup", "research", "productivity", "career"]
    elif any(w in goal_lower for w in ["learn", "study", "gate", "exam", "course", "skill", "master"]):
        category = "learning"
        agents = ["learning", "career", "productivity"]
    elif any(w in goal_lower for w in ["research", "paper", "thesis", "phd", "academic"]):
        category = "research"
        agents = ["research", "learning", "career"]
    elif any(w in goal_lower for w in ["hackathon", "win", "compete", "competition", "prize"]):
        category = "hackathon"
        agents = ["productivity", "research", "startup", "career"]
    else:
        category = "general"
        agents = ["career", "learning", "startup", "research", "productivity"]
    
    decomposed_tasks = [
        f"Analyze user profile and goal: '{goal}'",
        f"Activate {', '.join(agents)} specialist agents",
        "Run parallel analysis across all activated agents",
        "Facilitate structured debate between conflicting recommendations",
        "Build consensus from debate outcomes",
        "Simulate future outcomes based on chosen path",
        "Compile final action plan with weekly objectives",
    ]
    
    return {
        **state,
        "category": category,
        "agents_to_activate": agents,
        "decomposed_tasks": decomposed_tasks,
    }


def career_agent_node(state: AgentState) -> AgentState:
    """Career specialist agent."""
    from app.agents.mock_generator import CAREER_OUTPUTS
    import copy
    
    llm = get_llm()
    if llm:
        try:
            from langchain_core.prompts import ChatPromptTemplate
            prompt = ChatPromptTemplate.from_messages([
                ("system", """You are the Career Agent in the Nexus AI system. 
                You are an expert career advisor specializing in tech careers, AI/ML engineering, 
                resume analysis, and skill gap detection.
                
                Analyze the user's goal and provide structured career guidance.
                Return a JSON object with keys: analysis, missing_skills, learning_path, 
                career_plan, job_readiness_score (0-1), debate_position, confidence (0-1)"""),
                ("human", "Goal: {goal}\nUser Context: {context}"),
            ])
            chain = prompt | llm
            response = chain.invoke({
                "goal": state["goal"],
                "context": json.dumps(state.get("twin_context", {})),
            })
            try:
                output = json.loads(response.content)
            except Exception:
                output = copy.deepcopy(CAREER_OUTPUTS[0])
        except Exception:
            output = copy.deepcopy(CAREER_OUTPUTS[0])
    else:
        output = copy.deepcopy(CAREER_OUTPUTS[0])
    
    debate_entry = {
        "agent": "Career Agent",
        "emoji": "💼",
        "color": "#6366f1",
        "position": output.get("debate_position", "Focus on building employable skills first."),
    }
    
    return {**state, "career_output": output, "debate_transcript": [debate_entry]}


def learning_agent_node(state: AgentState) -> AgentState:
    """Learning specialist agent."""
    from app.agents.mock_generator import LEARNING_OUTPUTS
    import copy
    
    llm = get_llm()
    if llm:
        try:
            from langchain_core.prompts import ChatPromptTemplate
            prompt = ChatPromptTemplate.from_messages([
                ("system", """You are the Learning Agent in Nexus AI.
                Design personalized learning plans, adaptive study roadmaps, and resource recommendations.
                Return JSON with keys: weekly_plan, progress_metrics, recommended_resources, 
                debate_position, confidence (0-1)"""),
                ("human", "Goal: {goal}\nContext: {context}"),
            ])
            chain = prompt | llm
            response = chain.invoke({"goal": state["goal"], "context": json.dumps(state.get("twin_context", {}))})
            try:
                output = json.loads(response.content)
            except Exception:
                output = copy.deepcopy(LEARNING_OUTPUTS[0])
        except Exception:
            output = copy.deepcopy(LEARNING_OUTPUTS[0])
    else:
        output = copy.deepcopy(LEARNING_OUTPUTS[0])
    
    debate_entry = {
        "agent": "Learning Agent",
        "emoji": "📚",
        "color": "#06b6d4",
        "position": output.get("debate_position", "Systematic learning is the foundation of everything."),
    }
    
    return {**state, "learning_output": output, "debate_transcript": [debate_entry]}


def startup_agent_node(state: AgentState) -> AgentState:
    """Startup specialist agent."""
    from app.agents.mock_generator import STARTUP_OUTPUTS
    import copy
    
    llm = get_llm()
    if llm:
        try:
            from langchain_core.prompts import ChatPromptTemplate
            prompt = ChatPromptTemplate.from_messages([
                ("system", """You are the Startup Agent in Nexus AI.
                Analyze market conditions, design business models, and create startup blueprints.
                Return JSON with keys: market_analysis, business_model, swot, mvp_roadmap, 
                debate_position, confidence (0-1)"""),
                ("human", "Goal: {goal}\nContext: {context}"),
            ])
            chain = prompt | llm
            response = chain.invoke({"goal": state["goal"], "context": json.dumps(state.get("twin_context", {}))})
            try:
                output = json.loads(response.content)
            except Exception:
                output = copy.deepcopy(STARTUP_OUTPUTS[0])
        except Exception:
            output = copy.deepcopy(STARTUP_OUTPUTS[0])
    else:
        output = copy.deepcopy(STARTUP_OUTPUTS[0])
    
    debate_entry = {
        "agent": "Startup Agent",
        "emoji": "🚀",
        "color": "#f59e0b",
        "position": output.get("debate_position", "The market window is now—launch fast."),
    }
    
    return {**state, "startup_output": output, "debate_transcript": [debate_entry]}


def research_agent_node(state: AgentState) -> AgentState:
    """Research specialist agent."""
    from app.agents.mock_generator import RESEARCH_OUTPUTS
    import copy
    
    llm = get_llm()
    if llm:
        try:
            from langchain_core.prompts import ChatPromptTemplate
            prompt = ChatPromptTemplate.from_messages([
                ("system", """You are the Research Agent in Nexus AI.
                Explore topics, analyze trends, discover opportunities, and synthesize insights.
                Return JSON with keys: key_insights, trends, innovation_opportunities, 
                debate_position, confidence (0-1)"""),
                ("human", "Goal: {goal}\nContext: {context}"),
            ])
            chain = prompt | llm
            response = chain.invoke({"goal": state["goal"], "context": json.dumps(state.get("twin_context", {}))})
            try:
                output = json.loads(response.content)
            except Exception:
                output = copy.deepcopy(RESEARCH_OUTPUTS[0])
        except Exception:
            output = copy.deepcopy(RESEARCH_OUTPUTS[0])
    else:
        output = copy.deepcopy(RESEARCH_OUTPUTS[0])
    
    debate_entry = {
        "agent": "Research Agent",
        "emoji": "🔬",
        "color": "#10b981",
        "position": output.get("debate_position", "Data-driven insights support a hybrid strategy."),
    }
    
    return {**state, "research_output": output, "debate_transcript": [debate_entry]}


def productivity_agent_node(state: AgentState) -> AgentState:
    """Productivity specialist agent."""
    from app.agents.mock_generator import PRODUCTIVITY_OUTPUTS
    import copy
    
    llm = get_llm()
    if llm:
        try:
            from langchain_core.prompts import ChatPromptTemplate
            prompt = ChatPromptTemplate.from_messages([
                ("system", """You are the Productivity Agent in Nexus AI.
                Break goals into sprints, allocate time, and create daily execution plans.
                Return JSON with keys: daily_tasks, weekly_objectives, sprint_plan, 
                time_allocation, debate_position, confidence (0-1)"""),
                ("human", "Goal: {goal}\nContext: {context}"),
            ])
            chain = prompt | llm
            response = chain.invoke({"goal": state["goal"], "context": json.dumps(state.get("twin_context", {}))})
            try:
                output = json.loads(response.content)
            except Exception:
                output = copy.deepcopy(PRODUCTIVITY_OUTPUTS[0])
        except Exception:
            output = copy.deepcopy(PRODUCTIVITY_OUTPUTS[0])
    else:
        output = copy.deepcopy(PRODUCTIVITY_OUTPUTS[0])
    
    debate_entry = {
        "agent": "Productivity Agent",
        "emoji": "⚡",
        "color": "#ec4899",
        "position": output.get("debate_position", "Disciplined execution is what separates winners from dreamers."),
    }
    
    return {**state, "productivity_output": output, "debate_transcript": [debate_entry]}


def build_consensus_node(state: AgentState) -> AgentState:
    """Builds consensus from the debate and creates the final plan.
    Node renamed to build_consensus_node to avoid state key conflict."""
    from app.agents.mock_generator import CONSENSUS_TEMPLATES
    import copy
    import random
    
    llm = get_llm()
    if llm:
        try:
            from langchain_core.prompts import ChatPromptTemplate
            debate_str = json.dumps(state.get("debate_transcript", []))
            prompt = ChatPromptTemplate.from_messages([
                ("system", """You are the Consensus Engine in Nexus AI.
                Given the debate transcript from all specialist agents, synthesize a unified action plan.
                Return JSON with keys: summary, decision, rationale, phase_1, phase_2, phase_3, success_probability (0-1)"""),
                ("human", "Goal: {goal}\nDebate: {debate}"),
            ])
            chain = prompt | llm
            response = chain.invoke({"goal": state["goal"], "debate": debate_str})
            try:
                consensus_data = json.loads(response.content)
            except Exception:
                consensus_data = copy.deepcopy(CONSENSUS_TEMPLATES[0])
                consensus_data["success_probability"] = round(random.uniform(0.72, 0.89), 2)
        except Exception:
            consensus_data = copy.deepcopy(CONSENSUS_TEMPLATES[0])
            consensus_data["success_probability"] = round(random.uniform(0.72, 0.89), 2)
    else:
        consensus_data = copy.deepcopy(CONSENSUS_TEMPLATES[0])
        consensus_data["success_probability"] = round(random.uniform(0.72, 0.89), 2)
    
    return {**state, "consensus_result": consensus_data}


def future_simulator_node(state: AgentState) -> AgentState:
    """Runs future simulation based on chosen path."""
    from app.agents.mock_generator import generate_simulation
    
    simulation = generate_simulation(
        scenario=state["goal"],
        timeframe=6,
        variables={"hours_per_day": 2, "focus_area": state.get("category", "AI Engineering")},
    )
    
    return {**state, "simulation": simulation}


def action_planner_node(state: AgentState) -> AgentState:
    """Compiles the final action plan."""
    
    action_plan = {
        "goal": state["goal"],
        "category": state["category"],
        "agents_activated": state["agents_to_activate"],
        "decomposed_tasks": state["decomposed_tasks"],
        "career_analysis": state.get("career_output"),
        "learning_plan": state.get("learning_output"),
        "startup_blueprint": state.get("startup_output"),
        "research_insights": state.get("research_output"),
        "productivity_plan": state.get("productivity_output"),
        "debate_transcript": state.get("debate_transcript", []),
        "consensus": state.get("consensus_result"),   # expose as 'consensus' in output
        "simulation": state.get("simulation"),
    }
    
    return {**state, "action_plan": action_plan}


# ─── Build the Graph ───────────────────────────────────────────────────────────

def build_agent_graph():
    """Construct and compile the LangGraph agent workflow."""
    try:
        from langgraph.graph import StateGraph, END
        
        workflow = StateGraph(AgentState)
        
        # Add all nodes — names must NOT match any state key
        workflow.add_node("orchestrator", orchestrator_node)
        workflow.add_node("career_agent", career_agent_node)
        workflow.add_node("learning_agent", learning_agent_node)
        workflow.add_node("startup_agent", startup_agent_node)
        workflow.add_node("research_agent", research_agent_node)
        workflow.add_node("productivity_agent", productivity_agent_node)
        workflow.add_node("build_consensus", build_consensus_node)   # 'build_consensus' not a state key
        workflow.add_node("future_simulator", future_simulator_node)
        workflow.add_node("action_planner", action_planner_node)
        
        # Set entry point
        workflow.set_entry_point("orchestrator")
        
        # Sequential flow
        workflow.add_edge("orchestrator", "career_agent")
        workflow.add_edge("career_agent", "learning_agent")
        workflow.add_edge("learning_agent", "startup_agent")
        workflow.add_edge("startup_agent", "research_agent")
        workflow.add_edge("research_agent", "productivity_agent")
        workflow.add_edge("productivity_agent", "build_consensus")
        workflow.add_edge("build_consensus", "future_simulator")
        workflow.add_edge("future_simulator", "action_planner")
        workflow.add_edge("action_planner", END)
        
        return workflow.compile()
    
    except ImportError:
        # LangGraph not available, use direct execution fallback
        return None
    except Exception as e:
        print(f"[Nexus AI] Graph build error: {e}, using direct execution fallback")
        return None


async def run_agent_workflow(goal: str, user_id: str, twin_context: Dict = None) -> Dict:
    """Run the complete multi-agent workflow for a user goal."""
    
    initial_state: AgentState = {
        "goal": goal,
        "user_id": user_id,
        "twin_context": twin_context or {},
        "category": "",
        "agents_to_activate": [],
        "decomposed_tasks": [],
        "career_output": None,
        "learning_output": None,
        "startup_output": None,
        "research_output": None,
        "productivity_output": None,
        "debate_transcript": [],
        "consensus_result": None,
        "simulation": None,
        "action_plan": None,
        "session_id": None,
        "error": None,
    }
    
    graph = build_agent_graph()
    
    if graph:
        try:
            final_state = await graph.ainvoke(initial_state)
            return final_state.get("action_plan", {})
        except Exception as e:
            print(f"[Nexus AI] LangGraph execution error, using direct fallback: {e}")
    
    # Direct execution fallback (always works, no LangGraph dependency)
    state = orchestrator_node(initial_state)
    state = career_agent_node(state)
    state = learning_agent_node(state)
    state = startup_agent_node(state)
    state = research_agent_node(state)
    state = productivity_agent_node(state)
    state = build_consensus_node(state)
    state = future_simulator_node(state)
    state = action_planner_node(state)
    
    return state.get("action_plan", {})
