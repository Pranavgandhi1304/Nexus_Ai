// ─── Nexus AI API Client ───────────────────────────────────────────────────────
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Auth
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('nexus_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (email: string, name: string, password: string) =>
    api.post('/api/auth/register', { email, name, password }),
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  demoLogin: () => api.post('/api/auth/demo-login'),
};

// ─── Goals ─────────────────────────────────────────────────────────────────────
export const goalsAPI = {
  submit: (userId: string, title: string, description: string, category?: string) =>
    api.post('/api/goals/', { user_id: userId, title, description, category }),
  getUserGoals: (userId: string) => api.get(`/api/goals/${userId}`),
  updateProgress: (goalId: string, progress: number) =>
    api.put(`/api/goals/${goalId}/progress?progress=${progress}`),
};

// ─── Digital Twin ──────────────────────────────────────────────────────────────
export const twinAPI = {
  get: (userId: string) => api.get(`/api/twin/${userId}`),
  update: (userId: string, data: { skills?: string[]; interests?: string[]; career_stage?: string }) =>
    api.put(`/api/twin/${userId}`, data),
  getScores: (userId: string) => api.get(`/api/twin/${userId}/scores`),
};

// ─── Simulation ────────────────────────────────────────────────────────────────
export const simulateAPI = {
  run: (userId: string, scenario: string, timeframe?: number, variables?: Record<string, unknown>) =>
    api.post('/api/simulate/', { user_id: userId, scenario, timeframe_months: timeframe, variables }),
  getHistory: (userId: string) => api.get(`/api/simulate/${userId}/history`),
};

// ─── Project Builder ───────────────────────────────────────────────────────────
export const projectAPI = {
  build: (userId: string, name: string, description: string) =>
    api.post('/api/project-builder/', { user_id: userId, name, description }),
  getProjects: (userId: string) => api.get(`/api/project-builder/${userId}`),
};

// ─── Radar ─────────────────────────────────────────────────────────────────────
export const radarAPI = {
  get: (userId?: string, category?: string) =>
    api.get('/api/radar/', { params: { user_id: userId, category } }),
  getCategories: () => api.get('/api/radar/categories'),
};

// ─── Boardroom ─────────────────────────────────────────────────────────────────
export const boardroomAPI = {
  getAgents: () => api.get('/api/boardroom/agents'),
  getLatest: (userId: string) => api.get(`/api/boardroom/latest/${userId}`),
};

// ─── History ───────────────────────────────────────────────────────────────────
export const historyAPI = {
  get: (userId: string) => api.get(`/api/history/${userId}`),
};
