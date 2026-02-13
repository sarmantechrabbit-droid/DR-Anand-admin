const BLOGS_STORAGE_KEY = 'dranand_dashboard_blogs';

const defaultBlogs = [
  {
    id: 1,
    title: 'Understanding Gastric Health',
    excerpt: 'Learn about maintaining a healthy digestive system...',
    content:
      'Good gastric health starts with diet, hydration, and consistent habits. Focus on fiber-rich foods, regular meals, and avoiding triggers that cause bloating or acidity.',
    author: 'Dr. Anand',
    date: '2024-02-10',
    status: 'Published',
    views: 1250,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
  },
  {
    id: 2,
    title: 'Post-Surgery Care Tips',
    excerpt: 'Essential guidelines for recovery after gastric surgery...',
    content:
      'Recovery after surgery requires proper rest, wound care, hydration, and follow-up. Always monitor symptoms and contact your doctor when warning signs appear.',
    author: 'Dr. Anand',
    date: '2024-02-08',
    status: 'Published',
    views: 890,
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800',
  },
  {
    id: 3,
    title: 'Diet and Digestive Health',
    excerpt: 'How your diet affects your digestive system...',
    content:
      'A balanced diet supports gut function and long-term digestive comfort. Include fruits, vegetables, fermented foods, and enough water to keep digestion healthy.',
    author: 'Dr. Anand',
    date: '2024-02-05',
    status: 'Draft',
    views: 0,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800',
  },
];

const canUseStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const getBlogs = () => {
  if (!canUseStorage()) {
    return defaultBlogs;
  }

  const raw = window.localStorage.getItem(BLOGS_STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(defaultBlogs));
    return defaultBlogs;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultBlogs;
  } catch (error) {
    return defaultBlogs;
  }
};

export const saveBlogs = (blogs) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(blogs));
};

export const getBlogById = (id) => {
  const numericId = Number(id);
  return getBlogs().find((blog) => blog.id === numericId) || null;
};

export const addBlog = (blogData) => {
  const blogs = getBlogs();
  const nextId = blogs.length ? Math.max(...blogs.map((blog) => blog.id)) + 1 : 1;

  const newBlog = {
    id: nextId,
    title: blogData.title.trim(),
    excerpt: blogData.excerpt.trim(),
    content: blogData.content.trim(),
    status: blogData.status,
    image: blogData.image || '',
    author: 'Dr. Anand',
    date: new Date().toISOString().slice(0, 10),
    views: 0,
  };

  const updated = [newBlog, ...blogs];
  saveBlogs(updated);
  return newBlog;
};

export const updateBlog = (id, blogData) => {
  const numericId = Number(id);
  const blogs = getBlogs();
  const existingBlog = blogs.find((blog) => blog.id === numericId);

  if (!existingBlog) {
    return null;
  }

  const updatedBlogs = blogs.map((blog) =>
    blog.id === numericId
      ? {
          ...blog,
          title: blogData.title.trim(),
          excerpt: blogData.excerpt.trim(),
          content: blogData.content.trim(),
          status: blogData.status,
          image: blogData.image || blog.image || '',
        }
      : blog
  );

  saveBlogs(updatedBlogs);
  return updatedBlogs.find((blog) => blog.id === numericId) || null;
};

export const deleteBlog = (id) => {
  const numericId = Number(id);
  const blogs = getBlogs();
  const updated = blogs.filter((blog) => blog.id !== numericId);
  saveBlogs(updated);
};
