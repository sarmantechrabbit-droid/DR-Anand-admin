import React from 'react';
import { TrendingUp, Users, DollarSign, Activity, Download, Calendar } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';

const Reports = () => {
  const analyticsCards = [
    {
      title: 'Patient Growth',
      value: '+24%',
      description: 'Compared to last month',
      icon: TrendingUp,
      color: 'bg-green-500',
      trend: 'up',
    },
    {
      title: 'Total Revenue',
      value: '₹45.2L',
      description: 'This month',
      icon: DollarSign,
      color: 'bg-primary-500',
      trend: 'up',
    },
    {
      title: 'Active Patients',
      value: '2,547',
      description: 'Currently under treatment',
      icon: Users,
      color: 'bg-purple-500',
      trend: 'up',
    },
    {
      title: 'Surgeries',
      value: '342',
      description: 'Completed this year',
      icon: Activity,
      color: 'bg-orange-500',
      trend: 'up',
    },
  ];

  const monthlyData = [
    { month: 'Jan', patients: 180, revenue: 32 },
    { month: 'Feb', patients: 220, revenue: 38 },
    { month: 'Mar', patients: 195, revenue: 35 },
    { month: 'Apr', patients: 240, revenue: 42 },
    { month: 'May', patients: 280, revenue: 48 },
    { month: 'Jun', patients: 260, revenue: 45 },
  ];

  const recentReports = [
    {
      id: 1,
      title: 'Monthly Patient Summary',
      date: '2024-02-01',
      type: 'PDF',
      size: '2.4 MB',
    },
    {
      id: 2,
      title: 'Revenue Analysis Q1 2024',
      date: '2024-01-31',
      type: 'Excel',
      size: '1.8 MB',
    },
    {
      id: 3,
      title: 'Surgery Statistics',
      date: '2024-01-28',
      type: 'PDF',
      size: '3.1 MB',
    },
    {
      id: 4,
      title: 'Patient Satisfaction Survey',
      date: '2024-01-25',
      type: 'PDF',
      size: '1.2 MB',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">View detailed analytics and generate reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={Calendar}>
            Date Range
          </Button>
          <Button icon={Download}>Export Report</Button>
        </div>
      </motion.div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${card.color} p-3 rounded-xl`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-600 text-sm font-medium">↑ {card.trend === 'up' && '12%'}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
            <p className="text-sm text-gray-600">{card.title}</p>
            <p className="text-xs text-gray-500 mt-2">{card.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Growth Chart */}
        <Card title="Patient Growth" delay={0.4}>
          <div className="h-64 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg flex items-end justify-around p-4 gap-2">
            {monthlyData.map((data, index) => (
              <motion.div
                key={data.month}
                initial={{ height: 0 }}
                animate={{ height: `${(data.patients / 300) * 100}%` }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                className="flex-1 bg-primary-500 rounded-t-lg relative group cursor-pointer hover:bg-primary-600 transition-colors"
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded">
                  {data.patients}
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">
                  {data.month}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Revenue Chart */}
        <Card title="Revenue Trend" delay={0.5}>
          <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-end justify-around p-4 gap-2">
            {monthlyData.map((data, index) => (
              <motion.div
                key={data.month}
                initial={{ height: 0 }}
                animate={{ height: `${(data.revenue / 50) * 100}%` }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                className="flex-1 bg-green-600 rounded-t-lg relative group cursor-pointer hover:bg-green-700 transition-colors"
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded">
                  ₹{data.revenue}L
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">
                  {data.month}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card title="Recent Reports" delay={0.6}>
        <div className="space-y-3">
          {recentReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-primary-200 hover:bg-primary-50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Download className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{report.title}</h4>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                    <span>{report.date}</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{report.type}</span>
                    <span>•</span>
                    <span>{report.size}</span>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline" icon={Download}>
                Download
              </Button>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card delay={0.8}>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">85%</h3>
            <p className="text-sm text-gray-600">Patient Satisfaction</p>
          </div>
        </Card>

        <Card delay={0.9}>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">98%</h3>
            <p className="text-sm text-gray-600">Surgery Success Rate</p>
          </div>
        </Card>

        <Card delay={1.0}>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">4.8</h3>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
