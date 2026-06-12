'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/AppLayout';
import { boardroomAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const AGENTS = [
  { name: 'Career Agent', emoji: '💼', color: '#6366f1', role: 'Career Advisor', status: 'active' },
  { name: 'Learning Agent', emoji: '📚', color: '#06b6d4', role: 'Learning Strategist', status: 'active' },
  { name: 'Startup Agent', emoji: '🚀', color: '#f59e0b', role: 'Startup Advisor', status: 'thinking' },
  { name: 'Research Agent', emoji: '🔬', color: '#10b981', role: 'Research Lead', status: 'active' },
  { name: 'Productivity Agent', emoji: '⚡', color: '#ec4899', role: 'Productivity Coach', status: 'active' },
];

const DEMO_DEBATE = [
  { agent: 'Career Agent', emoji: '💼', color: '#6366f1', msg: 'Based on current market data, the fastest path to an AI Engineer role is through a structured 12-week skill building program, followed by targeted FAANG applications.', delay: 0 },
  { agent: 'Startup Agent', emoji: '🚀', color: '#f59e0b', msg: 'Respectfully disagree. The AI startup market is experiencing a 36% CAGR. Waiting 12 weeks means missing the current investment cycle. I recommend launching a side project immediately.', delay: 1.2 },
  { agent: 'Research Agent', emoji: '🔬', color: '#10b981', msg: 'My data shows both are viable paths. The key differentiator is the user\'s risk tolerance. The hybrid approach—build while learning—has shown a 73% higher long-term satisfaction rate.', delay: 2.4 },
  { agent: 'Learning Agent', emoji: '📚', color: '#06b6d4', msg: 'The Research Agent makes a strong point. I\'ve designed a curriculum that enables parallel skill building and side-project development. 2 hours daily is sufficient for both.', delay: 3.6 },
  { agent: 'Productivity Agent', emoji: '⚡', color: '#ec4899', msg: 'I agree with the hybrid path. Here\'s the execution framework: mornings for deep learning (1.5h), evenings for project building (1h). This maintains momentum on both tracks simultaneously.', delay: 4.8 },
];

export default function WorkspacePage() {
  const { user } = useAuth();
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [visibleDebates, setVisibleDebates] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: boardroomData } = useQuery({
    queryKey: ['boardroom', user?.id],
    queryFn: () => boardroomAPI.getLatest(user?.id || 'demo-user').then(r => r.data),
    placeholderData: null,
  });

  const debate = boardroomData?.debate?.length
    ? boardroomData.debate.map((d: any, i: number) => ({
        agent: d.agent,
        emoji: AGENTS.find(a => a.name === d.agent)?.emoji || '🤖',
        color: AGENTS.find(a => a.name === d.agent)?.color || '#94a3b8',
        msg: d.position,
        delay: i * 1.2,
      }))
    : DEMO_DEBATE;

  const startDebate = () => {
    setIsPlaying(true);
    setVisibleDebates(0);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setVisibleDebates(count);
      if (count >= debate.length) {
        clearInterval(interval);
        setIsPlaying(false);
      }
    }, 1200);
  };

  useEffect(() => {
    // Auto-play debate on mount
    const timer = setTimeout(startDebate, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            AI <span className="text-neon-cyan">Boardroom</span>
          </h1>
          <p className="text-slate-400">Your 5 expert advisors collaborating in real-time.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ─── Agent Grid ─────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <h2 className="text-white font-medium text-sm uppercase tracking-wider">Advisors</h2>
            {AGENTS.map((agent, i) => (
              <motion.button
                key={agent.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setActiveAgent(activeAgent === agent.name ? null : agent.name)}
                className="w-full p-4 rounded-xl text-left transition-all"
                style={{
                  background: activeAgent === agent.name ? `${agent.color}12` : 'rgba(13,20,38,0.7)',
                  border: `1px solid ${activeAgent === agent.name ? `${agent.color}40` : 'rgba(26,35,64,0.8)'}`,
                  backdropFilter: 'blur(10px)',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: `${agent.color}15`, border: `1px solid ${agent.color}30` }}>
                    {agent.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">{agent.name}</p>
                    <p className="text-slate-500 text-xs">{agent.role}</p>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    agent.status === 'thinking' ? 'status-dot-thinking' :
                    agent.status === 'active' ? 'status-dot-active' : 'bg-slate-600'
                  }`} />
                </div>

                {/* Agent capabilities */}
                <AnimatePresence>
                  {activeAgent === agent.name && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 overflow-hidden"
                      style={{ borderTop: `1px solid ${agent.color}20` }}
                    >
                      <p className="text-slate-500 text-xs">Core Capabilities</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {['Analysis', 'Planning', 'Recommendations', 'Insights'].map((cap) => (
                          <span key={cap} className="px-2 py-0.5 rounded text-xs"
                            style={{ background: `${agent.color}15`, color: agent.color }}>
                            {cap}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}

            {/* Graph visualization */}
            <div className="glass-card p-4 mt-4">
              <p className="text-slate-400 text-xs mb-3">Agent Network</p>
              <div className="relative w-full h-40 flex items-center justify-center">
                {/* Center node */}
                <div className="absolute z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', color: 'white' }}>
                  ✦
                </div>
                {/* Orbiting agent nodes */}
                {AGENTS.map((agent, i) => {
                  const angle = (i * 360) / AGENTS.length;
                  const rad = (angle * Math.PI) / 180;
                  const x = 50 + 38 * Math.cos(rad - Math.PI / 2);
                  const y = 50 + 35 * Math.sin(rad - Math.PI / 2);
                  return (
                    <div
                      key={agent.name}
                      className="absolute text-lg"
                      style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                      title={agent.name}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: `${agent.color}20`, border: `1px solid ${agent.color}50`, fontSize: '14px' }}
                      >
                        {agent.emoji}
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ─── Debate Terminal ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-medium text-sm uppercase tracking-wider">Live Debate</h2>
              <button
                onClick={startDebate}
                disabled={isPlaying}
                className="px-3 py-1.5 rounded-lg text-xs text-cyan-400 transition-all hover:bg-cyan-400/10 disabled:opacity-50"
                style={{ border: '1px solid rgba(0,212,255,0.2)' }}
              >
                {isPlaying ? '● Recording...' : '▶ Replay Debate'}
              </button>
            </div>

            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(2,8,22,0.9)',
                border: '1px solid rgba(26,35,64,0.8)',
                minHeight: '500px',
              }}
            >
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid rgba(26,35,64,0.5)' }}>
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="text-slate-600 text-xs ml-2 font-mono">nexus-ai/boardroom — debate-mode</span>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full status-dot-active" />
                  <span className="text-emerald-400 text-xs">LIVE</span>
                </div>
              </div>

              {/* Debate messages */}
              <div className="p-4 space-y-4 font-mono text-sm">
                <p className="text-slate-600 text-xs">{'>'} Orchestrator: Goal received. Activating specialist agents...</p>
                <p className="text-slate-600 text-xs">{'>'} All 5 agents connected. Starting debate phase...</p>
                <p className="text-slate-600 text-xs">{'>'} ─────────────────────────────────────────────</p>

                {debate.slice(0, visibleDebates).map((entry: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="debate-bubble"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                        style={{ background: `${entry.color}15`, border: `1px solid ${entry.color}30` }}>
                        {entry.emoji}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold mb-1.5 text-xs" style={{ color: entry.color }}>
                          [{entry.agent}]
                        </p>
                        <p className="text-slate-300 leading-relaxed text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {entry.msg}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isPlaying && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    <span className="text-cyan-400">{'>'}</span>
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                          className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {visibleDebates >= debate.length && debate.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="pt-2"
                    style={{ borderTop: '1px solid rgba(0,212,255,0.1)' }}
                  >
                    <p className="text-slate-600 text-xs">{'>'} Debate complete. Building consensus...</p>
                    <p className="text-cyan-400 text-xs mt-1">{'>'} ✓ Consensus: Hybrid Path – Career-First with Startup Incubation</p>
                    <p className="text-emerald-400 text-xs">{'>'} ✓ Success probability: 81%</p>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Goal context */}
            {boardroomData?.goal && (
              <div className="glass-card p-4">
                <p className="text-slate-500 text-xs mb-1">ANALYZING GOAL</p>
                <p className="text-white text-sm">&ldquo;{boardroomData.goal}&rdquo;</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
