'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('nexus_token');
    const savedUser = localStorage.getItem('nexus_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleAuthResponse = (data: { access_token: string; user: User }) => {
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('nexus_token', data.access_token);
    localStorage.setItem('nexus_user', JSON.stringify(data.user));
  };

  const login = async (email: string, password: string) => {
    const res = await authAPI.login(email, password);
    handleAuthResponse(res.data);
  };

  const register = async (email: string, name: string, password: string) => {
    const res = await authAPI.register(email, name, password);
    handleAuthResponse(res.data);
  };

  const demoLogin = async () => {
    const res = await authAPI.demoLogin();
    handleAuthResponse(res.data);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nexus_token');
    localStorage.removeItem('nexus_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, demoLogin, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
