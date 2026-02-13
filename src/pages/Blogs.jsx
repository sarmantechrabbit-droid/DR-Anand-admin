



import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { motion } from 'framer-motion';

const Blogs = () => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [addForm, setAddForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    status: 'Draft',
    image: null,
  });
  const [editForm, setEditForm] = useState({
    id: null,
    title: '',
    excerpt: '',
    content: '',
    status: 'Draft',
    image: null,
  });

  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: 'Understanding Gastroesophageal Reflux Disease (GERD)',
      excerpt: 'Learn about the causes, symptoms, and treatment options for GERD.',
      content: 'GERD is a common digestive disorder that affects millions of people worldwide...',
      author: 'Dr. Anand Kumar',
      date: '2024-02-10',
      views: 1245,
      status: 'Published',
      image: null,
    },
    {
      id: 2,
      title: '5 Tips for Maintaining a Healthy Digestive System',
      excerpt: 'Discover practical tips and lifestyle changes to improve your digestive health.',
      content: 'A healthy digestive system is crucial for overall wellbeing...',
      author: 'Dr. Anand Kumar',
      date: '2024-02-08',
      views: 892,
      status: 'Published',
      image: null,
    },
    {
      id: 3,
      title: 'When to See a Gastroenterologist',
      excerpt: 'Know the warning signs that indicate you should consult a gastroenterology specialist.',
      content: 'Many people wonder when they should see a gastroenterologist...',
      author: 'Dr. Anand Kumar',
      date: '2024-02-05',
      views: 567,
      status: 'Draft',
      image: null,
    },
  ]);

  const handleViewBlog = (blog) => {
    setSelectedBlog(blog);
    setShowViewModal(true);
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setBlogs(blogs.filter(b => b.id !== blogToDelete.id));
    setShowDeleteModal(false);
    setBlogToDelete(null);
  };

  const fileToDataUrl = (file, onLoad) => {
    const reader = new FileReader();
    reader.onload = () => onLoad(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAddImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    fileToDataUrl(file, (imageData) => {
      setAddForm((prev) => ({ ...prev, image: imageData }));
    });
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    fileToDataUrl(file, (imageData) => {
      setEditForm((prev) => ({ ...prev, image: imageData }));
    });
  };

  const handleAddSave = () => {
    const title = addForm.title.trim();
    const excerpt = addForm.excerpt.trim();
    const content = addForm.content.trim();
    if (!title || !excerpt || !content) {
      return;
    }

    const nextId = blogs.length ? Math.max(...blogs.map((b) => b.id)) + 1 : 1;
    const newBlog = {
      id: nextId,
      title,
      excerpt,
      content,
      author: 'Dr. Anand Kumar',
      date: new Date().toISOString().slice(0, 10),
      views: 0,
      status: addForm.status,
      image: addForm.image,
    };

    setBlogs([newBlog, ...blogs]);
    setShowAddModal(false);
    setAddForm({
      title: '',
      excerpt: '',
      content: '',
      status: 'Draft',
      image: null,
    });
  };

  const handleEditClick = (blog) => {
    setEditForm({
      id: blog.id,
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      status: blog.status,
      image: blog.image || null,
    });
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    setBlogs(blogs.map((blog) => (
      blog.id === editForm.id
        ? {
            ...blog,
            title: editForm.title,
            excerpt: editForm.excerpt,
            content: editForm.content,
            status: editForm.status,
            image: editForm.image,
          }
        : blog
    )));

    if (selectedBlog && selectedBlog.id === editForm.id) {
      setSelectedBlog({
        ...selectedBlog,
        title: editForm.title,
        excerpt: editForm.excerpt,
        content: editForm.content,
        status: editForm.status,
        image: editForm.image,
      });
    }

    setShowEditModal(false);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Blogs</h1>
          <p className="text-gray-600 mt-1">Manage your blog posts</p>
        </div>
        <Button icon={Plus} onClick={() => setShowAddModal(true)}>Add New Blog</Button>
      </motion.div>

      <Card delay={0.1}>
        <div className="space-y-4">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50 transition-all"
            >
              {blog.image && (
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full sm:w-32 h-32 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">{blog.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{blog.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{blog.author}</span>
                  <span>|</span>
                  <span>{blog.date}</span>
                  <span>|</span>
                  <span>{blog.views} views</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4 sm:mt-0">
                <Badge status={blog.status} />
                <button
                  onClick={() => handleViewBlog(blog)}
                  className="p-2 hover:bg-primary-50 rounded-lg transition-colors group"
                >
                  <Eye className="w-4 h-4 text-gray-400 group-hover:text-primary-500" />
                </button>
                <button
                  onClick={() => handleEditClick(blog)}
                  className="p-2 hover:bg-primary-50 rounded-lg transition-colors group"
                >
                  <Edit className="w-4 h-4 text-gray-400 group-hover:text-primary-500" />
                </button>
                <button
                  onClick={() => handleDeleteClick(blog)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                >
                  <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* View Blog Modal */}
      {showViewModal && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Blog Post</h2>
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
              {selectedBlog.image && (
                <img
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  className="w-full h-64 object-cover rounded-xl"
                />
              )}

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{selectedBlog.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{selectedBlog.excerpt}</p>
                </div>
                <Badge status={selectedBlog.status === 'Published' ? 'success' : 'warning'}>
                  {selectedBlog.status}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Author</p>
                  <p className="text-sm font-medium text-gray-800">{selectedBlog.author}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Published</p>
                  <p className="text-sm font-medium text-gray-800">{selectedBlog.date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Views</p>
                  <p className="text-sm font-medium text-gray-800">{selectedBlog.views}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Content</h4>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{selectedBlog.content}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditClick(selectedBlog);
                  }}
                >
                  Edit Post
                </Button>
                <Button variant="outline" onClick={() => setShowViewModal(false)}>
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Blog Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Add Blog</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAddImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {addForm.image && (
                  <img src={addForm.image} alt="Blog preview" className="mt-3 w-full h-48 object-cover rounded-lg" />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={addForm.title}
                  onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                <input
                  type="text"
                  value={addForm.excerpt}
                  onChange={(e) => setAddForm({ ...addForm, excerpt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  rows="6"
                  value={addForm.content}
                  onChange={(e) => setAddForm({ ...addForm, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={addForm.status}
                  onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option>Draft</option>
                  <option>Published</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleAddSave} className="flex-1">
                  Add Blog
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Blog Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Edit Blog</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {editForm.image && (
                  <img src={editForm.image} alt="Blog preview" className="mt-3 w-full h-48 object-cover rounded-lg" />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                <input
                  type="text"
                  value={editForm.excerpt}
                  onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  rows="6"
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option>Draft</option>
                  <option>Published</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowEditModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleEditSave} className="flex-1">
                  Save Changes
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && blogToDelete && (
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
              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">Delete Blog Post</h3>
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to delete <strong>{blogToDelete.title}</strong>? This action cannot be undone.
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

export default Blogs;
