import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (name, email, phone, password) => {
    const { data } = await api.post('/api/signup', { name, email, phone, password });
    localStorage.setItem('yoga-token', data.token);
    localStorage.setItem('yoga-user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async (emailOrPhone, password) => {
    const { data } = await api.post('/api/login', {
      email: emailOrPhone.includes('@') ? emailOrPhone : undefined,
      phone: !emailOrPhone.includes('@') ? emailOrPhone : undefined,
      password,
    });
    localStorage.setItem('yoga-token', data.token);
    localStorage.setItem('yoga-user', JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('yoga-token');
    localStorage.removeItem('yoga-user');
    localStorage.removeItem('yoga-demo-user');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('yoga-token');
    const storedUser = localStorage.getItem('yoga-user') || localStorage.getItem('yoga-demo-user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('yoga-token');
        localStorage.removeItem('yoga-user');
        localStorage.removeItem('yoga-demo-user');
      }
    }
    setLoading(false);
  }, []);

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    isAuthConfigured: true,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
