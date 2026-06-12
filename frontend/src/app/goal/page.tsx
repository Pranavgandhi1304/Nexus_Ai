'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { Zap, Loader2, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { goalsAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getCategoryColor } from '@/lib/utils';
import Link from 'next/link';

const CATEGORIES = [
  { id: 'career', label: 'Career', emoji: '💼', desc: 'Jobs, resume, skill gaps' },
  { id: 'learning', label: 'Learning', emoji: '📚', desc: 'Study plans, GATE, courses' },
  { id: 'startup', label: 'Startup', emoji: '🚀', desc: 'Business model, market research' },
  { id: 'research', label: 'Research', emoji: '🔬', desc: 'Trends, papers, innovation' },
  { id: 'hackathon', label: 'Hackathon', emoji: '🏆', desc: 'Winning strategy & execution' },
  { id: 'general', label: 'General', emoji: '✨', desc: 'Any other goal' },
];

const EXAMPLE_GOALS = [
  { text: 'I want to become an AI Engineer at a top tech company within 12 months', category: 'career' },
  { text: 'I want to build and launch a SaaS product for developers this year', category: 'startup' },
  { text: 'I want to crack GATE 2026 with a score above 700', category: 'learning' },
  { text: 'I want to win a national-level hackathon with an AI project', category: 'hackathon' },
  { text: 'I want to switch careers from software development to ML research', category: 'research' },
  { text: 'I want to publish my first research paper on LLMs', category: 'research' },
];

const THINKING_STEPS = [
  '🧠 Analyzing your Digital Twin...',
  '⚡ Activating Career Agent...',
  '📚 Activating Learning Agent...',
  '🚀 Activating Startup Agent...',
  '🔬 Activating Research Agent...',
  '⚡ Agents entering debate mode...',
  '🗣️ Building consensus...',
  '📊 Simulating future outcomes...',
  '✅ Action plan ready!',
];

export default function GoalPage() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [thinkingStep, setThinkingStep] = useState(0);
  const [result, setResult] = useState<any>(null);

  const mutation = useMutation({
    mutationFn: () => goalsAPI.submit(user?.id || 'demo-user', title || description.slice(0, 80), description, category),
    onMutate: () => {
      // Simulate thinking progress
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setThinkingStep(step);
        if (step >= THINKING_STEPS.length - 1) clearInterval(interval);
      }, 800);
    },
    onSuccess: (res) => {
      setResult(res.data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setThinkingStep(0);
    mutation.mutate();
  };

  const useExample = (ex: typeof EXAMPLE_GOALS[0]) => {
    setDescription(ex.text);
    setTitle(ex.text.slice(0, 80));
    setCategory(ex.category);
  };

  if (result) {
    return (
      <AppLayout>
        <GoalResult result={result} onReset={() => { setResult(null); setDescription(''); setTitle(''); }} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Submit Your Goal</h1>
          <p className="text-slate-400">Tell us what you want to achieve. Our 5 AI agents will build your personalized plan.</p>
        </motion.div>

        {/* Example Goals */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <p className="text-slate-500 text-sm mb-3">Need inspiration? Try one of these:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_GOALS.map((ex, i) => (
              <button
                key={i}
                onClick={() => useExample(ex)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white transition-all hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                {ex.text.slice(0, 50)}...
              </button>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="glass-card p-6"
        >
          {/* Category Selection */}
          <div className="mb-6">
            <label className="text-slate-300 text-sm font-medium mb-3 block">Goal Category</label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className="flex flex-col items-center p-3 rounded-xl transition-all hover:scale-105"
                  style={{
                    background: category === cat.id ? `${getCategoryColor(cat.id)}15` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${category === cat.id ? `${getCategoryColor(cat.id)}40` : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  <span className="text-xl mb-1">{cat.emoji}</span>
                  <span className="text-xs text-white font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Goal Input */}
          <div className="mb-6">
            <label className="text-slate-300 text-sm font-medium mb-2 block">
              Describe Your Goal <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Be specific! E.g., 'I want to become an AI Engineer at a FAANG company within 12 months. I have 2 years of Python experience and basic ML knowledge...'"
              rows={5}
              required
              className="nexus-input resize-none"
            />
            <p className="text-slate-600 text-xs mt-1">More detail = better agent recommendations</p>
          </div>

          {/* Thinking State */}
          <AnimatePresence>
            {mutation.isPending && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-xl overflow-hidden"
                style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span className="text-cyan-400 text-sm font-medium">AI Boardroom Activated</span>
                </div>
                {THINKING_STEPS.slice(0, thinkingStep + 1).map((step, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-slate-400 text-sm font-mono"
                  >
                    {i < thinkingStep ? '✓ ' : '› '}{step}
                  </motion.p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {mutation.isError && (
            <div className="mb-4 p-3 rounded-lg flex items-center gap-2 text-red-400 text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertCircle className="w-4 h-4" />
              Backend unavailable – using demo mode. Results may be simulated.
            </div>
          )}

          <button
            type="submit"
            disabled={mutation.isPending || !description.trim()}
            className="btn-primary w-full py-4 text-base rounded-xl flex items-center justify-center gap-3"
          >
            {mutation.isPending ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Agents Working...</>
            ) : (
              <><Zap className="w-5 h-5" /> Activate AI Boardroom</>
            )}
          </button>
        </motion.form>
      </div>
    </AppLayout>
  );
}

function GoalResult({ result, onReset }: { result: any; onReset: () => void }) {
  const plan = result?.action_plan || result;
  const consensus = plan?.consensus || {};
  const debate = plan?.debate_transcript || [];
  const simulation = plan?.simulation || {};

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <h1 className="text-2xl font-bold text-white">Your Action Plan is Ready</h1>
        </div>
        <p className="text-slate-400">5 AI agents analyzed your goal and built your personalized roadmap.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consensus Plan */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5 lg:col-span-2">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span>🎯</span> Consensus Strategy
          </h2>
          {consensus.decision && (
            <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}>
              <p className="text-cyan-400 font-semibold">{consensus.decision}</p>
              <p className="text-slate-400 text-sm mt-1">{consensus.rationale}</p>
            </div>
          )}
          {[consensus.phase_1, consensus.phase_2, consensus.phase_3].filter(Boolean).map((phase: any, i) => (
            <div key={i} className="mb-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <p className="text-white font-medium mb-2">Phase {i + 1}: {phase.title}</p>
              <ul className="space-y-1">
                {(phase.actions || []).map((action: string, j: number) => (
                  <li key={j} className="text-slate-400 text-sm flex items-start gap-2">
                    <ChevronRight className="w-3 h-3 mt-0.5 text-cyan-400 flex-shrink-0" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {consensus.success_probability && (
            <div className="flex items-center gap-3 p-3 rounded-xl mt-2" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <span className="text-2xl">🎲</span>
              <div>
                <p className="text-emerald-400 font-bold text-lg">{Math.round(consensus.success_probability * 100)}% Success Probability</p>
                <p className="text-slate-500 text-xs">Based on multi-agent analysis and your Digital Twin</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Debate Transcript */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span>🗣️</span> Agent Debate
          </h2>
          <div className="space-y-3">
            {debate.map((entry: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="debate-bubble p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.02)', borderLeft: `3px solid ${entry.color}` }}
              >
                <p className="text-white text-xs font-medium mb-1">{entry.emoji} {entry.agent}</p>
                <p className="text-slate-400 text-xs leading-relaxed">{entry.position}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Simulation Preview */}
      {simulation.success_probability && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5 mt-6">
          <h2 className="text-white font-semibold mb-4">📊 6-Month Future Simulation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(simulation.timeline || []).slice(0, 4).map((item: any, i: number) => (
              <div key={i} className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <span className="text-2xl">{item.icon}</span>
                <p className="text-emerald-400 text-sm font-bold mt-1">{Math.round(item.probability * 100)}%</p>
                <p className="text-slate-400 text-xs">Month {item.month}</p>
                <p className="text-white text-xs mt-1">{item.milestone}</p>
              </div>
            ))}
          </div>
          <Link href="/simulator" className="text-cyan-400 text-sm mt-3 flex items-center gap-1 hover:gap-2 transition-all">
            Run full simulation <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}

      <div className="flex gap-3 mt-6">
        <button onClick={onReset} className="btn-secondary px-6 py-3 rounded-xl">Submit Another Goal</button>
        <Link href="/workspace" className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2">
          Open AI Workspace <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
