import React, { useState } from 'react';
import { Calendar, Clock, User, Plus, Filter, Mail, Phone } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState('2024-02-13');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patient: 'Rajesh Kumar',
      date: '2024-02-13',
      time: '09:00 AM',
      type: 'Consultation',
      status: 'Confirmed',
      duration: '30 min',
    },
    {
      id: 2,
      patient: 'Priya Sharma',
      date: '2024-02-13',
      time: '10:30 AM',
      type: 'Follow-up',
      status: 'Confirmed',
      duration: '20 min',
    },
    {
      id: 3,
      patient: 'Amit Patel',
      date: '2024-02-13',
      time: '11:00 AM',
      type: 'Surgery',
      status: 'Pending',
      duration: '180 min',
    },
    {
      id: 4,
      patient: 'Sneha Reddy',
      date: '2024-02-13',
      time: '02:00 PM',
      type: 'Consultation',
      status: 'Confirmed',
      duration: '30 min',
    },
    {
      id: 5,
      patient: 'Vikram Singh',
      date: '2024-02-13',
      time: '03:30 PM',
      type: 'Follow-up',
      status: 'Pending',
      duration: '20 min',
    },
    {
      id: 6,
      patient: 'Kavita Desai',
      date: '2024-02-13',
      time: '04:00 PM',
      type: 'Consultation',
      status: 'Cancelled',
      duration: '30 min',
    },
    {
      id: 7,
      patient: 'Arjun Mehta',
      date: '2024-02-14',
      time: '09:30 AM',
      type: 'Surgery',
      status: 'Confirmed',
      duration: '240 min',
    },
    {
      id: 8,
      patient: 'Neha Gupta',
      date: '2024-02-14',
      time: '02:30 PM',
      type: 'Consultation',
      status: 'Pending',
      duration: '30 min',
    },
  ]);

  const handleDelete = (id) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const statusMatch = filterStatus === 'All' || appointment.status === filterStatus;
    return statusMatch;
  });

  const stats = [
    { label: 'Total Appointments', value: appointments.length, color: 'bg-primary-500' },
    {
      label: 'Confirmed',
      value: appointments.filter((a) => a.status === 'Confirmed').length,
      color: 'bg-green-600',
    },
    {
      label: 'Pending',
      value: appointments.filter((a) => a.status === 'Pending').length,
      color: 'bg-yellow-600',
    },
    {
      label: 'Cancelled',
      value: appointments.filter((a) => a.status === 'Cancelled').length,
      color: 'bg-red-600',
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
          <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage your appointment schedule</p>
        </div>
        <Button icon={Plus} onClick={() => navigate('/appointments/add')}>New Appointment</Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option>All</option>
            <option>Confirmed</option>
            <option>Pending</option>
            <option>Cancelled</option>
          </select>
        </div>
      </motion.div>

      {/* Appointments List */}
      <Card delay={0.5}>
        <div className="space-y-4">
          {filteredAppointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{appointment.patient}</h4>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.time}</span>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {appointment.type}
                    </span>
                    <span className="text-xs text-gray-500">{appointment.duration}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4 sm:mt-0">
                <Badge status={appointment.status} />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setShowViewModal(true);
                  }}
                >
                  Details
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No appointments found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or create a new appointment</p>
            <Button icon={Plus}>Schedule Appointment</Button>
          </div>
        )}
      </Card>

      {/* View Appointment Modal */}
      {showViewModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Appointment Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{selectedAppointment.patient}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedAppointment.type}</p>
                </div>
                <Badge status={selectedAppointment.status}>{selectedAppointment.status}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-sm font-medium text-gray-800">{selectedAppointment.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="text-sm font-medium text-gray-800">{selectedAppointment.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="text-sm font-medium text-gray-800">{selectedAppointment.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-medium text-gray-800">{selectedAppointment.duration}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="primary" className="flex-1">
                  Confirm Appointment
                </Button>
                <Button variant="outline" onClick={() => setShowViewModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
