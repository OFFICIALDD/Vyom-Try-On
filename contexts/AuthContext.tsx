import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { db } from '../services/dbService';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => boolean;
  register: (user: User) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('vyom_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, pass: string) => {
    const foundUser = db.findUser(email);
    if (foundUser && foundUser.password === pass) {
      setUser(foundUser);
      localStorage.setItem('vyom_current_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = (newUser: User) => {
    const exists = db.findUser(newUser.email);
    if (exists) return false;
    db.addUser(newUser);
    // Auto login after register
    setUser(newUser);
    localStorage.setItem('vyom_current_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vyom_current_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
