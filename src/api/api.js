import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// ── AUTH ───────────────────────────────────────────────────
export const authAPI = {
    /** Student login via POST /auth/student/login */
    studentLogin: async (email, password) => {
        const res = await api.post('/auth/student/login', { email, password });
        return res.data || null;
    },

    /** Admin login via POST /auth/admin/login */
    adminLogin: async (email, password) => {
        const res = await api.post('/auth/admin/login', { email, password });
        return res.data || null;
    },
};

// ── STUDENTS (read-only for dashboard) ────────────────────
export const studentsAPI = {
    getAll: () => api.get('/students'),
    getById: (id) => api.get(`/students/${id}`),
};

// ── ADMINS ─────────────────────────────────────────────────
export const adminsAPI = {
    getAll: () => api.get('/admins'),
    getById: (id) => api.get(`/admins/${id}`),
};

// ── RESOURCES ──────────────────────────────────────────────
export const resourcesAPI = {
    getAll: () => api.get('/resources'),
    getById: (id) => api.get(`/resources/${id}`),
    create: (data) => api.post('/resources', data),
    update: (id, data) => api.put(`/resources/${id}`, data),
    patch: (id, data) => api.patch(`/resources/${id}`, data),
    delete: (id) => api.delete(`/resources/${id}`),
    approve: (id) => api.patch(`/resources/${id}`, { status: 'approved' }),
    reject: (id) => api.patch(`/resources/${id}`, { status: 'rejected' }),
    incrementDownload: (id, currentCount) =>
        api.patch(`/resources/${id}`, { downloads: currentCount + 1 }),
};

// ── STATS ──────────────────────────────────────────────────
export const statsAPI = {
    get: () => api.get('/stats/1'),
    update: (data) => api.patch('/stats/1', data),
};

// ── ADMIN USER MANAGEMENT ──────────────────────────────────
export const adminUsersAPI = {
    /** GET /api/admin/users?q=searchTerm */
    getAll: (search = '') => api.get(`/admin/users${search ? `?q=${encodeURIComponent(search)}` : ''}`),

    /** GET /api/admin/users/:id */
    getById: (id) => api.get(`/admin/users/${id}`),

    /** POST /api/admin/users */
    create: (data) => api.post('/admin/users', data),

    /** PUT /api/admin/users/:id */
    update: (id, data) => api.put(`/admin/users/${id}`, data),

    /** DELETE /api/admin/users/:id */
    delete: (id) => api.delete(`/admin/users/${id}`),

    /** PATCH /api/admin/users/:id/toggle-status */
    toggleStatus: (id) => api.patch(`/admin/users/${id}/toggle-status`),
};

// ── AUTH HELPERS (localStorage) ────────────────────────────
export const authHelpers = {
    saveUser: (user, role) => {
        localStorage.setItem('eduvault_user', JSON.stringify({ ...user, role }));
    },
    getUser: () => {
        const raw = localStorage.getItem('eduvault_user');
        return raw ? JSON.parse(raw) : null;
    },
    isLoggedIn: () => !!localStorage.getItem('eduvault_user'),
    getRole: () => {
        const u = authHelpers.getUser();
        return u ? u.role : null;
    },
    logout: () => {
        localStorage.removeItem('eduvault_user');
    },
};

// Keep backward compat
export const usersAPI = {
    getAll: () => api.get('/students'),
    getById: (id) => api.get(`/students/${id}`),
    login: authAPI.studentLogin,
    delete: (id) => api.delete(`/students/${id}`),
};

export default api;
