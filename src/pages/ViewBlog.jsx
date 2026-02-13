import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Eye } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { motion } from 'framer-motion';
import { getBlogById } from '../data/blogStore';

const ViewBlog = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const blog = getBlogById(id);

  if (!blog) {
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
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Blog Details</h1>
        </div>
        <Badge status={blog.status} />
      </motion.div>

      <Card delay={0.1}>
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
        )}
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{blog.title}</h1>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>{blog.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{blog.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{blog.views} views</span>
          </div>
        </div>

        <div className="prose max-w-none">
          <p className="text-lg text-gray-700 mb-4">{blog.excerpt}</p>
          <p className="text-gray-700 whitespace-pre-line">{blog.content}</p>
        </div>

        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
          <Button onClick={() => navigate(`/blogs/edit/${blog.id}`)}>Edit Blog</Button>
          <Button variant="secondary" onClick={() => navigate('/blogs')}>Back to Blogs</Button>
        </div>
      </Card>
    </div>
  );
};

export default ViewBlog;
