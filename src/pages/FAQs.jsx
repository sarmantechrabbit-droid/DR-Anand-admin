import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DeleteConfirmation from '../components/ui/DeleteConfirmation';
import { motion, AnimatePresence } from 'framer-motion';
import { API_URLS } from '../config/api';

const API_URL = API_URLS.FAQS;

const FAQs = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({ question: '', answer: '', category: 'General' });

  const normalizeFaq = (faq) => ({
    id: faq.id || faq._id,
    question: faq.question || '',
    answer: faq.answer || '',
    category: faq.category || 'General',
  });

  const fetchFaqs = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const { data } = await axios.get(API_URL);
      const list = Array.isArray(data)
        ? data
        : data?.faqs || data?.data || data?.items || data?.results || [];
      setFaqs(list.map(normalizeFaq));
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || 'Unable to load FAQs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const resetForm = () => {
    setFormData({ question: '', answer: '', category: 'General' });
    setEditItem(null);
    setFormError('');
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError('');
    setErrorMessage('');

    const question = formData.question.trim();
    const answer = formData.answer.trim();
    const category = formData.category;

    if (!['General', 'Surgery', 'Treatment', 'Appointment'].includes(category)) {
      setFormError('Please select a valid category.');
      return;
    }

    if (!question) {
      setFormError('Question is required.');
      return;
    }

    if (question.length < 10) {
      setFormError('Question must be at least 10 characters.');
      return;
    }

    if (!answer) {
      setFormError('Answer is required.');
      return;
    }

    if (answer.length < 20) {
      setFormError('Answer must be at least 20 characters.');
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        question,
        answer,
        category,
      };

      if (editItem?.id) {
        await axios.put(`${API_URL}/${editItem.id}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }

      await fetchFaqs();
      resetForm();
      setShowPopup(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || 'Unable to save FAQ');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setFormError('');
    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category,
    });
    setShowPopup(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeletePopup(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setErrorMessage('');

    try {
      await axios.delete(`${API_URL}/${deleteId}`);
      await fetchFaqs();
      setShowDeletePopup(false);
      setDeleteId(null);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || 'Unable to delete FAQ');
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
          <h1 className="text-2xl font-bold text-gray-800">FAQs</h1>
          <p className="text-gray-600 mt-1">Manage frequently asked questions</p>
        </div>
        <Button
          icon={Plus}
          onClick={() => {
            resetForm();
            setFormError('');
            setShowPopup(true);
          }}
        >
          Add FAQ
        </Button>
      </motion.div>

      <Card delay={0.1}>
        {errorMessage && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
            {errorMessage}
          </div>
        )}
        {isLoading && (
          <div className="mb-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700 border border-blue-200">
            Loading FAQs...
          </div>
        )}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                      {faq.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{faq.question}</h3>
                  <p className="text-sm text-gray-600">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="p-2 hover:bg-primary-50 rounded-lg transition-colors group"
                  >
                    <Edit className="w-4 h-4 text-gray-400 group-hover:text-primary-500" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(faq.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {!isLoading && faqs.length === 0 && (
            <div className="text-center py-10 text-gray-500">No FAQs found.</div>
          )}
        </div>
      </Card>

      <AnimatePresence>
        {showPopup && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setShowPopup(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-800">{editItem ? 'Edit' : 'Add New'} FAQ</h2>
                  <button
                    onClick={() => setShowPopup(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <form onSubmit={handleAdd} className="p-6 space-y-4">
                  {formError && (
                    <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
                      {formError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        setFormError('');
                        setFormData({ ...formData, category: e.target.value });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option>General</option>
                      <option>Surgery</option>
                      <option>Treatment</option>
                      <option>Appointment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question
                    </label>
                    <input
                      type="text"
                      value={formData.question}
                      onChange={(e) => {
                        setFormError('');
                        setFormData({ ...formData, question: e.target.value });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter question"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Answer
                    </label>
                    <textarea
                      value={formData.answer}
                      onChange={(e) => {
                        setFormError('');
                        setFormData({ ...formData, answer: e.target.value });
                      }}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter answer"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? 'Saving...' : `${editItem ? 'Update' : 'Add'} FAQ`}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => setShowPopup(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <DeleteConfirmation
        isOpen={showDeletePopup}
        onClose={() => setShowDeletePopup(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete FAQ"
        message="Are you sure you want to delete this FAQ? This action cannot be undone."
      />
    </div>
  );
};

export default FAQs;
