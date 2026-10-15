const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw { message: 'Network error. Server may be offline.', errors: {} };
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw { message: data.message || 'Request failed', errors: data.errors || {}, status: res.status };
  return data;
}

export const api = {
  // Public Client Endpoints
  getPackages: () => request('/packages'),
  submitAudit: (body) => request('/audit', { method: 'POST', body: JSON.stringify(body) }),
  subscribe: (body) => request('/subscribe', { method: 'POST', body: JSON.stringify(body) }),
  contact: (body) => request('/contact', { method: 'POST', body: JSON.stringify(body) }),

  // Articles & Blog
  getArticles: (admin = false) => request(`/articles${admin ? '?admin=true' : ''}`),
  getArticle: (slug) => request(`/articles/${slug}`),
  createArticle: (body) => request('/articles', { method: 'POST', body: JSON.stringify(body) }),
  updateArticle: (id, body) => request(`/articles/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteArticle: (id) => request(`/articles/${id}`, { method: 'DELETE' }),

  // Admin Dashboard & SEO
  getAdminStats: () => request('/admin/stats'),
  getAdminLeads: () => request('/admin/leads'),
  updateLeadStatus: (id, status) => request(`/admin/leads/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getAdminSubscribers: () => request('/admin/subscribers'),
  getAdminContacts: () => request('/admin/contacts'),
  getAdminKeywords: (q = '') => request(`/admin/keywords${q ? `?q=${encodeURIComponent(q)}` : ''}`),

  // AI Content Studio
  generateAiArticle: (body) => request('/ai/generate-article', { method: 'POST', body: JSON.stringify(body) }),
  generateTitles: (topic) => request('/ai/titles', { method: 'POST', body: JSON.stringify({ topic }) }),
  generateHooks: (topic) => request('/ai/hooks', { method: 'POST', body: JSON.stringify({ topic }) }),
};
