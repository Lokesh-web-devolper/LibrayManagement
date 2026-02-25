import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resourcesAPI, usersAPI, statsAPI, authHelpers } from '../api/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const user = authHelpers.getUser();          // read from localStorage

    const [activeTab, setActiveTab] = useState('dashboard');
    const [resources, setResources] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ totalResources: 0, totalUsers: 0, totalDownloads: 0, pendingApprovals: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [rRes, uRes, sRes] = await Promise.all([
                resourcesAPI.getAll(),
                usersAPI.getAll(),
                statsAPI.get(),
            ]);
            setResources(rRes.data);
            setUsers(uRes.data);
            setStats(sRes.data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authHelpers.logout();
        navigate('/');
    };

    const handleApprove = async (id) => {
        await resourcesAPI.approve(id);
        setResources(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
        setStats(s => ({ ...s, pendingApprovals: Math.max(0, s.pendingApprovals - 1) }));
    };

    const handleReject = async (id) => {
        await resourcesAPI.reject(id);
        setResources(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
        setStats(s => ({ ...s, pendingApprovals: Math.max(0, s.pendingApprovals - 1) }));
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this resource?')) return;
        await resourcesAPI.delete(id);
        setResources(prev => prev.filter(r => r.id !== id));
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Delete this user?')) return;
        await usersAPI.delete(id);
        setUsers(prev => prev.filter(u => u.id !== id));
    };

    const pending = resources.filter(r => r.status === 'pending');

    return (
        <div className="ad-root">
            {/* Sidebar */}
            <aside className="ad-sidebar">
                <div className="ad-brand">
                    <span className="ad-brand-icon">🛡️</span>
                    <div>
                        <div className="ad-brand-name">EduVault</div>
                        <div className="ad-brand-sub">Admin Portal</div>
                    </div>
                </div>

                <nav className="ad-nav">
                    {[
                        { key: 'dashboard', icon: '🏠', label: 'Dashboard' },
                        { key: 'resources', icon: '📄', label: 'Manage Resources' },
                        { key: 'pending', icon: '⏳', label: `Pending (${pending.length})` },
                        { key: 'users', icon: '👥', label: 'Users' },
                        { key: 'analytics', icon: '📊', label: 'Analytics' },
                    ].map(item => (
                        <button key={item.key}
                            className={`ad-nav-btn ${activeTab === item.key ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.key)}>
                            <span>{item.icon}</span><span>{item.label}</span>
                        </button>
                    ))}

                    {/* Upload — navigate to /upload route */}
                    <button className="ad-nav-btn" onClick={() => navigate('/upload')}>
                        <span>⬆️</span><span>Upload Resource</span>
                    </button>
                </nav>

                <div className="ad-sidebar-bottom">
                    <div className="ad-user-info-sidebar">
                        <div className="ad-avatar">{user?.avatar || 'AD'}</div>
                        <div>
                            <div className="ad-user-name-sb">{user?.name || 'Admin'}</div>
                            <div className="ad-user-role-sb">Administrator</div>
                        </div>
                    </div>
                    {/* Logout → navigate to Landing and clear localStorage */}
                    <button className="ad-nav-btn ad-logout-btn" onClick={handleLogout}>
                        <span>🚪</span><span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="ad-main">
                {loading ? (
                    <div className="ad-loading">Loading data…</div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="ad-header">
                            <div>
                                <h1 className="ad-title">Admin Dashboard</h1>
                                <p className="ad-subtitle">Welcome back, {user?.name || 'Admin'} 👋</p>
                            </div>
                            <button className="ad-upload-btn" onClick={() => navigate('/upload')}>
                                ➕ Upload Resource
                            </button>
                        </div>

                        {/* Stats */}
                        {(activeTab === 'dashboard' || activeTab === 'analytics') && (
                            <div className="ad-stats">
                                {[
                                    { cls: 'ad-stat-violet', icon: '📄', num: stats.totalResources?.toLocaleString(), label: 'Total Resources', badge: '+12%' },
                                    { cls: 'ad-stat-indigo', icon: '👥', num: stats.totalUsers?.toLocaleString(), label: 'Total Users', badge: '+8%' },
                                    { cls: 'ad-stat-purple', icon: '⬇️', num: stats.totalDownloads?.toLocaleString(), label: 'Total Downloads', badge: '+24%' },
                                    { cls: 'ad-stat-orange', icon: '⏳', num: pending.length, label: 'Pending Approvals', badge: null },
                                ].map(s => (
                                    <div key={s.label} className={`ad-stat-card ${s.cls}`}>
                                        <div className="ad-stat-icon">{s.icon}</div>
                                        <div className="ad-stat-num">{s.num}</div>
                                        <div className="ad-stat-label">{s.label}</div>
                                        {s.badge && <div className="ad-stat-badge">{s.badge}</div>}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Resource Table */}
                        {(activeTab === 'dashboard' || activeTab === 'resources') && (
                            <div className="ad-table-card">
                                <div className="ad-table-head">
                                    <div>
                                        <h2 className="ad-table-title">Resource Management</h2>
                                        <p className="ad-table-sub">{resources.length} total resources</p>
                                    </div>
                                </div>
                                <div className="ad-table-wrap">
                                    <table className="ad-table">
                                        <thead>
                                            <tr><th>File Name</th><th>Uploader</th><th>Subject</th><th>Type</th><th>Date</th><th>Status</th><th>Downloads</th><th>Actions</th></tr>
                                        </thead>
                                        <tbody>
                                            {resources.map(r => (
                                                <tr key={r.id}>
                                                    <td className="ad-td-name">{r.fileName}</td>
                                                    <td>{r.uploader}</td>
                                                    <td><span className="ad-badge ad-badge-outline">{r.subject}</span></td>
                                                    <td><span className="ad-badge ad-badge-secondary">{r.fileType}</span></td>
                                                    <td>{new Date(r.uploadDate).toLocaleDateString()}</td>
                                                    <td>
                                                        <span className={`ad-status ad-status-${r.status}`}>
                                                            {r.status === 'approved' ? '✅ Approved' : r.status === 'pending' ? '⏳ Pending' : '❌ Rejected'}
                                                        </span>
                                                    </td>
                                                    <td>{r.downloads}</td>
                                                    <td>
                                                        <div className="ad-actions">
                                                            {r.status === 'pending' && (
                                                                <>
                                                                    <button className="ad-action-btn ad-approve" onClick={() => handleApprove(r.id)}>✅</button>
                                                                    <button className="ad-action-btn ad-reject" onClick={() => handleReject(r.id)}>❌</button>
                                                                </>
                                                            )}
                                                            <button className="ad-action-btn ad-delete" onClick={() => handleDelete(r.id)}>🗑️</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Pending Tab */}
                        {activeTab === 'pending' && (
                            <div className="ad-table-card">
                                <div className="ad-table-head">
                                    <h2 className="ad-table-title">⏳ Pending Approvals ({pending.length})</h2>
                                </div>
                                <div className="ad-table-wrap">
                                    <table className="ad-table">
                                        <thead>
                                            <tr><th>File Name</th><th>Uploader</th><th>Subject</th><th>Type</th><th>Date</th><th>Actions</th></tr>
                                        </thead>
                                        <tbody>
                                            {pending.map(r => (
                                                <tr key={r.id}>
                                                    <td className="ad-td-name">{r.fileName}</td>
                                                    <td>{r.uploader}</td>
                                                    <td><span className="ad-badge ad-badge-outline">{r.subject}</span></td>
                                                    <td><span className="ad-badge ad-badge-secondary">{r.fileType}</span></td>
                                                    <td>{new Date(r.uploadDate).toLocaleDateString()}</td>
                                                    <td>
                                                        <div className="ad-actions">
                                                            <button className="ad-action-btn ad-approve" onClick={() => handleApprove(r.id)}>✅ Approve</button>
                                                            <button className="ad-action-btn ad-reject" onClick={() => handleReject(r.id)}>❌ Reject</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {pending.length === 0 && <p className="ad-empty">No pending approvals 🎉</p>}
                                </div>
                            </div>
                        )}

                        {/* Users Tab */}
                        {activeTab === 'users' && (
                            <div className="ad-table-card">
                                <div className="ad-table-head">
                                    <h2 className="ad-table-title">👥 User Management</h2>
                                </div>
                                <div className="ad-table-wrap">
                                    <table className="ad-table">
                                        <thead>
                                            <tr><th>Name</th><th>Email</th><th>Semester</th><th>Join Date</th><th>Actions</th></tr>
                                        </thead>
                                        <tbody>
                                            {users.map(u => (
                                                <tr key={u.id}>
                                                    <td><div className="ad-user-cell"><span className="ad-avatar">{u.avatar}</span>{u.name}</div></td>
                                                    <td>{u.email}</td>
                                                    <td>{u.semester ? `Semester ${u.semester}` : '—'}</td>
                                                    <td>{new Date(u.joinDate).toLocaleDateString()}</td>
                                                    <td>
                                                        <button className="ad-action-btn ad-delete" onClick={() => handleDeleteUser(u.id)}>🗑️ Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}