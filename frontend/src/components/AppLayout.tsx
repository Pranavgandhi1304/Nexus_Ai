'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Target, BrainCircuit, BarChart3, Radar,
  Hammer, User, History, Settings, LogOut, Zap, Menu, X, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'New Goal', href: '/goal', icon: Target },
  { label: 'AI Workspace', href: '/workspace', icon: BrainCircuit },
  { label: 'Simulator', href: '/simulator', icon: BarChart3 },
  { label: 'Opp. Radar', href: '/radar', icon: Radar },
  { label: 'Project Builder', href: '/project-builder', icon: Hammer },
  { label: 'Profile', href: '/profile', icon: User },
  { label: 'History', href: '/history', icon: History },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const Sidebar = () => (
    <div
      className="flex flex-col h-full py-6 px-4"
      style={{
        background: 'rgba(10,15,30,0.95)',
        borderRight: '1px solid rgba(26,35,64,0.8)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-3 mb-8 px-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))',
            border: '1px solid rgba(0,212,255,0.3)',
          }}
        >
          ✦
        </div>
        <div>
          <span className="text-white font-bold text-sm">Nexus AI</span>
          <p className="text-slate-600 text-xs">Personal OS</p>
        </div>
      </Link>

      {/* Status pill */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg mb-6"
        style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
      >
        <div className="w-2 h-2 rounded-full status-dot-active" />
        <span className="text-xs text-emerald-400">5 Agents Online</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
              style={{
                background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                color: isActive ? '#00d4ff' : '#64748b',
                border: isActive ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent',
              }}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
              {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(26,35,64,0.6)' }}>
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)', color: 'white' }}
          >
            {(user?.name?.[0] || 'A').toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.name || 'Alex Chen'}</p>
            <p className="text-slate-600 text-xs truncate">{user?.email || 'demo@nexus.ai'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:text-red-400 transition-colors text-sm w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#020816' }}>
      {/* Desktop Sidebar */}
      <div className="w-60 flex-shrink-0 hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: 'rgba(2,8,22,0.8)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-60 z-50 md:hidden"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{
            borderBottom: '1px solid rgba(26,35,64,0.5)',
            background: 'rgba(10,15,30,0.5)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 text-sm">
              {NAV_ITEMS.find((n) => n.href === pathname)?.label || 'Nexus AI'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="px-3 py-1 rounded-full text-xs flex items-center gap-1.5"
              style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              AI Active
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto nexus-grid">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
