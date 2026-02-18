import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import { API_URLS } from '../config/api';

const PASSWORD_RULES = {
  minLength: 8,
  maxLength: 20,
};

const getPasswordValidationError = (password) => {
  if (password.length < PASSWORD_RULES.minLength) {
    return `New password must be at least ${PASSWORD_RULES.minLength} characters.`;
  }

  if (password.length > PASSWORD_RULES.maxLength) {
    return `New password must be at most ${PASSWORD_RULES.maxLength} characters.`;
  }

  if (/\s/.test(password)) {
    return 'New password must not contain spaces.';
  }

  if (!/[A-Z]/.test(password)) {
    return 'New password must include at least 1 uppercase letter (A-Z).';
  }

  if (!/[a-z]/.test(password)) {
    return 'New password must include at least 1 lowercase letter (a-z).';
  }

  if (!/[0-9]/.test(password)) {
    return 'New password must include at least 1 number (0-9).';
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return 'New password must include at least 1 special character (e.g., @ # $ % & * ! _).';
  }

  return '';
};

const ChangePassword = () => {
  const API_URL = API_URLS.CHANGE_PASSWORD;
  const savedUserRaw = localStorage.getItem('user');
  let savedUserEmail = '';
  try {
    savedUserEmail = savedUserRaw ? JSON.parse(savedUserRaw)?.email || '' : '';
  } catch {
    savedUserEmail = '';
  }

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: savedUserEmail,
    oldPassword: '',
    newPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const email = formData.email.trim();
    const oldPassword = formData.oldPassword.trim();
    const newPassword = formData.newPassword.trim();

    if (!email || !oldPassword || !newPassword) {
      setErrorMessage('All fields are required.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (oldPassword.length < 6) {
      setErrorMessage('Old password must be at least 6 characters.');
      return;
    }

    const passwordValidationError = getPasswordValidationError(newPassword);
    if (passwordValidationError) {
      setErrorMessage(passwordValidationError);
      return;
    }

    if (newPassword === oldPassword) {
      setErrorMessage('New password must be different from old password.');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      setErrorMessage('Session expired. Please login again.');
      navigate('/login');
      return;
    }

    setIsSaving(true);
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const payload = {
        email,
        oldPassword,
        newPassword,
      };

      const response = await axios.post(API_URL, payload, { headers });
      const responseData = response.data;

      const explicitlyFailed =
        responseData?.success === false ||
        responseData?.status === false ||
        responseData?.status === 'fail' ||
        responseData?.ok === false;

      if (explicitlyFailed) {
        throw new Error(responseData?.message || responseData?.error || 'Unable to change password.');
      }

      setSuccessMessage('Password changed successfully.');
      setFormData({
        email,
        oldPassword: '',
        newPassword: '',
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Unable to change password.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Change Password</h1>
          <p className="text-gray-600 mt-1">Update your account password</p>
        </div>
      </motion.div>

      <Card delay={0.1}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 border border-green-200">
              {successMessage}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="text"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Old Password</label>
            <div className="relative">
              <input
                type={showOldPassword ? 'text' : 'password'}
                value={formData.oldPassword}
                onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                className="w-full px-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowOldPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showOldPassword ? 'Hide old password' : 'Show old password'}
              >
                {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full px-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Use 8-20 characters with at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special
              character, and no spaces.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" icon={Save} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Password'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ChangePassword;
