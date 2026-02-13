import React, { useState } from 'react';
import { Edit, Trash2, Eye, UserPlus, Mail, Phone, Calendar, User } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import SearchInput from '../components/ui/SearchInput';
import { motion } from 'framer-motion';

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      age: 45,
      gender: 'Male',
      contact: '+91 98765 43210',
      lastVisit: '2024-02-10',
      status: 'Active',
      condition: 'Gastritis',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      age: 32,
      gender: 'Female',
      contact: '+91 98765 43211',
      lastVisit: '2024-02-08',
      status: 'Recovering',
      condition: 'Post-operative',
    },
    {
      id: 3,
      name: 'Amit Patel',
      age: 58,
      gender: 'Male',
      contact: '+91 98765 43212',
      lastVisit: '2024-02-12',
      status: 'Critical',
      condition: 'Liver Disease',
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      age: 28,
      gender: 'Female',
      contact: '+91 98765 43213',
      lastVisit: '2024-02-11',
      status: 'Active',
      condition: 'Regular Checkup',
    },
    {
      id: 5,
      name: 'Vikram Singh',
      age: 51,
      gender: 'Male',
      contact: '+91 98765 43214',
      lastVisit: '2024-02-09',
      status: 'Recovering',
      condition: 'Appendectomy',
    },
    {
      id: 6,
      name: 'Kavita Desai',
      age: 39,
      gender: 'Female',
      contact: '+91 98765 43215',
      lastVisit: '2024-02-07',
      status: 'Active',
      condition: 'IBS Treatment',
    },
    {
      id: 7,
      name: 'Arjun Mehta',
      age: 62,
      gender: 'Male',
      contact: '+91 98765 43216',
      lastVisit: '2024-02-05',
      status: 'Critical',
      condition: 'Pancreatitis',
    },
    {
      id: 8,
      name: 'Neha Gupta',
      age: 35,
      gender: 'Female',
      contact: '+91 98765 43217',
      lastVisit: '2024-02-13',
      status: 'Active',
      condition: 'Consultation',
    },
  ]);

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setPatients(patients.filter(p => p.id !== patientToDelete.id));
    setShowDeleteModal(false);
    setPatientToDelete(null);
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
          <p className="text-gray-600 mt-1">Manage your patient records</p>
        </div>
        <Button icon={UserPlus} onClick={() => navigate('/patients/add')}>Add New Patient</Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1">
          <SearchInput
            placeholder="Search by name or condition..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>All Status</option>
            <option>Active</option>
            <option>Critical</option>
            <option>Recovering</option>
          </select>
        </div>
      </motion.div>

      <Card delay={0.2}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-100">
                <th className="pb-4 text-sm font-semibold text-gray-600">Patient Name</th>
                <th className="pb-4 text-sm font-semibold text-gray-600">Age/Gender</th>
                <th className="pb-4 text-sm font-semibold text-gray-600">Contact</th>
                <th className="pb-4 text-sm font-semibold text-gray-600">Condition</th>
                <th className="pb-4 text-sm font-semibold text-gray-600">Last Visit</th>
                <th className="pb-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="pb-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient, index) => (
                <motion.tr
                  key={patient.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 font-medium text-sm">
                          {patient.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-gray-800">{patient.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-600">
                    {patient.age} / {patient.gender}
                  </td>
                  <td className="py-4 text-sm text-gray-600">{patient.contact}</td>
                  <td className="py-4 text-sm text-gray-600">{patient.condition}</td>
                  <td className="py-4 text-sm text-gray-600">{patient.lastVisit}</td>
                  <td className="py-4">
                    <Badge status={patient.status} />
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewPatient(patient)}
                        className="p-2 hover:bg-primary-50 rounded-lg transition-colors group"
                      >
                        <Eye className="w-4 h-4 text-gray-400 group-hover:text-primary-500" />
                      </button>
                      <button
                        onClick={() => handleViewPatient(patient)}
                        className="p-2 hover:bg-primary-50 rounded-lg transition-colors group"
                      >
                        <Edit className="w-4 h-4 text-gray-400 group-hover:text-primary-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(patient)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{filteredPatients.length}</span> of{' '}
            <span className="font-medium">{patients.length}</span> patients
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* View Patient Modal */}
      {showViewModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Patient Details</h2>
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
                  <h3 className="text-xl font-semibold text-gray-800">{selectedPatient.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedPatient.condition}</p>
                </div>
                <Badge status={selectedPatient.status}>{selectedPatient.status}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Age / Gender</p>
                    <p className="text-sm font-medium text-gray-800">{selectedPatient.age} / {selectedPatient.gender}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Contact</p>
                    <p className="text-sm font-medium text-gray-800">{selectedPatient.contact}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Last Visit</p>
                    <p className="text-sm font-medium text-gray-800">{selectedPatient.lastVisit}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="text-sm font-medium text-gray-800">{selectedPatient.status}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical Condition</label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{selectedPatient.condition}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="primary" className="flex-1">
                  Edit Patient
                </Button>
                <Button variant="outline" onClick={() => setShowViewModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && patientToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Delete Patient</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete <strong>{patientToDelete.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowDeleteModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteConfirm} className="flex-1">
                  Delete
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Patients;
