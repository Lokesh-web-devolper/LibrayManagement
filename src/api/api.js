import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});
export const authAPI = {
    /** Fetch student by email+password from /students */
    studentLogin: async (email, password) => {
        const res = await api.get(`/students?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
        return res.data[0] || null;          // returns user object or null
    },

    adminLogin: async (email, password) => {
        const res = await api.get(`/admins?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
        return res.data[0] || null;
    },
};
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
