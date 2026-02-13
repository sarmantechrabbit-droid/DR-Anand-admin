import React, { useState } from 'react';
import { Mail, Phone, Calendar, Eye, Trash2, MessageSquare, Filter, Clock, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import SearchInput from '../components/ui/SearchInput';
import { motion } from 'framer-motion';

const Inquiries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState(null);

  const [inquiriesList, setInquiriesList] = useState([
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul.sharma@email.com',
      phone: '+91 98765 43210',
      subject: 'Appointment Query',
      message: 'I would like to book an appointment for a gastro consultation. What are your available slots for next week?',
      date: '2024-02-13',
      time: '10:30 AM',
      status: 'New',
    },
    {
      id: 2,
      name: 'Priya Patel',
      email: 'priya.p@email.com',
      phone: '+91 98765 43211',
      subject: 'Surgery Information',
      message: 'Could you please provide information about laparoscopic surgery procedures and recovery time?',
      date: '2024-02-13',
      time: '09:15 AM',
      status: 'In Progress',
    },
    {
      id: 3,
      name: 'Amit Kumar',
      email: 'amit.k@email.com',
      phone: '+91 98765 43212',
      subject: 'Medical Reports',
      message: 'I need to collect my medical reports from last week. When can I pick them up?',
      date: '2024-02-12',
      time: '04:20 PM',
      status: 'Resolved',
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      email: 'sneha.reddy@email.com',
      phone: '+91 98765 43213',
      subject: 'Emergency Consultation',
      message: 'I am experiencing severe abdominal pain. Do you have emergency consultation available?',
      date: '2024-02-13',
      time: '11:45 AM',
      status: 'New',
    },
    {
      id: 5,
      name: 'Vikram Singh',
      email: 'vikram.s@email.com',
      phone: '+91 98765 43214',
      subject: 'Treatment Cost',
      message: 'What is the estimated cost for endoscopy procedure? Do you accept insurance?',
      date: '2024-02-12',
      time: '02:30 PM',
      status: 'In Progress',
    },
    {
      id: 6,
      name: 'Kavita Desai',
      email: 'kavita.d@email.com',
      phone: '+91 98765 43215',
      subject: 'Follow-up Appointment',
      message: 'I had surgery last month and need to schedule a follow-up appointment.',
      date: '2024-02-11',
      time: '03:00 PM',
      status: 'Resolved',
    },
  ]);

  const handleViewInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowViewModal(true);
  };

  const handleDeleteClick = (inquiry) => {
    setInquiryToDelete(inquiry);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setInquiriesList(inquiriesList.filter((inq) => inq.id !== inquiryToDelete.id));
    setShowDeleteModal(false);
    setInquiryToDelete(null);
  };

  const filteredInquiries = inquiriesList.filter((inquiry) => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || inquiry.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status) => {
    switch (status) {
      case 'New':
        return 'info';
      case 'In Progress':
        return 'warning';
      case 'Resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inquiries</h1>
          <p className="text-gray-600 mt-1">Manage patient inquiries and messages</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: inquiriesList.length, color: 'bg-primary-500' },
          { label: 'New', value: inquiriesList.filter((i) => i.status === 'New').length, color: 'bg-blue-500' },
          { label: 'In Progress', value: inquiriesList.filter((i) => i.status === 'In Progress').length, color: 'bg-yellow-500' },
          { label: 'Resolved', value: inquiriesList.filter((i) => i.status === 'Resolved').length, color: 'bg-green-500' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow"
          >
            <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1">
          <SearchInput
            placeholder="Search by name, email, or subject..."
            value={searchTerm}
            onChange={setSearchTerm}
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
            <option>New</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
      </motion.div>

      {/* Inquiries List */}
      <Card delay={0.5}>
        <div className="space-y-4">
          {filteredInquiries.map((inquiry, index) => (
            <motion.div
              key={inquiry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-5 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50 transition-all cursor-pointer"
              onClick={() => setSelectedInquiry(inquiry)}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-lg">{inquiry.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{inquiry.subject}</p>
                    </div>
                    <Badge status={getStatusVariant(inquiry.status)}>{inquiry.status}</Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{inquiry.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <span>{inquiry.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{inquiry.date} at {inquiry.time}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 line-clamp-2">{inquiry.message}</p>
                </div>

                <div className="flex items-center gap-2 lg:flex-col">
                  <Button size="sm" variant="outline" icon={Eye} onClick={() => handleViewInquiry(inquiry)}>
                    View
                  </Button>
                  <Button size="sm" variant="danger" icon={Trash2} onClick={() => handleDeleteClick(inquiry)}>
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredInquiries.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No inquiries found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </Card>

      {/* View Inquiry Modal */}
      {showViewModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Inquiry Details</h2>
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
                  <h3 className="text-xl font-semibold text-gray-800">{selectedInquiry.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedInquiry.subject}</p>
                </div>
                <Badge status={getStatusVariant(selectedInquiry.status)}>{selectedInquiry.status}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-800">{selectedInquiry.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-800">{selectedInquiry.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-sm font-medium text-gray-800">{selectedInquiry.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="text-sm font-medium text-gray-800">{selectedInquiry.time}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{selectedInquiry.message}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="primary" className="flex-1">
                  Reply
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
      {showDeleteModal && inquiryToDelete && (
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
              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Delete Inquiry</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete the inquiry from <strong>{inquiryToDelete.name}</strong>? This action cannot be undone.
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

export default Inquiries;
