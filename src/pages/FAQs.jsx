import React, { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import DeleteConfirmation from '../components/ui/DeleteConfirmation';
import { motion, AnimatePresence } from 'framer-motion';

const FAQs = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: 'What are the common symptoms of gastric issues?',
      answer: 'Common symptoms include abdominal pain, bloating, nausea, and indigestion.',
      category: 'General',
    },
    {
      id: 2,
      question: 'How long is the recovery after gastric surgery?',
      answer: 'Recovery typically takes 4-6 weeks, depending on the type of surgery.',
      category: 'Surgery',
    },
  ]);
  const [formData, setFormData] = useState({ question: '', answer: '', category: 'General' });

  const handleAdd = (e) => {
    e.preventDefault();
    if (editItem) {
      setFaqs(faqs.map(f => f.id === editItem.id ? { ...editItem, ...formData } : f));
      setEditItem(null);
    } else {
      setFaqs([...faqs, { id: Date.now(), ...formData }]);
    }
    setFormData({ question: '', answer: '', category: 'General' });
    setShowPopup(false);
  };

  const handleEdit = (item) => {
    setEditItem(item);
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

  const handleDeleteConfirm = () => {
    setFaqs(faqs.filter(faq => faq.id !== deleteId));
    setShowDeletePopup(false);
    setDeleteId(null);
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
        <Button icon={Plus} onClick={() => { setEditItem(null); setFormData({ question: '', answer: '', category: 'General' }); setShowPopup(true); }}>Add FAQ</Button>
      </motion.div>

      <Card delay={0.1}>
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
        </div>
      </Card>

      {/* Add FAQ Popup */}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter answer"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="submit">{editItem ? 'Update' : 'Add'} FAQ</Button>
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

      {/* Delete Confirmation */}
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
