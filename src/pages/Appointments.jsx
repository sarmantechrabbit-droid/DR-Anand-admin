import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, User, Trash2 } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DeleteConfirmation from '../components/ui/DeleteConfirmation';
import { motion } from 'framer-motion';
import { API_URLS } from '../config/api';

const API_URL = API_URLS.APPOINTMENTS;

const Appointments = () => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const normalizeAppointment = (item) => {
    const firstName = item.firstName || item.first_name || item.patientFirstName || '';
    const lastName = item.lastName || item.last_name || item.patientLastName || '';
    const fullName = `${firstName} ${lastName}`.trim();

    return {
      id: item.id || item._id,
      firstName: firstName || '-',
      lastName: lastName || '-',
      mobileNumber: item.mobileNumber || item.mobile || item.phone || '-',
      typesOfTreatment:
        item.typesOfTreatment ||
        item.typeOfTreatment || 
        item.treatmentType ||
        item.appointmentType ||
        '-',
      city: item.city || '-',
      patient: fullName || item.patientName || item.fullName || item.name || 'Unknown',
    };
  };

  const extractAppointmentsList = (payload) => {
    if (Array.isArray(payload)) return { list: payload, hasArray: true };
    if (Array.isArray(payload?.appointments)) return { list: payload.appointments, hasArray: true };
    if (Array.isArray(payload?.appointment)) return { list: payload.appointment, hasArray: true };
    if (Array.isArray(payload?.items)) return { list: payload.items, hasArray: true };
    if (Array.isArray(payload?.results)) return { list: payload.results, hasArray: true };
    if (Array.isArray(payload?.docs)) return { list: payload.docs, hasArray: true };
    if (Array.isArray(payload?.data)) return { list: payload.data, hasArray: true };
    if (Array.isArray(payload?.data?.appointments)) return { list: payload.data.appointments, hasArray: true };
    if (Array.isArray(payload?.data?.items)) return { list: payload.data.items, hasArray: true };
    if (Array.isArray(payload?.data?.results)) return { list: payload.data.results, hasArray: true };
    if (Array.isArray(payload?.data?.docs)) return { list: payload.data.docs, hasArray: true };
    return { list: [], hasArray: false };
  };

  const fetchAppointments = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const { data } = await axios.get(API_URL);
      const { list, hasArray } = extractAppointmentsList(data);
      setAppointments(list.map(normalizeAppointment));
      if (!hasArray) {
        setErrorMessage('API connected, but no appointment array found in response.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || 'Unable to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDeleteClick = (appointment) => {
    setAppointmentToDelete(appointment);
    setShowDeletePopup(true);
  };

  const handleDeleteConfirm = async () => {
    if (!appointmentToDelete?.id) return;
    setErrorMessage('');
    try {
      await axios.delete(`${API_URL}/${appointmentToDelete.id}`);
      setAppointments((prev) => prev.filter((item) => item.id !== appointmentToDelete.id));
      if (selectedAppointment?.id === appointmentToDelete.id) {
        setShowViewModal(false);
        setSelectedAppointment(null);
      }
      setShowDeletePopup(false);
      setAppointmentToDelete(null);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || 'Unable to delete appointment');
    }
  };

  const filteredAppointments = appointments;

  const uniquePatients = new Set(
    appointments.map((a) => `${a.firstName} ${a.lastName}`.trim().toLowerCase())
  ).size;
  const uniqueTreatments = new Set(
    appointments.map((a) => (a.typesOfTreatment || '').toLowerCase()).filter(Boolean)
  ).size;
  const uniqueCities = new Set(
    appointments.map((a) => (a.city || '').toLowerCase()).filter(Boolean)
  ).size;

  const stats = [
    { label: 'Total Appointments', value: appointments.length, color: 'bg-primary-500' },
    { label: 'Total Patients', value: uniquePatients, color: 'bg-green-600' },
    { label: 'Treatments', value: uniqueTreatments, color: 'bg-yellow-600' },
    { label: 'Cities', value: uniqueCities, color: 'bg-blue-600' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage your appointment schedule</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <Card delay={0.5}>
        {errorMessage && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
            {errorMessage}
          </div>
        )}
        {isLoading && (
          <div className="mb-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700 border border-blue-200">
            Loading appointments...
          </div>
        )}

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
                <div className="min-w-0">
                  <h4 className="font-semibold text-gray-800 break-words [overflow-wrap:anywhere]">{appointment.patient}</h4>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs break-words [overflow-wrap:anywhere]">{appointment.typesOfTreatment}</span>
                    <span className="text-xs break-words [overflow-wrap:anywhere]">Mobile: {appointment.mobileNumber}</span>
                    <span className="text-xs break-words [overflow-wrap:anywhere]">City: {appointment.city}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4 sm:mt-0">
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
                <Button
                  size="sm"
                  variant="danger"
                  icon={Trash2}
                  onClick={() => handleDeleteClick(appointment)}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {!isLoading && filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No appointments found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters</p>
          </div>
        )}
      </Card>

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
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold text-gray-800 break-words [overflow-wrap:anywhere]">{selectedAppointment.patient}</h3>
                  <p className="text-sm text-gray-600 mt-1 break-words [overflow-wrap:anywhere]">{selectedAppointment.typesOfTreatment}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">First Name</p>
                  <p className="text-sm font-medium text-gray-800 break-words [overflow-wrap:anywhere]">{selectedAppointment.firstName}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Last Name</p>
                  <p className="text-sm font-medium text-gray-800 break-words [overflow-wrap:anywhere]">{selectedAppointment.lastName}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Mobile Number</p>
                  <p className="text-sm font-medium text-gray-800 break-words [overflow-wrap:anywhere]">{selectedAppointment.mobileNumber}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Types of Treatment</p>
                  <p className="text-sm font-medium text-gray-800 break-words [overflow-wrap:anywhere]">{selectedAppointment.typesOfTreatment}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                  <p className="text-xs text-gray-500">City</p>
                  <p className="text-sm font-medium text-gray-800 break-words [overflow-wrap:anywhere]">{selectedAppointment.city}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <DeleteConfirmation
        isOpen={showDeletePopup}
        onClose={() => {
          setShowDeletePopup(false);
          setAppointmentToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Appointment"
        message={`Are you sure you want to delete this appointment${appointmentToDelete?.patient ? ` for ${appointmentToDelete.patient}` : ''}? This action cannot be undone.`}
      />
    </div>
  );
};

export default Appointments;
