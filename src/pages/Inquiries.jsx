import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Mail, Phone, Calendar, Eye, Trash2, MessageSquare, Filter, Clock } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import SearchInput from '../components/ui/SearchInput';
import DeleteConfirmation from '../components/ui/DeleteConfirmation';
import { motion } from 'framer-motion';
import { API_URLS } from '../config/api';

const Inquiries = () => {
  const API_URL = API_URLS.INQUIRIES;
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [replyError, setReplyError] = useState('');
  const [replyForm, setReplyForm] = useState({
    subject: '',
    message: '',
  });

  const [inquiriesList, setInquiriesList] = useState([]);

  const normalizeInquiry = (item) => {
    const dateValue = item.date || item.createdAt || item.updatedAt || '';
    const parsed = dateValue ? new Date(dateValue) : null;
    const isValidDate = parsed && !Number.isNaN(parsed.getTime());

    return {
      id: item.id || item._id,
      name: item.name || item.fullName || 'Unknown',
      email: item.email || '',
      phone: item.phone || item.mobile || '',
      subject: item.subject || item.inquiryType || 'General Inquiry',
      message: item.message || item.description || '',
      date: isValidDate ? parsed.toISOString().slice(0, 10) : '',
      time: isValidDate
        ? parsed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '',
      status: item.status || 'New',
    };
  };

  const fetchInquiries = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const { data } = await axios.get(API_URL);
      const list = Array.isArray(data)
        ? data
        : data?.inquiries || data?.data || data?.items || data?.results || [];
      setInquiriesList(list.map(normalizeInquiry));
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || 'Unable to load inquiries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleViewInquiry = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowViewModal(true);
  };

  const handleReplyOpen = () => {
    if (!selectedInquiry) return;
    setReplyError('');
    setReplyForm({
      subject: `Re: ${selectedInquiry.subject || 'Inquiry'}`,
      message: `Hi ${selectedInquiry.name || ''},\n\nThank you for reaching out.\n\n`,
    });
    setShowReplyModal(true);
  };

  const handleReplySend = () => {
    const recipientEmail = (selectedInquiry?.email || '').trim();
    if (!recipientEmail) {
      setReplyError('Recipient email is missing for this inquiry.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(recipientEmail)) {
      setReplyError('Recipient email is invalid for this inquiry.');
      return;
    }

    const subject = replyForm.subject.trim();
    const message = replyForm.message.trim();

    if (!subject) {
      setReplyError('Subject is required.');
      return;
    }

    if (!message) {
      setReplyError('Message is required.');
      return;
    }

    // Keep recipient unencoded for wider mail client compatibility.
    const mailtoUrl = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

    try {
      window.location.assign(mailtoUrl);
    } catch {
      const anchor = document.createElement('a');
      anchor.href = mailtoUrl;
      anchor.style.display = 'none';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    }

    setShowReplyModal(false);
  };

  const handleDeleteClick = (inquiry) => {
    setInquiryToDelete(inquiry);
    setShowDeleteModal(true);
  };

  const updateInquiryStatusById = async (id, status) => {
    const payload = { status };
    try {
      await axios.put(`${API_URL}/${id}/status`, payload);
      return;
    } catch {
      // Fallback for APIs that update status directly on the inquiry endpoint.
    }

    try {
      await axios.patch(`${API_URL}/${id}/status`, payload);
      return;
    } catch {
      // Fallback for APIs that only support full resource updates.
    }

    try {
      await axios.put(`${API_URL}/${id}`, payload);
    } catch {
      await axios.patch(`${API_URL}/${id}`, payload);
    }
  };

  const handleStatusUpdate = async (inquiry, nextStatus) => {
    if (!inquiry?.id || inquiry.status === nextStatus) return;

    setErrorMessage('');
    setUpdatingStatusId(inquiry.id);
    try {
      await updateInquiryStatusById(inquiry.id, nextStatus);

      setInquiriesList((prev) =>
        prev.map((item) => (item.id === inquiry.id ? { ...item, status: nextStatus } : item))
      );
      setSelectedInquiry((prev) =>
        prev && prev.id === inquiry.id ? { ...prev, status: nextStatus } : prev
      );
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || 'Unable to update inquiry status');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!inquiryToDelete?.id) return;
    setErrorMessage('');
    try {
      await axios.delete(`${API_URL}/${inquiryToDelete.id}`);
      await fetchInquiries();
      setShowDeleteModal(false);
      setInquiryToDelete(null);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || 'Unable to delete inquiry');
    }
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

      <Card delay={0.5}>
        {errorMessage && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
            {errorMessage}
          </div>
        )}
        {isLoading && (
          <div className="mb-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700 border border-blue-200">
            Loading inquiries...
          </div>
        )}
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
                
                  <Button
                    size="sm"
                    variant="outline"
                    icon={Eye}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewInquiry(inquiry);
                    }}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    icon={Trash2}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(inquiry);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!isLoading && filteredInquiries.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No inquiries found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </Card>

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

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="secondary"
                  disabled={
                    updatingStatusId === selectedInquiry.id ||
                    selectedInquiry.status === 'In Progress' ||
                    selectedInquiry.status === 'Resolved'
                  }
                  onClick={() => handleStatusUpdate(selectedInquiry, 'In Progress')}
                >
                  {updatingStatusId === selectedInquiry.id &&
                  selectedInquiry.status !== 'In Progress' &&
                  selectedInquiry.status !== 'Resolved'
                    ? 'Updating...'
                    : 'Mark as In Progress'}
                </Button>
                <Button
                  disabled={updatingStatusId === selectedInquiry.id || selectedInquiry.status === 'Resolved'}
                  onClick={() => handleStatusUpdate(selectedInquiry, 'Resolved')}
                >
                  {updatingStatusId === selectedInquiry.id && selectedInquiry.status !== 'Resolved'
                    ? 'Updating...'
                    : 'Mark as Resolved'}
                </Button>
              </div>

            </div>
          </motion.div>
        </div>
      )}

      {showReplyModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Reply to Inquiry</h2>
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">To: {selectedInquiry.email}</p>
            </div>

            <div className="p-6 space-y-4">
              {replyError && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
                  {replyError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={replyForm.subject}
                  onChange={(e) => setReplyForm({ ...replyForm, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter email subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows="8"
                  value={replyForm.message}
                  onChange={(e) => setReplyForm({ ...replyForm, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Write your reply"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="primary" className="flex-1" onClick={handleReplySend}>
                  Send via Email
                </Button>
                <Button variant="outline" onClick={() => setShowReplyModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setInquiryToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Inquiry"
        message={`Are you sure you want to delete the inquiry${inquiryToDelete?.name ? ` from ${inquiryToDelete.name}` : ''}? This action cannot be undone.`}
      />
    </div>
  );
};

export default Inquiries;
