'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { Hammer, Loader2, Database, Server, Globe, Rocket, Code2 } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { projectAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function ProjectBuilderPage() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [blueprint, setBlueprint] = useState<any>(null);

  const mutation = useMutation({
    mutationFn: () => projectAPI.build(user?.id || 'demo-user', name, description),
    onSuccess: (res) => setBlueprint(res.data),
    onError: () => {
      // Demo blueprint fallback
      setBlueprint({
        idea: description,
        tech_stack: {
          frontend: ['Next.js 15', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
          backend: ['FastAPI', 'Python 3.12', 'LangChain', 'LangGraph'],
          ai_layer: ['OpenAI GPT-4o', 'ChromaDB', 'LangSmith'],
          database: ['PostgreSQL', 'Redis', 'Pinecone (Vector DB)'],
          deployment: ['Vercel (Frontend)', 'Railway (Backend)', 'Docker'],
        },
        architecture: {
          pattern: 'Microservices with API Gateway',
          components: [
            { name: 'Frontend SPA', tech: 'Next.js 15', responsibility: 'User interface and state management' },
            { name: 'API Gateway', tech: 'FastAPI', responsibility: 'Route requests, auth, rate limiting' },
            { name: 'Core Service', tech: 'Python', responsibility: 'Business logic and AI orchestration' },
            { name: 'Database Layer', tech: 'PostgreSQL + Redis', responsibility: 'Persistent storage and caching' },
            { name: 'AI Pipeline', tech: 'LangGraph', responsibility: 'Multi-agent coordination' },
          ],
        },
        dev_roadmap: [
          { sprint: 1, week: 'Week 1-2', goal: 'Setup & Core Architecture', tasks: ['Repo setup', 'DB schema', 'API skeleton', 'Auth'] },
          { sprint: 2, week: 'Week 3-4', goal: 'Core Features', tasks: ['CRUD operations', 'UI components', 'AI integration', 'Testing'] },
          { sprint: 3, week: 'Week 5-6', goal: 'Polish & Advanced', tasks: ['Real-time features', 'Mobile responsive', 'Optimization', 'Error handling'] },
          { sprint: 4, week: 'Week 7-8', goal: 'Launch', tasks: ['CI/CD', 'Staging deploy', 'Beta testing', 'Production'] },
        ],
        deployment_strategy: {
          staging: 'Railway + Vercel preview',
          production: 'Railway Pro + Vercel Pro + Cloudflare',
          ci_cd: 'GitHub Actions',
          monitoring: 'Sentry + Grafana',
          estimated_cost: '$25-50/month',
        },
      });
    },
  });

  const EXAMPLE_IDEAS = [
    'AI-powered resume builder with ATS scoring',
    'Multi-agent customer support chatbot for e-commerce',
    'LangGraph-based research assistant for academics',
    'Real-time collaborative coding platform with AI copilot',
    'Personalized fitness coach using computer vision',
  ];

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Hammer className="w-8 h-8 text-amber-400" />
            Project <span className="text-neon-cyan">Builder</span>
          </h1>
          <p className="text-slate-400">Turn any idea into a complete technical blueprint in seconds.</p>
        </motion.div>

        {/* Input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 mb-6">
          <div className="mb-4">
            <p className="text-slate-500 text-sm mb-2">Need inspiration?</p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_IDEAS.map((idea) => (
                <button key={idea} onClick={() => { setName(idea.slice(0, 40)); setDescription(idea); }}
                  className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:text-white transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {idea}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-slate-300 text-sm mb-2 block">Project Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. NexusBot" className="nexus-input" />
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-2 block">Project Idea *</label>
              <input value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you want to build..."
                className="nexus-input" />
            </div>
          </div>

          <button onClick={() => mutation.mutate()} disabled={mutation.isPending || !description.trim()}
            className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2">
            {mutation.isPending
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating Blueprint...</>
              : <><Rocket className="w-4 h-4" /> Generate Blueprint</>}
          </button>
        </motion.div>

        <AnimatePresence>
          {blueprint && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Tech Stack */}
              <div className="glass-card p-6">
                <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-cyan-400" /> Recommended Tech Stack
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(blueprint.tech_stack || {}).map(([layer, techs]: [string, any]) => (
                    <div key={layer} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">{layer.replace('_', ' ')}</p>
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(techs) ? techs : Object.values(techs)).map((tech: any) => (
                          <span key={tech} className="px-2 py-1 rounded text-xs text-cyan-300"
                            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Architecture + Sprint Plan side by side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Architecture */}
                <div className="glass-card p-6">
                  <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Server className="w-5 h-5 text-purple-400" /> System Architecture
                  </h2>
                  <p className="text-slate-500 text-xs mb-3">{blueprint.architecture?.pattern}</p>
                  <div className="space-y-3">
                    {(blueprint.architecture?.components || []).map((comp: any, i: number) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-3 p-3 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: 'rgba(124,58,237,0.15)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)' }}>
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{comp.name}</p>
                          <p className="text-slate-400 text-xs">{comp.tech}</p>
                          <p className="text-slate-600 text-xs">{comp.responsibility}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Sprint Plan */}
                <div className="glass-card p-6">
                  <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-amber-400" /> Development Roadmap
                  </h2>
                  <div className="space-y-3">
                    {(blueprint.dev_roadmap || []).map((sprint: any, i: number) => (
                      <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                        className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid #f59e0b' }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-amber-400 text-xs font-mono">{sprint.week}</span>
                          <span className="text-slate-500 text-xs">Sprint {sprint.sprint}</span>
                        </div>
                        <p className="text-white text-sm font-medium mb-2">{sprint.goal}</p>
                        <div className="flex flex-wrap gap-1">
                          {(sprint.tasks || []).map((task: string) => (
                            <span key={task} className="text-xs text-slate-400 px-2 py-0.5 rounded"
                              style={{ background: 'rgba(255,255,255,0.03)' }}>
                              ✓ {task}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Deployment */}
              <div className="glass-card p-6">
                <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-400" /> Deployment Strategy
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(blueprint.deployment_strategy || {}).map(([key, val]: [string, any]) => (
                    <div key={key} className="p-3 rounded-xl text-center" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
                      <p className="text-slate-500 text-xs capitalize mb-1">{key.replace('_', ' ')}</p>
                      <p className="text-emerald-400 text-xs font-medium">{val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Database design */}
              {blueprint.database_design?.tables && (
                <div className="glass-card p-6">
                  <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Database className="w-5 h-5 text-blue-400" /> Database Schema
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {blueprint.database_design.tables.map((table: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl min-w-40"
                        style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}>
                        <p className="text-blue-400 font-mono text-sm font-bold mb-2">📋 {table.name}</p>
                        {table.columns.map((col: string) => (
                          <p key={col} className="text-slate-400 text-xs font-mono">└ {col}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => setBlueprint(null)} className="btn-secondary px-6 py-3 rounded-xl">
                Build Another Project
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
