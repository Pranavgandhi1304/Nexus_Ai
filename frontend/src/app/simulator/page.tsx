'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { BarChart3, Loader2, TrendingUp, AlertTriangle, Zap } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { simulateAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

// ─── Demo Simulation Data ─────────────────────────────────────────────────────
const DEMO_RESULT = {
  success_probability: 0.81,
  readiness_score: 0.73,
  timeline: [
    { month: 1, milestone: 'Python + ML Fundamentals', probability: 0.92, icon: '🎯' },
    { month: 2, milestone: 'First ML Project Deployed', probability: 0.85, icon: '🚀' },
    { month: 3, milestone: 'LLM Applications Built', probability: 0.78, icon: '🤖' },
    { month: 4, milestone: 'Portfolio + Job Applications', probability: 0.71, icon: '💼' },
    { month: 5, milestone: 'Interviews + Hackathon Win', probability: 0.65, icon: '🏆' },
    { month: 6, milestone: 'Job Offer / Startup Launch', probability: 0.81, icon: '⭐' },
  ],
  skill_growth: {
    'Month 1': { Python: 40, 'Machine Learning': 22, 'Deep Learning': 16, 'LLMs': 10, 'System Design': 24 },
    'Month 2': { Python: 55, 'Machine Learning': 38, 'Deep Learning': 27, 'LLMs': 22, 'System Design': 32 },
    'Month 3': { Python: 70, 'Machine Learning': 52, 'Deep Learning': 44, 'LLMs': 38, 'System Design': 41 },
    'Month 4': { Python: 80, 'Machine Learning': 64, 'Deep Learning': 58, 'LLMs': 52, 'System Design': 51 },
    'Month 5': { Python: 88, 'Machine Learning': 74, 'Deep Learning': 69, 'LLMs': 64, 'System Design': 60 },
    'Month 6': { Python: 94, 'Machine Learning': 82, 'Deep Learning': 78, 'LLMs': 76, 'System Design': 69 },
  },
  risks: [
    { risk: 'Burnout from aggressive schedule', probability: 0.35, mitigation: 'Schedule mandatory rest days + weekly reviews' },
    { risk: 'Market saturation in AI roles', probability: 0.4, mitigation: 'Specialize in a niche area (AgriTech AI, LegalTech)' },
    { risk: 'Technology stack becoming outdated', probability: 0.25, mitigation: 'Focus on fundamentals + follow arXiv weekly' },
  ],
  opportunity_forecast: [
    { opportunity: 'ML Engineer Role at Startup', probability: 0.72, timeline: 'Month 4-5' },
    { opportunity: 'Freelance AI Projects', probability: 0.85, timeline: 'Month 3+' },
    { opportunity: 'Open Source Recognition', probability: 0.68, timeline: 'Month 2+' },
  ],
};

export default function SimulatorPage() {
  const { user } = useAuth();
  const [scenario, setScenario] = useState('');
  const [timeframe, setTimeframe] = useState(6);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [result, setResult] = useState<typeof DEMO_RESULT | null>(null);
  const [selectedSkill, setSelectedSkill] = useState('Machine Learning');

  const mutation = useMutation({
    mutationFn: () => simulateAPI.run(user?.id || 'demo-user', scenario, timeframe, { hours_per_day: hoursPerDay }),
    onSuccess: (res) => setResult(res.data),
    onError: () => setResult(DEMO_RESULT), // Fallback to demo
  });

  const handleSimulate = () => {
    if (!scenario.trim()) return;
    mutation.mutate();
  };

  const chartData = result
    ? Object.entries(result.skill_growth).map(([month, skills]: [string, any]) => ({
        month: month.replace('Month ', 'M'),
        ...skills,
      }))
    : [];

  const radarData = result?.timeline?.map((t: any) => ({
    subject: `M${t.month}`,
    probability: Math.round(t.probability * 100),
  })) || [];

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Future <span className="text-neon-cyan">Simulator</span>
          </h1>
          <p className="text-slate-400">Model possible futures and get AI-generated probability scores for your goals.</p>
        </motion.div>

        {/* Input Panel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Configure Your Simulation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="text-slate-300 text-sm mb-2 block">Scenario</label>
              <input
                type="text"
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                placeholder="e.g. Where will I be in 6 months if I study AI 2 hours daily?"
                className="nexus-input"
              />
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-2 block">Timeframe: {timeframe} months</label>
              <input
                type="range" min={3} max={24} value={timeframe}
                onChange={(e) => setTimeframe(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-slate-600 text-xs mt-1"><span>3mo</span><span>24mo</span></div>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-slate-300 text-sm mb-2 block">Daily Study Hours: {hoursPerDay}h</label>
            <input
              type="range" min={0.5} max={8} step={0.5} value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-slate-600 text-xs mt-1"><span>0.5h</span><span>8h</span></div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleSimulate} disabled={mutation.isPending || !scenario.trim()} className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2">
              {mutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Simulating...</> : <><BarChart3 className="w-4 h-4" /> Run Simulation</>}
            </button>
            <button onClick={() => { setScenario('Where will I be in 6 months if I study AI 2 hours daily?'); setResult(DEMO_RESULT); }}
              className="btn-secondary px-6 py-3 rounded-xl">
              Try Demo Simulation
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Success metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Success Probability', value: `${Math.round(result.success_probability * 100)}%`, color: '#10b981', icon: '🎯' },
                  { label: 'Readiness Score', value: `${Math.round(result.readiness_score * 100)}%`, color: '#00d4ff', icon: '⚡' },
                  { label: 'Timeline', value: `${timeframe} months`, color: '#7c3aed', icon: '📅' },
                  { label: 'Study Hours', value: `${hoursPerDay}h/day`, color: '#f59e0b', icon: '📚' },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                    className="glass-card p-5 text-center">
                    <p className="text-2xl mb-2">{item.icon}</p>
                    <p className="text-2xl font-bold" style={{ color: item.color }}>{item.value}</p>
                    <p className="text-slate-500 text-xs mt-1">{item.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Milestone Timeline */}
              <div className="glass-card p-6">
                <h2 className="text-white font-semibold mb-4">Milestone Probability Curve</h2>
                <div className="flex flex-wrap gap-3 mb-4">
                  {result.timeline.map((t: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl flex-1 min-w-48"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span className="text-xl">{t.icon}</span>
                      <div>
                        <p className="text-white text-xs font-medium">Month {t.month}</p>
                        <p className="text-slate-400 text-xs">{t.milestone}</p>
                        <p className="font-bold text-sm" style={{ color: t.probability > 0.7 ? '#10b981' : t.probability > 0.5 ? '#f59e0b' : '#ef4444' }}>
                          {Math.round(t.probability * 100)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Growth Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white font-semibold">Skill Growth Projection</h2>
                    <select
                      value={selectedSkill}
                      onChange={(e) => setSelectedSkill(e.target.value)}
                      className="nexus-input w-auto text-sm py-1"
                    >
                      {Object.keys(chartData[0] || {}).filter(k => k !== 'month').map(skill => (
                        <option key={skill} value={skill}>{skill}</option>
                      ))}
                    </select>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="skillGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
                      <Tooltip contentStyle={{ background: '#0d1426', border: '1px solid #1a2340', borderRadius: 8, color: '#e2e8f0' }} />
                      <Area type="monotone" dataKey={selectedSkill} stroke="#00d4ff" fill="url(#skillGrad)" strokeWidth={2} dot={{ fill: '#00d4ff', r: 4 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Risks */}
                <div className="glass-card p-6">
                  <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" /> Risk Analysis
                  </h2>
                  <div className="space-y-4">
                    {result.risks.map((risk: any, i: number) => (
                      <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-white text-sm font-medium">{risk.risk}</p>
                          <span className="text-amber-400 text-xs">{Math.round(risk.probability * 100)}%</span>
                        </div>
                        <div className="h-1 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <div className="h-full rounded-full" style={{ width: `${risk.probability * 100}%`, background: '#f59e0b' }} />
                        </div>
                        <p className="text-slate-500 text-xs">Mitigation: {risk.mitigation}</p>
                      </div>
                    ))}
                  </div>

                  {/* Opportunities */}
                  <h3 className="text-white font-medium mt-4 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" /> Opportunity Forecast
                  </h3>
                  {result.opportunity_forecast.map((opp: any, i: number) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b last:border-0"
                      style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      <div>
                        <p className="text-white text-xs font-medium">{opp.opportunity}</p>
                        <p className="text-slate-600 text-xs">{opp.timeline}</p>
                      </div>
                      <span className="text-emerald-400 text-xs font-bold">{Math.round(opp.probability * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
