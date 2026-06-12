'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Radar as RadarIcon, ExternalLink, Calendar, Star } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { radarAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getCategoryBadgeClass } from '@/lib/utils';

const CATEGORY_ICONS: Record<string, string> = {
  hackathon: '🏆',
  internship: '💼',
  scholarship: '🎓',
  competition: '⚔️',
  research: '🔬',
};

export default function RadarPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: opportunities = [], isLoading } = useQuery({
    queryKey: ['radar', user?.id, selectedCategory],
    queryFn: () => radarAPI.get(user?.id, selectedCategory || undefined).then(r => r.data),
    placeholderData: [],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['radar-categories'],
    queryFn: () => radarAPI.getCategories().then(r => r.data),
    placeholderData: ['hackathon', 'internship', 'scholarship', 'competition', 'research'],
  });

  const getDaysUntil = (deadline: string) => {
    if (!deadline) return null;
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <RadarIcon className="w-8 h-8 text-cyan-400" />
            Opportunity <span className="text-neon-cyan">Radar</span>
          </h1>
          <p className="text-slate-400">AI-matched opportunities based on your Digital Twin profile.</p>
        </motion.div>

        {/* Animated Radar Widget */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-6 flex flex-col md:flex-row items-center gap-8"
        >
          {/* Radar animation */}
          <div className="relative w-52 h-52 flex-shrink-0">
            <svg width="208" height="208" viewBox="0 0 208 208" className="absolute inset-0">
              {[40, 60, 80].map((r, i) => (
                <circle key={i} cx="104" cy="104" r={r} fill="none" stroke="rgba(0,212,255,0.08)" strokeWidth="1" />
              ))}
              <line x1="104" y1="24" x2="104" y2="184" stroke="rgba(0,212,255,0.08)" strokeWidth="1" />
              <line x1="24" y1="104" x2="184" y2="104" stroke="rgba(0,212,255,0.08)" strokeWidth="1" />
              {/* Sweeping line */}
              <line x1="104" y1="104" x2="104" y2="24"
                stroke="rgba(0,212,255,0.6)" strokeWidth="2"
                strokeLinecap="round"
                className="radar-sweep origin-[104px_104px]"
              />
              {/* Sweep gradient */}
              <path d="M104,104 L104,24 A80,80,0,0,1,184,104Z"
                fill="url(#radarGrad)" className="radar-sweep origin-[104px_104px]" />
              <defs>
                <radialGradient id="radarGrad" cx="104" cy="104" r="80" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
            {/* Ping dots */}
            {(opportunities as any[]).slice(0, 5).map((_: any, i: number) => {
              const angle = (i * 360) / 5;
              const rad = (angle * Math.PI) / 180;
              const dist = 35 + (i % 3) * 20;
              const x = 104 + dist * Math.cos(rad - Math.PI / 2);
              const y = 104 + dist * Math.sin(rad - Math.PI / 2);
              return (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    left: x - 6,
                    top: y - 6,
                    background: '#00d4ff',
                    boxShadow: '0 0 8px rgba(0,212,255,0.8)',
                  }}
                  animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                />
              );
            })}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,212,255,0.2)', border: '1px solid rgba(0,212,255,0.4)' }}>
                <span className="text-cyan-400 text-sm">✦</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1">
            <h2 className="text-white font-semibold mb-2">Your Match Profile</h2>
            <p className="text-slate-400 text-sm mb-4">
              Nexus AI continuously scans for opportunities and ranks them by match with your Digital Twin.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Opportunities', value: String((opportunities as any[]).length || 8), color: '#00d4ff' },
                { label: 'High Match (>70%)', value: String((opportunities as any[]).filter((o: any) => o.match_score > 0.7).length || 5), color: '#10b981' },
                { label: 'Deadlines Soon', value: String((opportunities as any[]).filter((o: any) => { const d = getDaysUntil(o.deadline); return d && d <= 30; }).length || 3), color: '#f59e0b' },
                { label: 'Avg Match Score', value: `${Math.round(((opportunities as any[]).reduce((s: number, o: any) => s + o.match_score, 0) / Math.max((opportunities as any[]).length, 1)) * 100) || 76}%`, color: '#7c3aed' },
              ].map((stat) => (
                <div key={stat.label} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-slate-500 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: !selectedCategory ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.02)',
              color: !selectedCategory ? '#00d4ff' : '#64748b',
              border: !selectedCategory ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(255,255,255,0.05)',
            }}
          >
            All
          </button>
          {(categories as string[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize"
              style={{
                background: selectedCategory === cat ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.02)',
                color: selectedCategory === cat ? '#00d4ff' : '#64748b',
                border: selectedCategory === cat ? '1px solid rgba(0,212,255,0.3)' : '1px solid rgba(255,255,255,0.05)',
              }}
            >
              {CATEGORY_ICONS[cat]} {cat}
            </button>
          ))}
        </div>

        {/* Opportunities Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="glass-card p-5 h-40 shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(opportunities as any[]).map((opp: any, i: number) => {
              const days = getDaysUntil(opp.deadline);
              const matchPct = Math.round(opp.match_score * 100);
              return (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -4 }}
                  className="glass-card p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: 'rgba(255,255,255,0.04)' }}>
                        {CATEGORY_ICONS[opp.category] || '✨'}
                      </div>
                      <div>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getCategoryBadgeClass(opp.category)}`}>
                          {opp.category}
                        </span>
                      </div>
                    </div>
                    {/* Match score ring */}
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3 h-3" style={{ color: matchPct >= 80 ? '#10b981' : matchPct >= 60 ? '#f59e0b' : '#94a3b8' }} />
                      <span className="text-sm font-bold" style={{ color: matchPct >= 80 ? '#10b981' : matchPct >= 60 ? '#f59e0b' : '#94a3b8' }}>
                        {matchPct}% match
                      </span>
                    </div>
                  </div>

                  <h3 className="text-white font-semibold mb-1">{opp.title}</h3>
                  <p className="text-slate-400 text-xs mb-1">{opp.organization}</p>
                  <p className="text-slate-500 text-sm leading-relaxed mb-3 line-clamp-2">{opp.description}</p>

                  {opp.prize_or_benefit && (
                    <p className="text-amber-400 text-xs mb-3">🏆 {opp.prize_or_benefit}</p>
                  )}

                  <div className="flex flex-wrap gap-1 mb-3">
                    {(opp.tags || []).slice(0, 4).map((tag: string) => (
                      <span key={tag} className="px-2 py-0.5 rounded text-xs" style={{ background: 'rgba(255,255,255,0.04)', color: '#94a3b8' }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    {days !== null && (
                      <div className="flex items-center gap-1 text-xs" style={{ color: days <= 15 ? '#ef4444' : days <= 30 ? '#f59e0b' : '#64748b' }}>
                        <Calendar className="w-3 h-3" />
                        {days <= 0 ? 'Deadline passed' : `${days} days left`}
                      </div>
                    )}
                    {opp.url && (
                      <a href={opp.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-cyan-400 text-xs hover:text-cyan-300 transition-colors ml-auto">
                        Apply <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
