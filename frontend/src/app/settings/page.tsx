'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Brain, Key, Moon, Info, ChevronRight } from 'lucide-react';
import AppLayout from '@/components/AppLayout';

const SECTIONS = [
  {
    title: 'AI Configuration',
    icon: Brain,
    color: '#00d4ff',
    settings: [
      { key: 'provider', label: 'AI Provider', type: 'select', options: ['Mock (Demo)', 'OpenAI GPT-4o', 'Google Gemini Pro'], value: 'Mock (Demo)' },
      { key: 'agents', label: 'Active Agents', type: 'toggle-group', options: ['Career Agent', 'Learning Agent', 'Startup Agent', 'Research Agent', 'Productivity Agent'] },
    ],
  },
  {
    title: 'Notifications',
    icon: Bell,
    color: '#f59e0b',
    settings: [
      { key: 'opp_alerts', label: 'Opportunity Alerts', type: 'toggle', value: true },
      { key: 'agent_updates', label: 'Agent Activity Feed', type: 'toggle', value: true },
      { key: 'sim_complete', label: 'Simulation Complete', type: 'toggle', value: false },
    ],
  },
  {
    title: 'API Keys',
    icon: Key,
    color: '#7c3aed',
    settings: [
      { key: 'openai', label: 'OpenAI API Key', type: 'password', placeholder: 'sk-...' },
      { key: 'google', label: 'Google Gemini API Key', type: 'password', placeholder: 'AIza...' },
    ],
  },
  {
    title: 'Appearance',
    icon: Moon,
    color: '#6366f1',
    settings: [
      { key: 'theme', label: 'Theme', type: 'select', options: ['Dark (Default)', 'Light', 'System'], value: 'Dark (Default)' },
      { key: 'animations', label: 'UI Animations', type: 'toggle', value: true },
    ],
  },
];

export default function SettingsPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    opp_alerts: true,
    agent_updates: true,
    sim_complete: false,
    animations: true,
  });
  const [keys, setKeys] = useState<Record<string, string>>({ openai: '', google: '' });

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Settings className="w-8 h-8 text-slate-400" /> Settings
          </h1>
          <p className="text-slate-400">Configure Nexus AI to match your workflow.</p>
        </motion.div>

        {/* Demo mode notice */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-4 mb-6 flex items-start gap-3"
          style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)' }}>
          <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-cyan-400 font-medium text-sm">Demo Mode Active</p>
            <p className="text-slate-400 text-xs mt-1">
              Nexus AI is running with mock AI responses. Add an OpenAI or Google Gemini API key below to activate real agents.
            </p>
          </div>
        </motion.div>

        <div className="space-y-4">
          {SECTIONS.map((section, si) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + si * 0.08 }}
              className="glass-card p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${section.color}15`, border: `1px solid ${section.color}30` }}>
                  <section.icon className="w-4 h-4" style={{ color: section.color }} />
                </div>
                <h2 className="text-white font-semibold">{section.title}</h2>
              </div>

              <div className="space-y-3">
                {section.settings.map((setting: any) => (
                  <div key={setting.key} className="flex items-center justify-between py-2"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <label className="text-slate-300 text-sm">{setting.label}</label>
                    {setting.type === 'toggle' && (
                      <button
                        onClick={() => setToggles(t => ({ ...t, [setting.key]: !t[setting.key] }))}
                        className="w-11 h-6 rounded-full transition-all relative"
                        style={{ background: toggles[setting.key] ? section.color : 'rgba(255,255,255,0.1)' }}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${toggles[setting.key] ? 'left-6' : 'left-1'}`} />
                      </button>
                    )}
                    {setting.type === 'select' && (
                      <select className="nexus-input w-auto text-sm py-1">
                        {setting.options.map((opt: string) => <option key={opt}>{opt}</option>)}
                      </select>
                    )}
                    {setting.type === 'password' && (
                      <input type="password" value={keys[setting.key]} onChange={e => setKeys(k => ({ ...k, [setting.key]: e.target.value }))}
                        placeholder={setting.placeholder} className="nexus-input w-64 text-sm" />
                    )}
                    {setting.type === 'toggle-group' && (
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {setting.options.map((opt: string) => (
                          <span key={opt} className="px-2 py-0.5 rounded text-xs text-emerald-400"
                            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                            ✓ {opt.replace(' Agent', '')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-6">
          <button className="btn-primary px-6 py-3 rounded-xl w-full flex items-center justify-center gap-2">
            Save Settings <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AppLayout>
  );
}
