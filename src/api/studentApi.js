import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// ── DOWNLOAD HISTORY ────────────────────────────────────────────
/**
 * GET /api/student/{studentId}/downloads?filter=all|today|week|month
 */
export const getDownloads = async (studentId, filter = 'all') => {
    const res = await api.get(`/student/${studentId}/downloads`, {
        params: { filter },
    });
    return res.data;
};

/**
 * POST /api/student/{studentId}/downloads/{resourceId}
 * Upserts a download history entry.
 */
export const recordDownload = async (studentId, resourceId) => {
    const res = await api.post(`/student/${studentId}/downloads/${resourceId}`);
    return res.data;
};

/**
 * GET /api/student/{studentId}/downloads/stats
 */
export const getDownloadStats = async (studentId) => {
    const res = await api.get(`/student/${studentId}/downloads/stats`);
    return res.data;
};

// ── BOOKMARKS ────────────────────────────────────────────────────
/**
 * GET /api/student/{studentId}/bookmarks
 */
export const getBookmarks = async (studentId) => {
    const res = await api.get(`/student/${studentId}/bookmarks`);
    return res.data;
};

/**
 * POST /api/student/{studentId}/bookmarks/{resourceId}
 */
export const addBookmark = async (studentId, resourceId) => {
    const res = await api.post(`/student/${studentId}/bookmarks/${resourceId}`);
    return res.data;
};

/**
 * DELETE /api/student/{studentId}/bookmarks/{resourceId}
 */
export const removeBookmark = async (studentId, resourceId) => {
    const res = await api.delete(`/student/${studentId}/bookmarks/${resourceId}`);
    return res.data;
};

/**
 * GET /api/student/{studentId}/bookmarks/stats
 */
export const getBookmarkStats = async (studentId) => {
    const res = await api.get(`/student/${studentId}/bookmarks/stats`);
    return res.data;
};

// ── CATEGORIES ───────────────────────────────────────────────────
/**
 * GET /api/categories
 */
export const getCategories = async () => {
    const res = await api.get('/categories');
    return res.data;
};

/**
 * GET /api/categories/resources?name=Computer Science
 */
export const getCategoryResources = async (name) => {
    const res = await api.get('/categories/resources', { params: { name } });
    return res.data;
};

// ── QUICK STATS ──────────────────────────────────────────────────
/**
 * GET /api/students/{studentId}/quick-stats
 */
export const getQuickStats = async (studentId) => {
    const res = await api.get(`/students/${studentId}/quick-stats`);
    return res.data;
};

export default api;
