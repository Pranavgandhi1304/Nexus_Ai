'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Edit3, Plus, X, Check } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { twinAPI } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { formatPercent } from '@/lib/utils';

const SKILL_OPTIONS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'FastAPI', 'Node.js',
  'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'LangChain',
  'LangGraph', 'TensorFlow', 'PyTorch', 'Docker', 'Kubernetes', 'AWS', 'GCP',
  'PostgreSQL', 'Redis', 'MongoDB', 'GraphQL', 'REST APIs', 'System Design',
];

const CAREER_STAGES = ['Student', 'Fresh Graduate', 'Junior (1-2 years)', 'Mid-Level (3-5 years)', 'Senior (5+ years)', 'Lead/Principal', 'Founder'];

export default function ProfilePage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const { data: twin, isLoading } = useQuery({
    queryKey: ['twin', user?.id],
    queryFn: () => twinAPI.get(user?.id || 'demo-user').then(r => r.data),
    placeholderData: {
      skills: ['Python', 'Machine Learning', 'React', 'FastAPI', 'SQL'],
      interests: ['AI/ML', 'Web Development', 'Startups'],
      career_stage: 'Student',
      ai_readiness_score: 0.62,
      skill_score: 0.58,
      goal_completion_rate: 0.45,
      achievements: ['Built first ML model', 'Completed Python bootcamp'],
      context_summary: 'Final year CS student passionate about AI/ML.',
    },
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [careerStage, setCareerStage] = useState('');

  const updateMutation = useMutation({
    mutationFn: () => twinAPI.update(user?.id || 'demo-user', {
      skills: skills.length > 0 ? skills : twin?.skills,
      career_stage: careerStage || twin?.career_stage,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['twin'] });
      setEditMode(false);
    },
  });

  const handleEdit = () => {
    setSkills(twin?.skills || []);
    setCareerStage(twin?.career_stage || '');
    setEditMode(true);
  };

  const addSkill = (skill: string) => {
    if (!skills.includes(skill)) setSkills([...skills, skill]);
    setNewSkill('');
  };

  const removeSkill = (skill: string) => setSkills(skills.filter(s => s !== skill));

  const displayData = isLoading ? {
    skills: ['Python', 'Machine Learning'],
    interests: ['AI/ML', 'Web Development'],
    career_stage: 'Student',
    ai_readiness_score: 0.62,
    skill_score: 0.58,
    goal_completion_rate: 0.45,
    achievements: [],
    context_summary: '',
  } : twin;

  return (
    <AppLayout>
      <div className="p-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Digital Twin</h1>
          <p className="text-slate-400">Your evolving AI profile that powers personalized recommendations.</p>
        </motion.div>

        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold"
                style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: 'white' }}>
                {(user?.name?.[0] || 'A').toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{user?.name || 'Alex Chen'}</h2>
                <p className="text-slate-400">{user?.email || 'demo@nexus.ai'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded text-xs text-purple-300"
                    style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
                    {displayData?.career_stage || 'Student'}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full status-dot-active" />
                  <span className="text-emerald-400 text-xs">Twin Active</span>
                </div>
              </div>
            </div>
            <button onClick={editMode ? () => setEditMode(false) : handleEdit}
              className="btn-secondary px-4 py-2 rounded-xl flex items-center gap-2 text-sm">
              <Edit3 className="w-4 h-4" /> {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Score bars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'AI Readiness Score', value: displayData?.ai_readiness_score || 0.62, color: '#00d4ff' },
              { label: 'Skill Score', value: displayData?.skill_score || 0.58, color: '#7c3aed' },
              { label: 'Goal Completion Rate', value: displayData?.goal_completion_rate || 0.45, color: '#10b981' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400 text-sm">{item.label}</span>
                  <span className="font-bold text-sm" style={{ color: item.color }}>{formatPercent(item.value)}</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full rounded-full"
                    style={{ background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <h2 className="text-white font-semibold mb-4">Skills</h2>
            {editMode ? (
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {skills.map((skill) => (
                    <span key={skill} className="flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                      style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }}>
                      {skill}
                      <button onClick={() => removeSkill(skill)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
                <p className="text-slate-500 text-xs mb-2">Add from suggestions:</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {SKILL_OPTIONS.filter(s => !skills.includes(s)).slice(0, 12).map((skill) => (
                    <button key={skill} onClick={() => addSkill(skill)}
                      className="px-2 py-1 rounded text-xs text-slate-400 hover:text-white transition-all"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      + {skill}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={newSkill} onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addSkill(newSkill)}
                    placeholder="Custom skill..." className="nexus-input text-sm" />
                  <button onClick={() => addSkill(newSkill)} className="btn-primary px-3 py-2 rounded-lg text-sm">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(displayData?.skills || []).map((skill: string) => (
                  <span key={skill} className="px-3 py-1 rounded-full text-sm"
                    style={{ background: 'rgba(0,212,255,0.08)', color: '#22d3ee', border: '1px solid rgba(0,212,255,0.2)' }}>
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Career Stage */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card p-6">
            <h2 className="text-white font-semibold mb-4">Career Stage</h2>
            {editMode ? (
              <div className="grid grid-cols-2 gap-2">
                {CAREER_STAGES.map((stage) => (
                  <button key={stage} onClick={() => setCareerStage(stage)}
                    className="p-3 rounded-xl text-sm text-left transition-all"
                    style={{
                      background: careerStage === stage ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${careerStage === stage ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.06)'}`,
                      color: careerStage === stage ? '#a78bfa' : '#64748b',
                    }}>
                    {stage}
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl mb-3"
                  style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
                  👨‍💻
                </div>
                <p className="text-white text-xl font-bold">{displayData?.career_stage}</p>
                <p className="text-slate-500 text-sm mt-1">Current career stage in your Digital Twin</p>
                <p className="text-slate-400 text-sm mt-3 leading-relaxed">{displayData?.context_summary}</p>
              </div>
            )}
          </motion.div>

          {/* Interests */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <h2 className="text-white font-semibold mb-4">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {(displayData?.interests || []).map((interest: string) => (
                <span key={interest} className="px-3 py-1 rounded-full text-sm"
                  style={{ background: 'rgba(16,185,129,0.08)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
                  {interest}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card p-6">
            <h2 className="text-white font-semibold mb-4">Achievements</h2>
            <div className="space-y-2">
              {(displayData?.achievements?.length ? displayData.achievements : ['Digital Twin created', 'First goal submitted', 'AI Boardroom explored']).map((ach: string, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-amber-400">🏆</span>
                  <span className="text-slate-300 text-sm">{ach}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Save button */}
        {editMode && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex gap-3">
            <button onClick={() => updateMutation.mutate()} className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4" /> Save Changes
            </button>
            <button onClick={() => setEditMode(false)} className="btn-secondary px-6 py-3 rounded-xl">Cancel</button>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
