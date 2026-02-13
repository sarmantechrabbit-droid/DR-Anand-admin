import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import { getBlogById, updateBlog } from '../data/blogStore';

const EditBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [isMissing, setIsMissing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    status: 'Draft',
    image: null,
    imagePreview: null,
  });

  useEffect(() => {
    const blog = getBlogById(id);
    if (!blog) {
      setIsMissing(true);
      return;
    }

    setFormData({
      title: blog.title || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      status: blog.status || 'Draft',
      image: null,
      imagePreview: blog.image || null,
    });
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = updateBlog(id, {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      status: formData.status,
      image: formData.imagePreview,
    });

    if (!updated) {
      setIsMissing(true);
      return;
    }

    navigate('/blogs');
  };

  if (isMissing) {
    return (
      <Card>
        <div className="space-y-4">
          <h1 className="text-xl font-bold text-gray-800">Blog not found</h1>
          <Button onClick={() => navigate('/blogs')}>Back to Blogs</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <button
          onClick={() => navigate('/blogs')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Blog</h1>
          <p className="text-gray-600 mt-1">Update blog post</p>
        </div>
      </motion.div>

      <Card delay={0.1}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {formData.imagePreview && (
              <div className="mt-4">
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <input
              type="text"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows="10"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option>Draft</option>
              <option>Published</option>
            </select>
          </div>

          <div className="flex gap-3">
            <Button type="submit" icon={Save}>Update Blog</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/blogs')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditBlog;
