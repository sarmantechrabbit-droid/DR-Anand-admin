import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

import { API_URLS } from '../config/api';
import { setupAxiosInterceptors } from '../config/axiosInterceptor';
import { isTokenExpired } from '../utils/jwt';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const LOGIN_API_URL = API_URLS.LOGIN;
  const VERIFY_TOKEN_URL = API_URLS.VERIFY_TOKEN;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuthStorage = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  }, []);

  const clearAuthState = useCallback(() => {
    setUser(null);
    clearAuthStorage();
  }, [clearAuthStorage]);

  const logout = useCallback(
    ({ navigate, replace = true } = {}) => {
      clearAuthState();
      window.history.replaceState(null, '', '/login');
      if (navigate) {
        navigate('/login', { replace });
      } else if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    },
    [clearAuthState]
  );

  const verifyTokenWithBackend = useCallback(async (token) => {
    const verifyCandidates = [VERIFY_TOKEN_URL, `${API_URLS.DASHBOARD}`];

    for (const url of verifyCandidates) {
      try {
        await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return true;
      } catch (error) {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          return false;
        }
        if (status === 404) {
          continue;
        }
      }
    }

    return true;
  }, [VERIFY_TOKEN_URL]);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');

      if (!token || !savedUser) {
        clearAuthState();
        setLoading(false);
        return;
      }

      if (isTokenExpired(token)) {
        clearAuthState();
        setLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(savedUser);
        const isValidOnServer = await verifyTokenWithBackend(token);
        if (!isValidOnServer) {
          clearAuthState();
        } else {
          setUser(parsedUser);
        }
      } catch {
        clearAuthState();
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, [clearAuthState, verifyTokenWithBackend]);

  useEffect(() => {
    return setupAxiosInterceptors({
      onUnauthorized: () => {
        clearAuthState();
        if (window.location.pathname !== '/login') {
          window.location.replace('/login');
        }
      },
    });
  }, [clearAuthState]);

  const login = useCallback(async (email, password) => {
    const value = email.trim();
    const pass = password.trim();

    if (!value || !pass) {
      return { success: false, error: 'Email and password are required.' };
    }

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

      if (!token || isTokenExpired(token)) {
        clearAuthState();
        return { success: false, error: 'Received invalid or expired token.' };
      }

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
      localStorage.setItem('authToken', token);

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
  }, [LOGIN_API_URL, clearAuthState]);

  const value = useMemo(() => ({
    user,
    login,
    logout,
    loading,
    isAuthenticated: Boolean(user && localStorage.getItem('authToken')),
  }), [user, login, logout, loading]);

  return (
    <AuthContext.Provider value={value}>
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
