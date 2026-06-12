'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { History, CheckCircle, Clock, Target, BarChart3 } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { historyAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { formatDate, getCategoryBadgeClass } from '@/lib/utils';

const DEMO_HISTORY = {
  sessions: [
    { id: '1', goal_input: 'I want to become an AI Engineer', status: 'completed', agents_activated: ['Career Agent', 'Learning Agent', 'Research Agent'], created_at: new Date(Date.now() - 86400000).toISOString(), completed_at: new Date(Date.now() - 86000000).toISOString() },
    { id: '2', goal_input: 'I want to build a SaaS startup for developers', status: 'completed', agents_activated: ['Startup Agent', 'Research Agent', 'Productivity Agent'], created_at: new Date(Date.now() - 172800000).toISOString(), completed_at: new Date(Date.now() - 172400000).toISOString() },
    { id: '3', goal_input: 'Help me crack GATE 2026 with a good rank', status: 'completed', agents_activated: ['Learning Agent', 'Productivity Agent'], created_at: new Date(Date.now() - 259200000).toISOString(), completed_at: new Date(Date.now() - 258800000).toISOString() },
  ],
  goals: [
    { id: '1', title: 'Become AI Engineer', category: 'career', status: 'active', progress: 0.35, created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: '2', title: 'Build Developer SaaS', category: 'startup', status: 'active', progress: 0.15, created_at: new Date(Date.now() - 172800000).toISOString() },
    { id: '3', title: 'GATE 2026 Preparation', category: 'learning', status: 'active', progress: 0.22, created_at: new Date(Date.now() - 259200000).toISOString() },
  ],
  simulations: [
    { id: '1', scenario: 'Where will I be in 6 months if I study AI 2 hours daily?', success_probability: 0.81, created_at: new Date(Date.now() - 43200000).toISOString() },
    { id: '2', scenario: 'What if I launch a startup this quarter?', success_probability: 0.67, created_at: new Date(Date.now() - 86400000).toISOString() },
  ],
};

export default function HistoryPage() {
  const { user } = useAuth();

  const { data: history } = useQuery({
    queryKey: ['history', user?.id],
    queryFn: () => historyAPI.get(user?.id || 'demo-user').then(r => r.data),
    placeholderData: DEMO_HISTORY,
  });

  const data = history || DEMO_HISTORY;

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <History className="w-8 h-8 text-purple-400" /> History
          </h1>
          <p className="text-slate-400">All your past sessions, goals, and simulations.</p>
        </motion.div>

        <div className="space-y-8">
          {/* Sessions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" /> Agent Sessions ({data.sessions.length})
            </h2>
            <div className="space-y-3">
              {data.sessions.map((session: any, i: number) => (
                <motion.div key={session.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="glass-card p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-white font-medium flex-1 mr-4">&ldquo;{session.goal_input}&rdquo;</p>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 text-xs capitalize">{session.status}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {session.agents_activated.map((agent: string) => (
                      <span key={agent} className="px-2 py-0.5 rounded text-xs text-slate-400"
                        style={{ background: 'rgba(255,255,255,0.04)' }}>
                        {agent}
                      </span>
                    ))}
                  </div>
                  <p className="text-slate-600 text-xs">{formatDate(session.created_at)}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Goals */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" /> Goals ({data.goals.length})
            </h2>
            <div className="space-y-3">
              {data.goals.map((goal: any, i: number) => (
                <motion.div key={goal.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="glass-card p-4 flex items-center gap-4">
                  <span className={`px-2 py-1 rounded-full text-xs flex-shrink-0 ${getCategoryBadgeClass(goal.category)}`}>{goal.category}</span>
                  <p className="text-white flex-1">{goal.title}</p>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-24 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="h-full rounded-full progress-bar" style={{ width: `${goal.progress * 100}%` }} />
                    </div>
                    <span className="text-slate-400 text-xs">{Math.round(goal.progress * 100)}%</span>
                  </div>
                  <p className="text-slate-600 text-xs flex-shrink-0">{formatDate(goal.created_at)}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Simulations */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" /> Simulations ({data.simulations.length})
            </h2>
            <div className="space-y-3">
              {data.simulations.map((sim: any, i: number) => (
                <motion.div key={sim.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  className="glass-card p-4 flex items-center gap-4">
                  <p className="text-white flex-1">&ldquo;{sim.scenario}&rdquo;</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-emerald-400 font-bold">{Math.round(sim.success_probability * 100)}%</span>
                    <span className="text-slate-600 text-xs">success</span>
                  </div>
                  <p className="text-slate-600 text-xs flex-shrink-0">{formatDate(sim.created_at)}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
