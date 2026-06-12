'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Zap, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, demoLogin } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, name, password);
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Something went wrong. Try demo mode.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    try {
      await demoLogin();
      router.push('/dashboard');
    } catch {
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen nexus-grid flex items-center justify-center px-4" style={{ backgroundColor: '#020816' }}>
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, #00d4ff, transparent)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        {/* Back link */}
        <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors text-sm mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Card */}
        <div className="glass-card p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))', border: '1px solid rgba(0,212,255,0.3)' }}>
              ✦
            </div>
            <div>
              <p className="text-white font-bold">Nexus AI</p>
              <p className="text-slate-600 text-xs">Autonomous Personal OS</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-slate-400 text-sm mb-6">
            {mode === 'login' ? 'Sign in to your AI boardroom.' : 'Join Nexus AI and meet your expert advisors.'}
          </p>

          {/* Demo Login CTA */}
          <button onClick={handleDemo} disabled={loading}
            className="btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2 mb-6">
            <Zap className="w-4 h-4" /> Continue as Demo User (Instant Access)
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <p className="text-slate-600 text-xs">or sign in with email</p>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-slate-300 text-sm mb-1.5 block">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} required
                  placeholder="Alex Chen" className="nexus-input" />
              </div>
            )}
            <div>
              <label className="text-slate-300 text-sm mb-1.5 block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="you@example.com" className="nexus-input" />
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-1.5 block">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••" className="nexus-input pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg text-red-400 text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-secondary w-full py-3 rounded-xl">
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-cyan-400 hover:text-cyan-300 transition-colors">
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
