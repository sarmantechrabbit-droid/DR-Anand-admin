import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

import { API_URLS } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const LOGIN_API_URL = API_URLS.LOGIN;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore login session on refresh
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const value = email.trim();
    const pass = password.trim();

    if (!value || !pass) {
      return { success: false, error: 'Email and password are required.' };
    }

    // Send a single payload so backend validation errors aren't overwritten by fallback attempts.
    const payload = {
      email: value,
      password: pass,
      username: value,
      adminEmail: value,
    };

    try {
      const { data } = await axios.post(LOGIN_API_URL, payload);

      const explicitlyFailed =
        data?.success === false ||
        data?.status === false ||
        data?.status === 'fail' ||
        data?.ok === false;
      if (explicitlyFailed) {
        throw new Error(data?.message || data?.error || 'Invalid credentials');
      }

      const token =
        data?.token ||
        data?.accessToken ||
        data?.data?.token ||
        data?.data?.accessToken ||
        '';

      const sourceUser =
        data?.admin ||
        data?.user ||
        data?.data?.admin ||
        data?.data?.user ||
        {};

      const userData = {
        id: sourceUser.id || sourceUser._id || 1,
        name: sourceUser.name || sourceUser.fullName || 'Admin',
        email: sourceUser.email || value,
        role: sourceUser.role || 'admin',
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      if (token) {
        localStorage.setItem('authToken', token);
      } else {
        localStorage.removeItem('authToken');
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Invalid credentials',
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
