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
    description: 'Simulate where you\'ll be in 6 months and get a success probability score.',
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

export default function LandingPage() {
  const { demoLogin, isLoading } = useAuth();
  const router = useRouter();
  const [isEntering, setIsEntering] = useState(false);
  const [goalIdx, setGoalIdx] = useState(0);

  const handleDemoEnter = async () => {
    setIsEntering(true);
    try {
      await demoLogin();
      router.push('/dashboard');
    } catch {
      // Backend not running — still navigate to show UI
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen nexus-grid" style={{ backgroundColor: '#020816' }}>
      
      {/* ─── Nav ─────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, #00d4ff20, #7c3aed20)', border: '1px solid rgba(0,212,255,0.3)' }}>
              ✦
            </div>
            <span className="text-white font-bold text-lg">
              Nexus <span className="text-neon-cyan">AI</span>
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Link href="/auth" className="btn-secondary text-sm px-4 py-2 rounded-lg">
              Sign In
            </Link>
            <button onClick={handleDemoEnter} className="btn-primary text-sm px-4 py-2 rounded-lg flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Try Demo
            </button>
          </motion.div>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background glow blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div className="absolute top-20 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #00d4ff, transparent)' }} />

        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}
          >
            <Sparkles className="w-4 h-4" />
            Agentic AI Operating System · LangGraph Powered
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight"
          >
            Your Board of{' '}
            <span style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Expert AI
            </span>
            <br />
            Advisors
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-400 mb-4 max-w-3xl mx-auto leading-relaxed"
          >
            Not a chatbot. An autonomous multi-agent operating system that creates your 
            <strong className="text-slate-200"> Digital Twin</strong>, coordinates 5 AI experts, 
            and builds you a personalized path to your goals.
          </motion.p>

          {/* Rotating goal examples */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-10"
          >
            <p className="text-slate-500 text-sm mb-2">Enter any goal, like:</p>
            <motion.button
              key={goalIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setGoalIdx((goalIdx + 1) % EXAMPLE_GOALS.length)}
              className="px-6 py-3 rounded-xl text-base font-medium text-slate-300 cursor-pointer"
              style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}
            >
              &ldquo;{EXAMPLE_GOALS[goalIdx]}&rdquo;
            </motion.button>
            <p className="text-slate-600 text-xs mt-2">Click to cycle examples</p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={handleDemoEnter}
              disabled={isEntering}
              className="btn-primary flex items-center justify-center gap-2 px-8 py-4 text-base rounded-xl"
            >
              {isEntering ? (
                <><span className="animate-spin">⚙</span> Initializing OS...</>
              ) : (
                <><Zap className="w-5 h-5" /> Enter the AI Boardroom</>
              )}
            </button>
            <Link href="/auth" className="btn-secondary flex items-center justify-center gap-2 px-8 py-4 text-base rounded-xl">
              Create Account <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-slate-600 text-sm mt-6"
          >
            No credit card · Instant demo · 5 AI agents working for you
          </motion.p>
        </div>

        {/* ─── Agent Orbit ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="relative w-64 h-64 mx-auto mt-20 hidden md:block"
        >
          {/* Central orb */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl animate-glow"
              style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))', border: '1px solid rgba(0,212,255,0.4)' }}>
              ✦
            </div>
          </div>
          {/* Orbit ring */}
          <div className="absolute inset-0 rounded-full border border-dashed"
            style={{ borderColor: 'rgba(0,212,255,0.1)' }} />
          {/* Orbiting agents */}
          {AGENTS.map((agent, i) => (
            <motion.div
              key={agent.name}
              className="absolute"
              style={{
                top: '50%',
                left: '50%',
                marginTop: -16,
                marginLeft: -16,
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: 'linear',
                delay: (i * 360) / 5 / 360 * (10 + i * 2),
              }}
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 10 + i * 2, repeat: Infinity, ease: 'linear' }}
                title={agent.name}
                style={{
                  translateX: 100,
                  background: `${agent.color}20`,
                  border: `1px solid ${agent.color}60`,
                  fontSize: '18px',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {agent.emoji}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── Agent Showcase ──────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Meet Your AI <span className="text-neon-cyan">Boardroom</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Five specialist agents that debate, collaborate, and build consensus on your behalf.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {AGENTS.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card p-6 text-center cursor-default"
              >
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl"
                  style={{ background: `${agent.color}15`, border: `1px solid ${agent.color}40` }}>
                  {agent.emoji}
                </div>
                <h3 className="font-bold text-white text-sm mb-2">{agent.name}</h3>
                <p className="text-slate-500 text-xs">{agent.description}</p>
                <div className="mt-3 w-2 h-2 rounded-full mx-auto status-dot-active" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Workflow Section ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: 'rgba(10,15,30,0.5)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How Nexus AI <span className="text-neon-purple">Works</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Vertical connector */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block"
              style={{ background: 'linear-gradient(to bottom, #00d4ff30, #7c3aed30)' }} />
            
            {[
              { step: '01', title: 'Enter Your Goal', desc: 'Type any goal—career, startup, exam, hackathon.', icon: '🎯', side: 'left' },
              { step: '02', title: 'Digital Twin Analysis', desc: 'Your profile is created or updated with context.', icon: '🧠', side: 'right' },
              { step: '03', title: 'Agents Activated', desc: 'Relevant specialists are spun up in parallel.', icon: '⚡', side: 'left' },
              { step: '04', title: 'Debate & Consensus', desc: 'Agents challenge each other for the best path.', icon: '🗣️', side: 'right' },
              { step: '05', title: 'Future Simulation', desc: 'Probability scores and timelines are generated.', icon: '📊', side: 'left' },
              { step: '06', title: 'Your Action Plan', desc: 'Phased roadmap delivered with weekly objectives.', icon: '🗺️', side: 'right' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: item.side === 'left' ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-8 mb-10 ${item.side === 'right' ? 'flex-row-reverse' : ''}`}
              >
                <div className="flex-1">
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="text-xs font-mono text-slate-500">STEP {item.step}</span>
                    </div>
                    <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', color: 'white' }}>
                  {i + 1}
                </div>
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Grid ────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Killer <span className="text-neon-cyan">Features</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Every feature is purpose-built to give you an unfair advantage.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -5 }}
                className="glass-card p-6 group"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${feature.color}15`, border: `1px solid ${feature.color}30` }}>
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 text-center relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[400px] rounded-full blur-3xl opacity-10"
            style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Ready to Activate Your<br />
            <span style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI Boardroom?
            </span>
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Join the next generation of professionals using autonomous AI to achieve goals faster.
          </p>
          <button
            onClick={handleDemoEnter}
            className="btn-primary px-10 py-5 text-lg rounded-2xl flex items-center gap-3 mx-auto"
          >
            <Zap className="w-6 h-6" />
            Start for Free – No Login Needed
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="py-10 px-6 border-t" style={{ borderColor: '#1a2340' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">Nexus AI</span>
            <span className="text-slate-600 text-sm">– Autonomous Personal OS</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <Link href="/dashboard" className="hover:text-cyan-400 transition-colors">Dashboard</Link>
            <Link href="/workspace" className="hover:text-cyan-400 transition-colors">Workspace</Link>
            <Link href="/simulator" className="hover:text-cyan-400 transition-colors">Simulator</Link>
            <Link href="/radar" className="hover:text-cyan-400 transition-colors">Radar</Link>
          </div>
          <p className="text-slate-700 text-xs">Built for Agentic AI Hackathon 2024</p>
        </div>
      </footer>
    </div>
  );
}
