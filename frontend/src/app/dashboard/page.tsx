'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, TrendingUp, Target, Zap, Radar, Plus } from 'lucide-react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import { twinAPI, goalsAPI, radarAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { formatPercent, getCategoryBadgeClass } from '@/lib/utils';

// ─── Score Ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const dash = circ * score;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg width="112" height="112" viewBox="0 0 112 112">
          <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle
            cx="56" cy="56" r={r} fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            transform="rotate(-90 56 56)"
            style={{ transition: 'stroke-dasharray 1s ease', filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-white">{formatPercent(score)}</span>
        </div>
      </div>
      <p className="text-slate-400 text-xs mt-2 text-center">{label}</p>
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ title, value, sub, icon: Icon, color }: {
  title: string; value: string; sub: string; icon: React.ElementType; color: string;
}) {
  return (
    <motion.div whileHover={{ y: -3 }} className="glass-card p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <TrendingUp className="w-4 h-4 text-emerald-400" />
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-slate-600 text-xs mt-1">{sub}</p>
    </motion.div>
  );
}

// ─── Agent Activity ────────────────────────────────────────────────────────────
const AGENT_ACTIVITY = [
  { agent: 'Career Agent', action: 'Analyzed skill gaps for AI Engineer path', time: '2m ago', emoji: '💼', color: '#6366f1' },
  { agent: 'Learning Agent', action: 'Generated 12-week ML roadmap', time: '5m ago', emoji: '📚', color: '#06b6d4' },
  { agent: 'Research Agent', action: 'Found 3 trending AI opportunities', time: '8m ago', emoji: '🔬', color: '#10b981' },
  { agent: 'Productivity Agent', action: 'Scheduled this week\'s sprint tasks', time: '12m ago', emoji: '⚡', color: '#ec4899' },
  { agent: 'Startup Agent', action: 'Analyzed market conditions for EdTech', time: '20m ago', emoji: '🚀', color: '#f59e0b' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const userId = user?.id || 'demo-user';

  const { data: scoresData } = useQuery({
    queryKey: ['scores', userId],
    queryFn: () => twinAPI.getScores(userId).then(r => r.data),
    placeholderData: { ai_readiness_score: 0.62, skill_score: 0.58, goal_completion_rate: 0.45 },
  });

  const { data: goalsData } = useQuery({
    queryKey: ['goals', userId],
    queryFn: () => goalsAPI.getUserGoals(userId).then(r => r.data),
    placeholderData: [],
  });

  const { data: radarData } = useQuery({
    queryKey: ['radar', userId],
    queryFn: () => radarAPI.get(userId).then(r => r.data),
    placeholderData: [],
  });

  const scores = scoresData || { ai_readiness_score: 0.62, skill_score: 0.58, goal_completion_rate: 0.45 };
  const goals = (goalsData || []).slice(0, 4);
  const opportunities = (radarData || []).slice(0, 3);

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-slate-500 text-sm mb-1">Good morning,</p>
          <h1 className="text-3xl font-bold text-white">
            {user?.name || 'Alex Chen'} <span className="text-neon-cyan">✦</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Your AI boardroom is standing by.</p>
        </motion.div>

        {/* ─── Score Rings ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold">Your AI Twin Scores</h2>
            <Link href="/profile" className="text-cyan-400 text-sm flex items-center gap-1 hover:gap-2 transition-all">
              View Profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-8 justify-around">
            <ScoreRing score={scores.ai_readiness_score} label="AI Readiness Score" color="#00d4ff" />
            <ScoreRing score={scores.skill_score} label="Skill Score" color="#7c3aed" />
            <ScoreRing score={scores.goal_completion_rate} label="Goal Completion Rate" color="#10b981" />
            <ScoreRing score={0.73} label="Opportunity Match" color="#f59e0b" />
          </div>
        </motion.div>

        {/* ─── Stat Cards ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { title: 'Active Goals', value: String(goals.filter((g: any) => g.status === 'active').length || 3), sub: '+1 this week', icon: Target, color: '#6366f1' },
            { title: 'Sessions Run', value: '12', sub: 'LangGraph workflows', icon: Zap, color: '#00d4ff' },
            { title: 'Opportunities', value: String(opportunities.length || 8), sub: 'High-match alerts', icon: Radar, color: '#10b981' },
            { title: 'Simulations', value: '4', sub: 'Future paths explored', icon: TrendingUp, color: '#f59e0b' },
          ].map((stat, i) => (
            <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ─── Active Goals ───────────────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Active Goals</h2>
              <Link href="/goal" className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                <Plus className="w-3 h-3" /> New Goal
              </Link>
            </div>

            {goals.length > 0 ? (
              <div className="space-y-3">
                {goals.map((goal: any) => (
                  <div key={goal.id} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryBadgeClass(goal.category)}`}>{goal.category}</span>
                        <p className="text-white text-sm font-medium truncate">{goal.title}</p>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div className="h-full progress-bar rounded-full" style={{ width: `${goal.progress * 100}%` }} />
                      </div>
                    </div>
                    <span className="text-slate-400 text-xs flex-shrink-0">{Math.round(goal.progress * 100)}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500 mb-4">No goals yet. Let the agents guide you.</p>
                <Link href="/goal" className="btn-primary px-6 py-2 text-sm rounded-lg inline-block">
                  Submit Your First Goal
                </Link>
              </div>
            )}
          </motion.div>

          {/* ─── Agent Activity Feed ─────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
            <h2 className="text-white font-semibold mb-4">Agent Activity</h2>
            <div className="space-y-3">
              {AGENT_ACTIVITY.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.08 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}>
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium">{item.agent}</p>
                    <p className="text-slate-500 text-xs truncate">{item.action}</p>
                  </div>
                  <span className="text-slate-600 text-xs flex-shrink-0">{item.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ─── Opportunity Alerts ──────────────────────────────────────────────── */}
        {opportunities.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <Radar className="w-4 h-4 text-cyan-400" /> Opportunity Alerts
              </h2>
              <Link href="/radar" className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {opportunities.map((opp: any) => (
                <div key={opp.id} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryBadgeClass(opp.category)}`}>{opp.category}</span>
                    <span className="text-emerald-400 text-xs font-medium">{Math.round(opp.match_score * 100)}% match</span>
                  </div>
                  <p className="text-white text-sm font-medium mb-1">{opp.title}</p>
                  <p className="text-slate-500 text-xs">{opp.organization}</p>
                  {opp.prize_or_benefit && (
                    <p className="text-amber-400 text-xs mt-2">🏆 {opp.prize_or_benefit}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-3 mt-6"
        >
          {[
            { label: '+ Submit Goal', href: '/goal', color: '#00d4ff' },
            { label: '⚡ Run Simulation', href: '/simulator', color: '#7c3aed' },
            { label: '🚀 Build Project', href: '/project-builder', color: '#f59e0b' },
            { label: '📡 View Radar', href: '/radar', color: '#10b981' },
          ].map(({ label, href, color }) => (
            <Link
              key={href}
              href={href}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
              style={{ background: `${color}12`, border: `1px solid ${color}30`, color }}
            >
              {label}
            </Link>
          ))}
        </motion.div>
      </div>
    </AppLayout>
  );
}
