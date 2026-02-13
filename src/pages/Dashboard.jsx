import React from 'react';
import { Users, Calendar, Activity, DollarSign, Clock, Plus, Eye } from 'lucide-react';
import StatsCard from '../components/ui/StatsCard';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Patients',
      value: '2,547',
      icon: Users,
      trend: 'up',
      trendValue: '12%',
    },
    {
      title: 'Appointments Today',
      value: '18',
      icon: Calendar,
      trend: 'up',
      trendValue: '8%',
    },
    {
      title: 'Surgeries Completed',
      value: '342',
      icon: Activity,
      trend: 'up',
      trendValue: '5%',
    },
    {
      title: 'Revenue',
      value: '₹12.5L',
      icon: DollarSign,
      trend: 'up',
      trendValue: '18%',
    },
  ];

  const recentAppointments = [
    {
      id: 1,
      patient: 'Rajesh Kumar',
      time: '09:00 AM',
      type: 'Consultation',
      status: 'Confirmed',
    },
    {
      id: 2,
      patient: 'Priya Sharma',
      time: '10:30 AM',
      type: 'Follow-up',
      status: 'Confirmed',
    },
    {
      id: 3,
      patient: 'Amit Patel',
      time: '11:00 AM',
      type: 'Surgery',
      status: 'Pending',
    },
    {
      id: 4,
      patient: 'Sneha Reddy',
      time: '02:00 PM',
      type: 'Consultation',
      status: 'Confirmed',
    },
    {
      id: 5,
      patient: 'Vikram Singh',
      time: '03:30 PM',
      type: 'Follow-up',
      status: 'Pending',
    },
  ];

  const quickActions = [
    { icon: Plus, label: 'New Appointment', color: 'bg-primary-500' },
    { icon: Users, label: 'Add Patient', color: 'bg-green-600' },
    { icon: Activity, label: 'Schedule Surgery', color: 'bg-purple-600' },
    { icon: Eye, label: 'View Reports', color: 'bg-orange-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} delay={index * 0.1} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <Card title="Recent Appointments" className="lg:col-span-2" delay={0.4}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="pb-3 text-sm font-semibold text-gray-600">Patient</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Time</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Type</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Status</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-700 font-medium text-sm">
                            {appointment.patient.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-gray-800">{appointment.patient}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{appointment.time}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-600">{appointment.type}</td>
                    <td className="py-4">
                      <Badge status={appointment.status} />
                    </td>
                    <td className="py-4">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions" delay={0.5}>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
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
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Today's Schedule</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Morning Rounds</p>
                  <p className="text-xs text-gray-500">8:00 AM - 9:00 AM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Surgery</p>
                  <p className="text-xs text-gray-500">11:00 AM - 2:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Consultations</p>
                  <p className="text-xs text-gray-500">3:00 PM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
