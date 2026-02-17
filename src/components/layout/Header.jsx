import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, User, LogOut, KeyRound, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Header = ({ toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.name || 'Admin';
  const displayEmail = user?.email || 'admin@hospital.com';
  const displayRole = user?.role || 'Admin';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const notifications = [
    { id: 1, text: 'New appointment scheduled for tomorrow', time: '5 min ago', unread: true },
    { id: 2, text: 'Patient report uploaded successfully', time: '1 hour ago', unread: true },
    { id: 3, text: 'Upcoming surgery reminder', time: '2 hours ago', unread: false },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 lg:px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Welcome back, Dr. Anand</h2>
            <p className="text-sm text-gray-500 hidden sm:block">Here's what's happening today</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                          notification.unread ? 'bg-primary-50' : ''
                        }`}
                      >
                        <p className="text-sm text-gray-800">{notification.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-gray-100">
                    <button className="text-sm text-primary-500 hover:text-primary-600 font-medium">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 sm:gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-800">{displayName}</p>
                <p className="text-xs text-gray-500">{displayRole}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100">
                    <p className="font-medium text-gray-800">{displayName}</p>
                    <p className="text-sm text-gray-500">{displayEmail}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => navigate('/change-password')}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span className="text-sm">Change Password</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
