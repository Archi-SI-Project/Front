import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUsers } from './API';

interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('auth', token);
    } else {
      localStorage.removeItem('auth');
    }
  }, [token]);

  const login = (username: string, password: string) => {
    const credentials = btoa(`${username}:${password}`);
    getUsers(credentials).then((response) => {
        if (response.status == 200) {
            console.log('Login successful');
            setToken(credentials);
            localStorage.setItem('auth', credentials);
        }
    }).catch((error) => {
        console.error('Error fetching users:', error);
        alert('Invalid credentials');
    });
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
