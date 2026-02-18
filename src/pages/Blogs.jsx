
import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import DeleteConfirmation from '../components/ui/DeleteConfirmation';
import { motion } from 'framer-motion';
import { API_BASE, API_URLS } from '../config/api';

const Blogs = () => {
  const API_URL = API_URLS.BLOGS;
  const BLOG_LIMITS = {
    titleMax: 100,
    excerptMax: 600,
    contentMax: 1000,
  };
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [addFormError, setAddFormError] = useState('');
  const [editFormError, setEditFormError] = useState('');
  const [addForm, setAddForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    status: 'Draft',
    imageFile: null,
    imagePreview: null,
  });
  const [editForm, setEditForm] = useState({
    id: null,
    title: '',
    excerpt: '',
    content: '',
    status: 'Draft',
    imageFile: null,
    imagePreview: null,
  });

  const [blogs, setBlogs] = useState([]);

  const normalizeViews = (blog) => {
    const value =
      blog?.views ??
      blog?.viewCount ??
      blog?.viewsCount ??
      blog?.totalViews ??
      blog?.view ??
      0;

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const resolveImageUrl = (value) => {
    if (!value) return null;
    if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
      return value;
    }
    return `${API_BASE}/uploads/${value}`;
  };

  const normalizeBlog = (blog) => ({
    id: blog.id || blog._id,
    title: blog.title || '',
    excerpt: blog.excerpt || '',
    content: blog.content || '',
    author: blog.author || 'Dr. Anand Kumar',
    date: (blog.date || blog.createdAt || '').toString().slice(0, 10),
    views: normalizeViews(blog),
    status: blog.status || 'Draft',
    image: resolveImageUrl(blog.image),
  });

  const extractBlogsList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.blogs)) return payload.blogs;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.blogs)) return payload.data.blogs;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.results)) return payload.results;
    return [];
  };

  const fetchBlogs = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
      const data = await response.json();
      if (data?.success === false) {
        throw new Error(data?.message || 'Unable to load blogs');
      }
      const list = extractBlogsList(data);
      setBlogs(list.map(normalizeBlog));
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load blogs');
    } finally {
      setIsLoading(false);
    }
  };

  const extractSingleBlog = (payload) => {
    if (!payload || typeof payload !== 'object') return null;
    if (payload.blog && typeof payload.blog === 'object') return payload.blog;
    if (payload.data?.blog && typeof payload.data.blog === 'object') return payload.data.blog;
    if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) return payload.data;
    if (payload.result && typeof payload.result === 'object') return payload.result;
    if (payload.item && typeof payload.item === 'object') return payload.item;
    return payload;
  };

  const fetchBlogDetails = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to load blog details');
    }
    const data = await response.json();
    if (data?.success === false) {
      throw new Error(data?.message || 'Unable to open blog');
    }
    return extractSingleBlog(data);
  };

  const incrementBlogViews = async (id) => {
    const attempts = [
      { method: 'POST', url: `${API_URL}/${id}/view` },
      { method: 'POST', url: `${API_URL}/${id}/views` },
      { method: 'PATCH', url: `${API_URL}/${id}/views`, body: { action: 'increment' } },
      { method: 'PATCH', url: `${API_URL}/${id}`, body: { incrementViews: true } },
      { method: 'PUT', url: `${API_URL}/${id}`, body: { incrementViews: true } },
    ];

    for (const attempt of attempts) {
      try {
        const response = await fetch(attempt.url, {
          method: attempt.method,
          headers: attempt.body ? { 'Content-Type': 'application/json' } : undefined,
          body: attempt.body ? JSON.stringify(attempt.body) : undefined,
        });

        if (!response.ok) continue;
        const data = await response.json().catch(() => null);
        if (data?.success === false) continue;
        const item = extractSingleBlog(data);
        if (item && typeof item === 'object') {
          return item;
        }
        return null;
      } catch {
        // Try next endpoint shape.
      }
    }

    return null;
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleViewBlog = async (blog) => {
    setErrorMessage('');
    try {
      const incremented = await incrementBlogViews(blog.id);
      const detailItem = incremented || (await fetchBlogDetails(blog.id));
      const normalized = normalizeBlog(detailItem);

      setSelectedBlog(normalized);
      setBlogs((prev) =>
        prev.map((item) => (item.id === blog.id ? { ...item, views: normalized.views } : item))
      );
      setShowViewModal(true);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to open blog');
    }
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!blogToDelete) return;
    setErrorMessage('');
    try {
      const response = await fetch(`${API_URL}/${blogToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete blog');
      }
      const data = await response.json().catch(() => null);
      if (data?.success === false) {
        throw new Error(data?.message || 'Unable to delete blog');
      }
      await fetchBlogs();
      setShowDeleteModal(false);
      setBlogToDelete(null);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to delete blog');
    }
  };

  const handleAddImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setAddFormError('');
    setAddForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setEditForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const handleAddSave = async () => {
    const title = addForm.title.trim();
    const excerpt = addForm.excerpt.trim();
    const content = addForm.content.trim();
    const status = addForm.status;

    setAddFormError('');

    if (!addForm.imageFile) {
      setAddFormError('Blog image is required.');
      return;
    }

    if (!title) {
      setAddFormError('Title is required.');
      return;
    }

    if (title.length < 5) {
      setAddFormError('Title must be at least 5 characters.');
      return;
    }

    if (title.length > BLOG_LIMITS.titleMax) {
      setAddFormError(`Title cannot be more than ${BLOG_LIMITS.titleMax} characters.`);
      return;
    }

    if (!excerpt) {
      setAddFormError('Excerpt is required.');
      return;
    }

    if (excerpt.length < 15) {
      setAddFormError('Excerpt must be at least 15 characters.');
      return;
    }

    if (excerpt.length > BLOG_LIMITS.excerptMax) {
      setAddFormError(`Excerpt cannot be more than ${BLOG_LIMITS.excerptMax} characters.`);
      return;
    }

    if (!content) {
      setAddFormError('Content is required.');
      return;
    }

    if (content.length < 50) {
      setAddFormError('Content must be at least 50 characters.');
      return;
    }

    if (content.length > BLOG_LIMITS.contentMax) {
      setAddFormError(`Content cannot be more than ${BLOG_LIMITS.contentMax} characters.`);
      return;
    }

    if (!['Draft', 'Published'].includes(status)) {
      setAddFormError('Please select a valid status.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('excerpt', excerpt);
    formData.append('content', content);
    formData.append('author', 'Dr. Anand Kumar');
    formData.append('status', status);
    if (addForm.imageFile) {
      formData.append('image', addForm.imageFile);
    }
    setErrorMessage('');
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to add blog');
      }
      const data = await response.json().catch(() => null);
      if (data?.success === false) {
        throw new Error(data?.message || 'Unable to add blog');
      }
      await fetchBlogs();
      setShowAddModal(false);
      setAddFormError('');
      setAddForm({
        title: '',
        excerpt: '',
        content: '',
        status: 'Draft',
        imageFile: null,
        imagePreview: null,
      });
    } catch (error) {
      setErrorMessage(error.message || 'Unable to add blog');
    }
  };

  const handleEditClick = (blog) => {
    setEditFormError('');
    setEditForm({
      id: blog.id,
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      status: blog.status,
      imageFile: null,
      imagePreview: blog.image || null,
    });
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!editForm.id) return;

    const title = editForm.title.trim();
    const excerpt = editForm.excerpt.trim();
    const content = editForm.content.trim();
    const status = editForm.status;

    setEditFormError('');
    setErrorMessage('');

    if (!title) {
      setEditFormError('Title is required.');
      return;
    }

    if (title.length < 5) {
      setEditFormError('Title must be at least 5 characters.');
      return;
    }

    if (title.length > BLOG_LIMITS.titleMax) {
      setEditFormError(`Title cannot be more than ${BLOG_LIMITS.titleMax} characters.`);
      return;
    }

    if (!excerpt) {
      setEditFormError('Excerpt is required.');
      return;
    }

    if (excerpt.length < 15) {
      setEditFormError('Excerpt must be at least 15 characters.');
      return;
    }

    if (excerpt.length > BLOG_LIMITS.excerptMax) {
      setEditFormError(`Excerpt cannot be more than ${BLOG_LIMITS.excerptMax} characters.`);
      return;
    }

    if (!content) {
      setEditFormError('Content is required.');
      return;
    }

    if (content.length < 50) {
      setEditFormError('Content must be at least 50 characters.');
      return;
    }

    if (content.length > BLOG_LIMITS.contentMax) {
      setEditFormError(`Content cannot be more than ${BLOG_LIMITS.contentMax} characters.`);
      return;
    }

    if (!['Draft', 'Published'].includes(status)) {
      setEditFormError('Please select a valid status.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${editForm.id}`, {
        method: 'PUT',
        body: (() => {
          const formData = new FormData();
          formData.append('title', title);
          formData.append('excerpt', excerpt);
          formData.append('content', content);
          formData.append('status', status);
          if (editForm.imageFile) {
            formData.append('image', editForm.imageFile);
          }
          return formData;
        })(),
      });
      if (!response.ok) {
        throw new Error('Failed to update blog');
      }
      const data = await response.json().catch(() => null);
      if (data?.success === false) {
        throw new Error(data?.message || 'Unable to update blog');
      }
      await fetchBlogs();
      if (selectedBlog && selectedBlog.id === editForm.id) {
        const detailResponse = await fetch(`${API_URL}/${editForm.id}`);
        if (detailResponse.ok) {
          const detailData = await detailResponse.json();
          setSelectedBlog(normalizeBlog(detailData.blog || detailData));
        }
      }
      setShowEditModal(false);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to update blog');
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
          <h1 className="text-2xl font-bold text-gray-800">Blogs</h1>
          <p className="text-gray-600 mt-1">Manage your blog posts</p>
        </div>
        <Button icon={Plus} onClick={() => {
          setAddFormError('');
          setShowAddModal(true);
        }}>Add New Blog</Button>
      </motion.div>

      <Card delay={0.1}>
        {errorMessage && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
            {errorMessage}
          </div>
        )}
        {isLoading && (
          <div className="mb-4 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700 border border-blue-200">
            Loading blogs...
          </div>
        )}
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
          {!isLoading && blogs.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No blogs found.
            </div>
          )}
        </div>
      </Card>

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
              {addFormError && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
                  {addFormError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAddImageChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {addForm.imagePreview && (
                  <img src={addForm.imagePreview} alt="Blog preview" className="mt-3 w-full h-48 object-cover rounded-lg" />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={addForm.title}
                  onChange={(e) => {
                    setAddFormError('');
                    setAddForm({ ...addForm, title: e.target.value });
                  }}
                  maxLength={BLOG_LIMITS.titleMax}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                <input
                  type="text"
                  value={addForm.excerpt}
                  onChange={(e) => {
                    setAddFormError('');
                    setAddForm({ ...addForm, excerpt: e.target.value });
                  }}
                  maxLength={BLOG_LIMITS.excerptMax}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  rows="6"
                  value={addForm.content}
                  onChange={(e) => {
                    setAddFormError('');
                    setAddForm({ ...addForm, content: e.target.value });
                  }}
                  maxLength={BLOG_LIMITS.contentMax}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={addForm.status}
                  onChange={(e) => {
                    setAddFormError('');
                    setAddForm({ ...addForm, status: e.target.value });
                  }}
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
              {editFormError && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
                  {editFormError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {editForm.imagePreview && (
                  <img src={editForm.imagePreview} alt="Blog preview" className="mt-3 w-full h-48 object-cover rounded-lg" />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => {
                    setEditFormError('');
                    setEditForm({ ...editForm, title: e.target.value });
                  }}
                  maxLength={BLOG_LIMITS.titleMax}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                <input
                  type="text"
                  value={editForm.excerpt}
                  onChange={(e) => {
                    setEditFormError('');
                    setEditForm({ ...editForm, excerpt: e.target.value });
                  }}
                  maxLength={BLOG_LIMITS.excerptMax}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  rows="6"
                  value={editForm.content}
                  onChange={(e) => {
                    setEditFormError('');
                    setEditForm({ ...editForm, content: e.target.value });
                  }}
                  maxLength={BLOG_LIMITS.contentMax}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => {
                    setEditFormError('');
                    setEditForm({ ...editForm, status: e.target.value });
                  }}
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

      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setBlogToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Blog Post"
        message={`Are you sure you want to delete ${blogToDelete?.title ? `"${blogToDelete.title}"` : 'this blog'}? This action cannot be undone.`}
      />
    </div>
  );
};

export default Blogs;
