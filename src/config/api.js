const base = import.meta.env.VITE_API_BASE_URL ;
export const API_BASE = base.endsWith('/') ? base.slice(0, -1) : base;

export const API_URLS = {
  BLOGS: `${API_BASE}/api/blogs`,
  TESTIMONIALS: `${API_BASE}/api/testimonials`,
  INQUIRIES: `${API_BASE}/api/inquiries`,
  FAQS: `${API_BASE}/api/faqs`,
  APPOINTMENTS: `${API_BASE}/api/appointments`,
  LOGIN: `${API_BASE}/api/admin/login`,
  CHANGE_PASSWORD: `${API_BASE}/api/admin/change-password`,
  DASHBOARD: `${API_BASE}/api/dashboard/stats`,
};
