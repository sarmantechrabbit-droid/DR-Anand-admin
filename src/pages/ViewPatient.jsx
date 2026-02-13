import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { motion } from 'framer-motion';

const ViewPatient = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const patient = {
    id: 1,
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    contact: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    address: '123 Main Street, Mumbai, Maharashtra',
    lastVisit: '2024-02-10',
    status: 'Active',
    condition: 'Gastritis',
    bloodGroup: 'O+',
    allergies: 'None',
    medicalHistory: 'Previous gastric issues in 2020. Regular checkups since then.',
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <button
          onClick={() => navigate('/patients')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Patient Details</h1>
        </div>
        <Badge status={patient.status} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card delay={0.1} className="lg:col-span-2">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-700 font-bold text-2xl">{patient.name.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{patient.name}</h2>
              <p className="text-gray-600">{patient.age} years • {patient.gender}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 text-gray-700">
              <Phone className="w-5 h-5 text-primary-500" />
              <span>{patient.contact}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Mail className="w-5 h-5 text-primary-500" />
              <span>{patient.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 md:col-span-2">
              <MapPin className="w-5 h-5 text-primary-500" />
              <span>{patient.address}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-semibold text-gray-800 mb-4">Medical Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Blood Group</p>
                <p className="font-medium text-gray-800">{patient.bloodGroup}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Allergies</p>
                <p className="font-medium text-gray-800">{patient.allergies}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Current Condition</p>
                <p className="font-medium text-gray-800">{patient.condition}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Medical History</p>
                <p className="text-gray-700">{patient.medicalHistory}</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card delay={0.2}>
            <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button className="w-full">Schedule Appointment</Button>
              <Button variant="secondary" className="w-full">View Reports</Button>
              <Button variant="outline" className="w-full">Edit Patient</Button>
            </div>
          </Card>

          <Card delay={0.3}>
            <h3 className="font-semibold text-gray-800 mb-4">Last Visit</h3>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{patient.lastVisit}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewPatient;
