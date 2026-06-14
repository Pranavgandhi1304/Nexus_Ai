'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Zap, Brain, Target, Rocket, BarChart3, Shield, ChevronRight, Sparkles, Activity } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

const AGENTS = [
  { name: 'Career Agent', emoji: '💼', color: '#6366f1', description: 'Resume, Skills, Roadmaps' },
  { name: 'Learning Agent', emoji: '📚', color: '#06b6d4', description: 'Personalized Study Plans' },
  { name: 'Startup Agent', emoji: '🚀', color: '#f59e0b', description: 'Market Research, SWOT' },
  { name: 'Research Agent', emoji: '🔬', color: '#10b981', description: 'Trends, Opportunities' },
  { name: 'Productivity Agent', emoji: '⚡', color: '#ec4899', description: 'Goals, Sprints, Focus' },
];

const EXAMPLE_GOALS = [
  'I want to become an AI Engineer',
  'I want to build a SaaS startup',
  'I want to crack GATE 2026',
  'I want to win a hackathon',
  'I want to switch careers to Data Science',
  'I want to launch a mobile app',
];

const FEATURES = [
  {
    icon: Brain,
    title: 'Digital Twin Engine',
    description: 'Your evolving AI profile that remembers skills, goals, and preferences across sessions.',
    color: '#6366f1',
  },
  {
    icon: Activity,
    title: 'Agent Debate Mode',
    description: 'Agents challenge each other and build consensus—not just one AI, but a boardroom.',
    color: '#06b6d4',
  },
  {
    icon: BarChart3,
    title: 'Future Simulator',
    description: "Simulate where you'll be in 6 months and get a success probability score.",
    color: '#f59e0b',
  },
  {
    icon: Target,
    title: 'Opportunity Radar',
    description: 'Continuously scans for hackathons, internships, and scholarships matched to your twin.',
    color: '#10b981',
  },
  {
    icon: Rocket,
    title: 'Project Builder',
    description: 'Turn any idea into a full tech stack, architecture, and dev roadmap in seconds.',
    color: '#ec4899',
  },
  {
    icon: Shield,
    title: 'Progress Tracking',
    description: 'AI Readiness Score, Skill Score, and Goal Completion Rate always up-to-date.',
    color: '#f59e0b',
  },
];

const WORKFLOW = [
  { step: '01', title: 'Enter Your Goal', desc: 'Type any goal—career, startup, exam, hackathon.', icon: '🎯' },
  { step: '02', title: 'Digital Twin Analysis', desc: 'Your profile is created or updated with context.', icon: '🧠' },
  { step: '03', title: 'Agents Activated', desc: 'Relevant specialists are spun up in parallel.', icon: '⚡' },
  { step: '04', title: 'Debate & Consensus', desc: 'Agents challenge each other for the best path.', icon: '🗣️' },
  { step: '05', title: 'Future Simulation', desc: 'Probability scores and timelines are generated.', icon: '📊' },
  { step: '06', title: 'Your Action Plan', desc: 'Phased roadmap delivered with weekly objectives.', icon: '🗺️' },
];

export default function LandingPage() {
  const { demoLogin } = useAuth();
  const router = useRouter();
  const [isEntering, setIsEntering] = useState(false);
  const [goalIdx, setGoalIdx] = useState(0);

  const handleDemoEnter = async () => {
    setIsEntering(true);
    try {
      await demoLogin();
      router.push('/dashboard');
    } catch {
      router.push('/dashboard');
    }
  };

  return (
    <div
      className="min-h-screen nexus-grid"
      style={{ backgroundColor: '#020816', overflowX: 'hidden' }}
    >
      {/* ─── Nav ─────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #00d4ff20, #7c3aed20)', border: '1px solid rgba(0,212,255,0.3)' }}>
              ✦
            </div>
            <span className="text-white font-bold text-lg">
              Nexus <span className="text-neon-cyan">AI</span>
            </span>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/auth" className="btn-secondary text-sm px-4 py-2 rounded-lg">Sign In</Link>
            <button onClick={handleDemoEnter} className="btn-primary text-sm px-4 py-2 rounded-lg flex items-center gap-2">
              <Zap className="w-4 h-4" /> Try Demo
            </button>
          </motion.div>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 128, paddingBottom: 80, position: 'relative', overflow: 'hidden' }}>
        {/* Background glow blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div className="absolute top-20 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #00d4ff, transparent)' }} />

        {/* Centered container */}
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 9999, marginBottom: 32, fontSize: 14, fontWeight: 500, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}
          >
            <Sparkles className="w-4 h-4" />
            Agentic AI Operating System · LangGraph Powered
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', fontWeight: 900, color: 'white', marginBottom: 24, lineHeight: 1.15, letterSpacing: '-0.02em' }}
          >
            Your Board of{' '}
            <span style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Expert AI
            </span>
            <br />Advisors
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: '1.125rem', color: '#94a3b8', marginBottom: 16, lineHeight: 1.7, maxWidth: 600, margin: '0 auto 16px' }}
          >
            Not a chatbot. An autonomous multi-agent operating system that creates your{' '}
            <strong style={{ color: '#e2e8f0' }}>Digital Twin</strong>, coordinates 5 AI experts,
            and builds you a personalized path to your goals.
          </motion.p>

          {/* Rotating goal examples */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ marginBottom: 40, marginTop: 24 }}>
            <p style={{ color: '#64748b', fontSize: 13, marginBottom: 8 }}>Enter any goal, like:</p>
            <motion.button
              key={goalIdx}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              onClick={() => setGoalIdx((goalIdx + 1) % EXAMPLE_GOALS.length)}
              style={{ padding: '12px 24px', borderRadius: 12, fontSize: 15, fontWeight: 500, color: '#cbd5e1', cursor: 'pointer', background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}
            >
              &ldquo;{EXAMPLE_GOALS[goalIdx]}&rdquo;
            </motion.button>
            <p style={{ color: '#475569', fontSize: 12, marginTop: 8 }}>Click to cycle examples</p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}
          >
            <button
              onClick={handleDemoEnter}
              disabled={isEntering}
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 32px', fontSize: 16, borderRadius: 12 }}
            >
              {isEntering ? <><span className="animate-spin">⚙</span> Initializing OS...</> : <><Zap className="w-5 h-5" /> Enter the AI Boardroom</>}
            </button>
            <Link
              href="/auth"
              className="btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 32px', fontSize: 16, borderRadius: 12 }}
            >
              Create Account <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            style={{ color: '#475569', fontSize: 13, marginTop: 24 }}
          >
            No credit card · Instant demo · 5 AI agents working for you
          </motion.p>
        </div>

        {/* Agent Orbit */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 1 }}
          style={{ position: 'relative', width: 256, height: 256, margin: '80px auto 0', display: 'none' }}
          className="hidden md:block"
        >
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))', border: '1px solid rgba(0,212,255,0.4)' }}>
              ✦
            </div>
          </div>
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px dashed rgba(0,212,255,0.1)' }} />
          {AGENTS.map((agent, i) => (
            <motion.div
              key={agent.name}
              style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -16, marginLeft: -16 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'linear', delay: (i * 360) / 5 / 360 * (10 + i * 2) }}
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'linear' }}
                title={agent.name}
                style={{ translateX: 100, background: `${agent.color}20`, border: `1px solid ${agent.color}60`, fontSize: 18, width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {agent.emoji}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── Agent Showcase ──────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 700, color: 'white', marginBottom: 16 }}>
              Meet Your AI <span className="text-neon-cyan">Boardroom</span>
            </h2>
            <p style={{ color: '#94a3b8', maxWidth: 500, margin: '0 auto' }}>
              Five specialist agents that debate, collaborate, and build consensus on your behalf.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            {AGENTS.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card"
                style={{ padding: 24, textAlign: 'center', cursor: 'default' }}
              >
                <div style={{ width: 64, height: 64, borderRadius: 16, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, background: `${agent.color}15`, border: `1px solid ${agent.color}40` }}>
                  {agent.emoji}
                </div>
                <h3 style={{ fontWeight: 700, color: 'white', fontSize: 13, marginBottom: 8 }}>{agent.name}</h3>
                <p style={{ color: '#64748b', fontSize: 12 }}>{agent.description}</p>
                <div className="status-dot-active" style={{ width: 8, height: 8, borderRadius: '50%', margin: '12px auto 0' }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Workflow Section ─────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: 'rgba(10,15,30,0.5)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 700, color: 'white', marginBottom: 16 }}>
              How Nexus AI <span className="text-neon-purple">Works</span>
            </h2>
          </motion.div>

          <div style={{ position: 'relative' }}>
            {/* Vertical connector */}
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, #00d4ff30, #7c3aed30)', zIndex: 0 }} />

            {WORKFLOW.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24, position: 'relative', zIndex: 1 }}
              >
                <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, marginBottom: 12, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', color: 'white', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div className="glass-card" style={{ padding: 24, width: '100%', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 24 }}>{item.icon}</span>
                    <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#64748b' }}>STEP {item.step}</span>
                  </div>
                  <h3 style={{ color: 'white', fontWeight: 600, marginBottom: 4 }}>{item.title}</h3>
                  <p style={{ color: '#94a3b8', fontSize: 14 }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Grid ────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 700, color: 'white', marginBottom: 16 }}>
              Killer <span className="text-neon-cyan">Features</span>
            </h2>
            <p style={{ color: '#94a3b8', maxWidth: 500, margin: '0 auto' }}>
              Every feature is purpose-built to give you an unfair advantage.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5 }}
                className="glass-card"
                style={{ padding: 24, textAlign: 'center' }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', background: `${feature.color}15`, border: `1px solid ${feature.color}30` }}>
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 style={{ color: 'white', fontWeight: 600, marginBottom: 8 }}>{feature.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6 }}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '96px 24px', position: 'relative', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ width: 600, height: 400, borderRadius: '50%', filter: 'blur(80px)', opacity: 0.1, background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 1 }}
        >
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: 'white', marginBottom: 24 }}>
            Ready to Activate Your<br />
            <span style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI Boardroom?
            </span>
          </h2>
          <p style={{ color: '#94a3b8', fontSize: 18, marginBottom: 40 }}>
            Join the next generation of professionals using autonomous AI to achieve goals faster.
          </p>
          <button
            onClick={handleDemoEnter}
            className="btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '20px 40px', fontSize: 18, borderRadius: 16 }}
          >
            <Zap className="w-6 h-6" />
            Start for Free – No Login Needed
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────────────── */}
      <footer style={{ padding: '40px 24px', borderTop: '1px solid #1a2340' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 24, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'white', fontWeight: 700 }}>Nexus AI</span>
            <span style={{ color: '#475569', fontSize: 14 }}>– Autonomous Personal OS</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 14, color: '#475569' }}>
            <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Dashboard</Link>
            <Link href="/workspace" className="hover:text-cyan-400 transition-colors">Workspace</Link>
            <Link href="/simulator" className="hover:text-cyan-400 transition-colors">Simulator</Link>
            <Link href="/radar" className="hover:text-cyan-400 transition-colors">Radar</Link>
          </div>
          <p style={{ color: '#374151', fontSize: 12 }}>Built for Agentic AI Hackathon 2024</p>
        </div>
      </footer>
    </div>
  );
}
