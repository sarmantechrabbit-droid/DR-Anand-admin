import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Stethoscope, AlertCircle, Eye, EyeOff, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isTokenExpired } from '../utils/jwt';
import { API_URLS } from '../config/api';

const Login = () => {
  const CHANGE_PASSWORD_API_URL = API_URLS.CHANGE_PASSWORD;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPopup, setShowForgotPopup] = useState(false);
  const [forgotForm, setForgotForm] = useState({
    email: '',
    oldPassword: '',
    newPassword: '',
  });
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showForgotOldPassword, setShowForgotOldPassword] = useState(false);
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (user && token && !isTokenExpired(token)) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const openForgotPopup = () => {
    setForgotError('');
    setForgotSuccess('');
    setForgotForm({
      email,
      oldPassword: '',
      newPassword: '',
    });
    setShowForgotPopup(true);
  };

  const closeForgotPopup = () => {
    setShowForgotPopup(false);
    setForgotError('');
    setForgotSuccess('');
    setForgotLoading(false);
    setShowForgotOldPassword(false);
    setShowForgotNewPassword(false);
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    const emailValue = forgotForm.email.trim();
    const oldPassword = forgotForm.oldPassword.trim();
    const newPassword = forgotForm.newPassword.trim();

    if (!emailValue || !oldPassword || !newPassword) {
      setForgotError('All fields are required.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailValue)) {
      setForgotError('Please enter a valid email address.');
      return;
    }

    if (newPassword === oldPassword) {
      setForgotError('New password must be different from old password.');
      return;
    }

    setForgotLoading(true);
    try {
      const response = await axios.post(CHANGE_PASSWORD_API_URL, {
        email: emailValue,
        oldPassword,
        newPassword,
      });

      const failed =
        response?.data?.success === false ||
        response?.data?.status === false ||
        response?.data?.ok === false;
      if (failed) {
        throw new Error(response?.data?.message || 'Unable to change password.');
      }

      setForgotSuccess(response?.data?.message || 'Password changed successfully.');
      setForgotForm((prev) => ({
        ...prev,
        oldPassword: '',
        newPassword: '',
      }));
    } catch (err) {
      setForgotError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          'Unable to change password.'
      );
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-4">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-primary-500 p-4 rounded-2xl mb-4">
              <Stethoscope className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Dr. Anand</h1>
            <p className="text-gray-600 text-sm">Admin Dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Enter email or username"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
{/* 
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={openForgotPopup}
              className="text-sm text-primary-500 hover:text-primary-600"
            >
              Forgot password?
            </button>
          </div> */}
        </div>

        {/* Demo Credentials */}
          {/* <div className="bg-white/80 backdrop-blur rounded-lg p-4 text-center text-sm text-gray-600">
            <p className="font-medium mb-1">Demo Credentials:</p>
            <p>Email: admin@hospital.com</p>
            <p>Password: admin123</p>
          </div> */}
      </motion.div>

      <AnimatePresence>
        {showForgotPopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={closeForgotPopup}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
                  <button
                    type="button"
                    onClick={closeForgotPopup}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={forgotForm.email}
                      onChange={(e) => setForgotForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Old Password</label>
                    <div className="relative">
                      <input
                        type={showForgotOldPassword ? 'text' : 'password'}
                        value={forgotForm.oldPassword}
                        onChange={(e) =>
                          setForgotForm((prev) => ({ ...prev, oldPassword: e.target.value }))
                        }
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotOldPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showForgotOldPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showForgotNewPassword ? 'text' : 'password'}
                        value={forgotForm.newPassword}
                        onChange={(e) =>
                          setForgotForm((prev) => ({ ...prev, newPassword: e.target.value }))
                        }
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowForgotNewPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showForgotNewPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {forgotError && (
                    <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
                      {forgotError}
                    </div>
                  )}
                  {forgotSuccess && (
                    <div className="rounded-lg bg-green-50 border border-green-200 text-green-700 px-3 py-2 text-sm">
                      {forgotSuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium hover:bg-primary-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {forgotLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
