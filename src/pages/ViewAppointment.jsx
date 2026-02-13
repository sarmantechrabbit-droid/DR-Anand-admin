import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, FileText } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { motion } from 'framer-motion';

const ViewAppointment = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const appointment = {
    id: 1,
    patient: 'Rajesh Kumar',
    date: '2024-02-13',
    time: '09:00 AM',
    type: 'Consultation',
    status: 'Confirmed',
    duration: '30 min',
    contact: '+91 98765 43210',
    notes: 'Patient complaining of abdominal pain. Requires thorough examination.',
    reason: 'Regular checkup and consultation for gastric issues',
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <button
          onClick={() => navigate('/appointments')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Appointment Details</h1>
        </div>
        <Badge status={appointment.status} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card delay={0.1} className="lg:col-span-2">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{appointment.patient}</h2>
              <p className="text-gray-600">{appointment.contact}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar className="w-5 h-5 text-primary-500" />
                <span className="text-sm font-medium">Date</span>
              </div>
              <p className="text-lg font-semibold text-gray-800">{appointment.date}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Clock className="w-5 h-5 text-primary-500" />
                <span className="text-sm font-medium">Time</span>
              </div>
              <p className="text-lg font-semibold text-gray-800">{appointment.time}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Type</p>
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium">
                {appointment.type}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Duration</p>
              <p className="font-medium text-gray-800">{appointment.duration}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-semibold text-gray-800 mb-3">Reason for Visit</h3>
            <p className="text-gray-700 mb-6">{appointment.reason}</p>

            <h3 className="font-semibold text-gray-800 mb-3">Notes</h3>
            <p className="text-gray-700">{appointment.notes}</p>
          </div>
        </Card>

        <div className="space-y-6">
          <Card delay={0.2}>
            <h3 className="font-semibold text-gray-800 mb-4">Actions</h3>
            <div className="space-y-2">
              <Button className="w-full">Confirm Appointment</Button>
              <Button variant="secondary" className="w-full">Reschedule</Button>
              <Button variant="outline" className="w-full">Cancel</Button>
            </div>
          </Card>

          <Card delay={0.3}>
            <h3 className="font-semibold text-gray-800 mb-4">Patient History</h3>
            <Button variant="outline" className="w-full" icon={FileText}>
              View Records
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewAppointment;
