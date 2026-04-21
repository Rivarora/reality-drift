import React, { createContext, useContext, useState, useCallback } from 'react';
import { User } from '@/lib/types';
import { store } from '@/lib/store';
import { v4 } from '@/lib/utils-id';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(store.getUser());

  const login = useCallback((email: string, _password: string) => {
    const u: User = { id: v4(), email, role: 'admin' };
    store.setUser(u);
    setUser(u);
    return true;
  }, []);

  const register = useCallback((email: string, _password: string) => {
    const u: User = { id: v4(), email, role: 'user' };
    store.setUser(u);
    setUser(u);
    return true;
  }, []);

  const logout = useCallback(() => {
    store.setUser(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
