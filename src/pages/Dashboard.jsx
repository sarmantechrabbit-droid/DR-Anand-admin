import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Calendar, Activity, MessageSquare, Plus, Eye, Loader2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URLS } from '../config/api';
import StatsCard from '../components/ui/StatsCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const iconMap = {
  'Appointments Today': Calendar,
  'Total Inquiries': MessageSquare,
  'Total Appointments': Activity,
};

const Dashboard = () => {
  const navigate = useNavigate();
  const formatDate = (value) => {
    if (!value) return '-';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '-';
    return parsed.toLocaleDateString('en-GB');
  };

  const [data, setData] = useState({
    stats: [],
    recentAppointments: [],
    todaySchedule: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URLS.DASHBOARD);
      if (response.data.success) {
        const statsWithIcons = response.data.data.stats.map(stat => ({
          ...stat,
          icon: iconMap[stat.title] || Activity
        }));
        setData({
          stats: statsWithIcons,
          recentAppointments: response.data.data.recentAppointments,
          todaySchedule: response.data.data.todaySchedule
        });
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    // { icon: Plus, label: 'New Appointment', color: 'bg-primary-500', path: '/appointments/add' },
    // { icon: Users, label: 'View Patients', color: 'bg-green-600', path: '/patients' },
    { icon: Activity, label: 'All Appointments', color: 'bg-purple-600', path: '/appointments' },
    { icon: Eye, label: 'View Inquiries', color: 'bg-orange-600', path: '/inquiries' },
  ];

  if (loading && data.stats.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (error && data.stats.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 font-medium">{error}</p>
        <Button onClick={fetchDashboardData} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {data.stats.map((stat, index) => (
          <StatsCard key={index} {...stat} delay={index * 0.1} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <Card title="Recent Appointments" className="lg:col-span-2" delay={0.4}>
          <div className="overflow-x-auto">
            {data.recentAppointments.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    <th className="pb-3 text-sm font-semibold text-gray-600">Patient</th>
                    <th className="pb-3 text-sm font-semibold text-gray-600">Date</th>
                    <th className="pb-3 text-sm font-semibold text-gray-600">Type</th>
                    <th className="pb-3 text-sm font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentAppointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-700 font-medium text-sm">
                              {(appointment.patient || 'U').charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-gray-800">{appointment.patient}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-gray-600">{formatDate(appointment.date)}</span>
                      </td>
                      <td className="py-4 text-sm text-gray-600">{appointment.type}</td>
                      <td className="py-4">
                        <Button size="sm" variant="outline" onClick={() => navigate('/appointments')}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center py-6 text-gray-500">No appointments found</p>
            )}
          </div>
        </Card>

        {/* Quick Actions + Today's Schedule */}
        <Card title="Quick Actions" delay={0.5}>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="w-full flex items-center gap-3 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 group"
              >
                <div className={`${action.color} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <span className="font-medium text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Today's Schedule */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Today's Appointments</h4>
            <div className="space-y-3">
              {data.todaySchedule.length > 0 ? (
                data.todaySchedule.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      item.status === 'Confirmed' ? 'bg-green-500' :
                      item.status === 'Completed' ? 'bg-blue-500' :
                      item.status === 'Cancelled' ? 'bg-red-500' :
                      'bg-primary-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                    {item.status && (
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                        item.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                        item.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                        item.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic">No appointments for today</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

