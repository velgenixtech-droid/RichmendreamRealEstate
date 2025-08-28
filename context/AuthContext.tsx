import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { User, UserRole } from '../types';
import { mockUsers } from '../data';

interface AuthContextType {
  user: User | null;
  login: (email: string) => boolean;
  logout: () => void;
  updateUser: (updatedInfo: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  });

  const login = (email: string): boolean => {
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updatedInfo: Partial<User>) => {
    if (user) {
        const newUser = { ...user, ...updatedInfo };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    }
  };

  const isAuthenticated = !!user;

  const value = useMemo(() => ({
    user,
    login,
    logout,
    updateUser,
    isAuthenticated
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};