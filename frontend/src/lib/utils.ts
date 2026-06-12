import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    career: '#6366f1',
    learning: '#06b6d4',
    startup: '#f59e0b',
    research: '#10b981',
    hackathon: '#ec4899',
    general: '#94a3b8',
    productivity: '#ec4899',
  };
  return colors[category] || '#94a3b8';
}

export function getCategoryBadgeClass(category: string) {
  const classes: Record<string, string> = {
    career: 'badge-career',
    learning: 'badge-learning',
    startup: 'badge-startup',
    research: 'badge-research',
    hackathon: 'badge-hackathon',
    general: 'badge-general',
    productivity: 'badge-hackathon',
  };
  return classes[category] || 'badge-general';
}

export function getAgentColor(agentName: string) {
  const colors: Record<string, string> = {
    'Career Agent': '#6366f1',
    'Learning Agent': '#06b6d4',
    'Startup Agent': '#f59e0b',
    'Research Agent': '#10b981',
    'Productivity Agent': '#ec4899',
  };
  return colors[agentName] || '#94a3b8';
}

export function getAgentEmoji(agentName: string) {
  const emojis: Record<string, string> = {
    'Career Agent': '💼',
    'Learning Agent': '📚',
    'Startup Agent': '🚀',
    'Research Agent': '🔬',
    'Productivity Agent': '⚡',
  };
  return emojis[agentName] || '🤖';
}

export function truncate(str: string, length: number) {
  return str.length > length ? str.slice(0, length) + '...' : str;
}
