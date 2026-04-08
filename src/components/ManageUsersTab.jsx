import React, { useState, useEffect } from 'react';
import { adminUsersAPI } from '../api/api';
import './ManageUsersTab.css';

const DEPARTMENTS = [
    'Computer Science', 'Mathematics', 'Physics',
    'Mechanical Engineering', 'Chemistry', 'Literature',
    'Electronics & Communication', 'Civil Engineering',
    'Business Administration', 'Biotechnology',
];

const SEMESTERS = ['1', '2', '3', '4', '5', '6', '7', '8'];

const EMPTY_FORM = {
    name: '', email: '', password: '',
    department: '', semester: '1',
    isActive: true, avatar: '',
};

function generateAvatar(name) {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return 'ST';
}

export default function ManageUsersTab() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQ, setSearchQ] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [editId, setEditId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async (q = '') => {
        setLoading(true);
        try {
            const res = await adminUsersAPI.getAll(q);
            setUsers(res.data);
        } catch (err) {
            showToast('error', 'Failed to load users.');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3500);
    };

    const handleSearch = (e) => {
        const val = e.target.value;
        setSearchQ(val);
        fetchUsers(val);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newVal = type === 'checkbox' ? checked : value;
        setFormData(prev => {
            const updated = { ...prev, [name]: newVal };
            // Auto-generate avatar from name
            if (name === 'name') updated.avatar = generateAvatar(value);
            return updated;
        });
        // Clear field error on change
        if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const errs = {};
        if (!formData.name.trim()) errs.name = 'Full name is required.';
        if (!formData.email.trim()) errs.email = 'Email is required.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email.';
        if (!editId && !formData.password.trim()) errs.password = 'Password is required.';
        if (!formData.department) errs.department = 'Department is required.';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setFormErrors(errs); return; }

        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                avatar: formData.avatar || generateAvatar(formData.name),
            };
            if (editId) {
                await adminUsersAPI.update(editId, payload);
                showToast('success', '✅ User updated successfully!');
            } else {
                await adminUsersAPI.create(payload);
                showToast('success', '✅ User created successfully!');
            }
            resetForm();
            fetchUsers(searchQ);
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.message || err.response?.data || 'Operation failed.';
            showToast('error', `❌ ${msg}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (u) => {
        setEditId(u.id);
        setFormData({
            name: u.name || '',
            email: u.email || '',
            password: '',
            department: u.department || '',
            semester: u.semester || '1',
            isActive: u.isActive !== false,
            avatar: u.avatar || '',
        });
        setFormErrors({});
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
        try {
            await adminUsersAPI.delete(id);
            showToast('success', '✅ User deleted.');
            fetchUsers(searchQ);
        } catch {
            showToast('error', '❌ Failed to delete user.');
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await adminUsersAPI.toggleStatus(id);
            showToast('success', `✅ User ${currentStatus ? 'deactivated' : 'activated'}.`);
            fetchUsers(searchQ);
        } catch {
            showToast('error', '❌ Failed to update status.');
        }
    };

    const resetForm = () => {
        setFormData(EMPTY_FORM);
        setEditId(null);
        setFormErrors({});
        setShowForm(false);
    };

    return (
        <div className="mu-root">
            {/* Toast */}
            {toast && (
                <div className={`mu-toast mu-toast-${toast.type}`}>
                    {toast.msg}
                </div>
            )}

            {/* Header Row */}
            <div className="mu-header">
                <div>
                    <h2 className="mu-title">👤 Manage Users</h2>
                    <p className="mu-subtitle">Create, edit, and manage student accounts</p>
                </div>
                <button
                    className={`mu-add-btn ${showForm && !editId ? 'mu-cancel-btn' : ''}`}
                    onClick={() => { if (showForm && !editId) { resetForm(); } else { resetForm(); setShowForm(true); } }}
                >
                    {showForm && !editId ? '✕ Cancel' : '➕ Create New User'}
                </button>
            </div>

            {/* Create / Edit Form */}
            {showForm && (
                <div className="mu-form-card">
                    <h3 className="mu-form-title">{editId ? '✏️ Edit User' : '➕ Create New User'}</h3>
                    <form className="mu-form" onSubmit={handleSubmit} noValidate>
                        <div className="mu-form-grid">
                            {/* Full Name */}
                            <div className="mu-field">
                                <label className="mu-label">Full Name *</label>
                                <input
                                    className={`mu-input ${formErrors.name ? 'mu-input-error' : ''}`}
                                    type="text" name="name" placeholder="e.g. Lokesh Kumar"
                                    value={formData.name} onChange={handleFormChange}
                                    id="mu-name"
                                />
                                {formErrors.name && <span className="mu-field-error">{formErrors.name}</span>}
                            </div>

                            {/* Email */}
                            <div className="mu-field">
                                <label className="mu-label">Email Address *</label>
                                <input
                                    className={`mu-input ${formErrors.email ? 'mu-input-error' : ''}`}
                                    type="email" name="email" placeholder="student@kluniversity.in"
                                    value={formData.email} onChange={handleFormChange}
                                    id="mu-email"
                                />
                                {formErrors.email && <span className="mu-field-error">{formErrors.email}</span>}
                            </div>

                            {/* Password */}
                            <div className="mu-field">
                                <label className="mu-label">
                                    Password {editId ? '(leave blank to keep existing)' : '*'}
                                </label>
                                <input
                                    className={`mu-input ${formErrors.password ? 'mu-input-error' : ''}`}
                                    type="password" name="password" placeholder="Enter password"
                                    value={formData.password} onChange={handleFormChange}
                                    id="mu-password"
                                />
                                {formErrors.password && <span className="mu-field-error">{formErrors.password}</span>}
                            </div>

                            {/* Department */}
                            <div className="mu-field">
                                <label className="mu-label">Department *</label>
                                <select
                                    className={`mu-input mu-select ${formErrors.department ? 'mu-input-error' : ''}`}
                                    name="department" value={formData.department}
                                    onChange={handleFormChange} id="mu-department"
                                >
                                    <option value="">Select department…</option>
                                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                {formErrors.department && <span className="mu-field-error">{formErrors.department}</span>}
                            </div>

                            {/* Semester */}
                            <div className="mu-field">
                                <label className="mu-label">Semester</label>
                                <select
                                    className="mu-input mu-select"
                                    name="semester" value={formData.semester}
                                    onChange={handleFormChange} id="mu-semester"
                                >
                                    {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
                                </select>
                            </div>

                            {/* Avatar */}
                            <div className="mu-field">
                                <label className="mu-label">Avatar / Initials</label>
                                <input
                                    className="mu-input"
                                    type="text" name="avatar" maxLength={3}
                                    placeholder="Auto-generated from name"
                                    value={formData.avatar} onChange={handleFormChange}
                                    id="mu-avatar"
                                />
                                <span className="mu-field-hint">Auto-filled from name. Override if needed.</span>
                            </div>
                        </div>

                        {/* Active toggle */}
                        <div className="mu-toggle-row">
                            <label className="mu-toggle-label">
                                <div className={`mu-toggle ${formData.isActive ? 'mu-toggle-on' : ''}`}
                                    onClick={() => setFormData(p => ({ ...p, isActive: !p.isActive }))}>
                                    <div className="mu-toggle-dot" />
                                </div>
                                <span>Account Status: <strong>{formData.isActive ? 'Active' : 'Inactive'}</strong></span>
                            </label>
                        </div>

                        <div className="mu-form-actions">
                            <button type="button" className="mu-cancel-form-btn" onClick={resetForm}>
                                Cancel
                            </button>
                            <button type="submit" className="mu-submit-btn" disabled={submitting}>
                                {submitting && <span className="mu-spinner" />}
                                {submitting ? (editId ? 'Updating…' : 'Creating…') : (editId ? '✏️ Update User' : '➕ Create User')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search Bar */}
            <div className="mu-search-row">
                <div className="mu-search-wrap">
                    <span className="mu-search-icon">🔍</span>
                    <input
                        className="mu-search-input"
                        type="search" placeholder="Search by name or email…"
                        value={searchQ} onChange={handleSearch}
                        id="mu-search"
                    />
                </div>
                <span className="mu-count">{users.length} user{users.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Users Table */}
            <div className="mu-table-card">
                {loading ? (
                    <div className="mu-loading">Loading users…</div>
                ) : users.length === 0 ? (
                    <div className="mu-empty">
                        <div className="mu-empty-icon">👤</div>
                        <p>No users found. Create one above!</p>
                    </div>
                ) : (
                    <div className="mu-table-wrap">
                        <table className="mu-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Department</th>
                                    <th>Semester</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td>
                                            <div className="mu-user-cell">
                                                <div className="mu-avatar">{u.avatar || u.name?.slice(0, 2).toUpperCase() || 'ST'}</div>
                                                <div>
                                                    <div className="mu-user-name">{u.name}</div>
                                                    <div className="mu-user-id">ID: {u.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="mu-email">{u.email}</td>
                                        <td>{u.department || '—'}</td>
                                        <td>{u.semester ? `Sem ${u.semester}` : '—'}</td>
                                        <td>
                                            <span className={`mu-status-badge ${u.isActive ? 'mu-status-active' : 'mu-status-inactive'}`}>
                                                {u.isActive ? '● Active' : '● Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="mu-actions">
                                                <button
                                                    className="mu-action-btn mu-edit-btn"
                                                    onClick={() => handleEdit(u)}
                                                    title="Edit user"
                                                >✏️</button>
                                                <button
                                                    className={`mu-action-btn ${u.isActive ? 'mu-deactivate-btn' : 'mu-activate-btn'}`}
                                                    onClick={() => handleToggleStatus(u.id, u.isActive)}
                                                    title={u.isActive ? 'Deactivate' : 'Activate'}
                                                >{u.isActive ? '🚫' : '✅'}</button>
                                                <button
                                                    className="mu-action-btn mu-delete-btn"
                                                    onClick={() => handleDelete(u.id, u.name)}
                                                    title="Delete user"
                                                >🗑️</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
