import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resourcesAPI, authHelpers } from '../api/api';
import './StudentDashboard.css';

export default function StudentDashboard() {
    const navigate = useNavigate();
    const user = authHelpers.getUser();          // read from localStorage

    const [activeTab, setActiveTab] = useState('dashboard');
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subject, setSubject] = useState('all');
    const [semester, setSemester] = useState('all');
    const [fileType, setFileType] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => { fetchResources(); }, []);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const res = await resourcesAPI.getAll();
            setResources(res.data.filter(r => r.status === 'approved'));
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

    const handleDownload = async (resource) => {
        await resourcesAPI.incrementDownload(resource.id, resource.downloads);
        setResources(prev =>
            prev.map(r => r.id === resource.id ? { ...r, downloads: r.downloads + 1 } : r)
        );
        alert(`Downloading: ${resource.fileName}`);
    };

    const handleViewResource = (id) => {
        navigate(`/resource/${id}`);
    };

    const filtered = resources.filter(r => {
        if (subject !== 'all' && r.subject !== subject) return false;
        if (semester !== 'all' && r.semester !== semester) return false;
        if (fileType !== 'all' && r.fileType !== fileType) return false;
        if (search && !r.fileName.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const subjects = [...new Set(resources.map(r => r.subject))];
    const semesters = [...new Set(resources.map(r => r.semester))].sort();

    return (
        <div className="sd-root">
            {/* Sidebar */}
            <aside className="sd-sidebar">
                <div className="sd-brand">
                    <span className="sd-brand-icon">📚</span>
                    <div>
                        <div className="sd-brand-name">EduVault</div>
                        <div className="sd-brand-sub">Student Portal</div>
                    </div>
                </div>

                <nav className="sd-nav">
                    {[
                        { key: 'dashboard', icon: '🏠', label: 'Dashboard' },
                        { key: 'all', icon: '📋', label: 'All Resources' },
                        { key: 'downloads', icon: '⬇️', label: 'My Downloads' },
                    ].map(item => (
                        <button key={item.key}
                            className={`sd-nav-btn ${activeTab === item.key ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.key)}>
                            <span>{item.icon}</span><span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="sd-quick-stats">
                    <div className="sd-qs-label">Quick Stats</div>
                    <div className="sd-qs-row"><span>Available</span><span className="sd-qs-num">{resources.length}</span></div>
                    <div className="sd-qs-row"><span>Subjects</span> <span className="sd-qs-num">{subjects.length}</span></div>
                </div>

                <div className="sd-sidebar-bottom">
                    <div className="sd-user-info">
                        <div className="sd-user-avatar">{user?.avatar || 'ST'}</div>
                        <div>
                            <div className="sd-user-name">{user?.name || 'Student'}</div>
                            <div className="sd-user-role">Student — Sem {user?.semester || '?'}</div>
                        </div>
                    </div>
                    {/* Logout clears localStorage and redirects to Landing */}
                    <button className="sd-logout-btn" onClick={handleLogout}>🚪 Logout</button>
                </div>
            </aside>

            {/* Main */}
            <main className="sd-main">
                {/* Header */}
                <div className="sd-header">
                    <div>
                        <h1 className="sd-title">
                            {activeTab === 'dashboard' ? 'Dashboard' : activeTab === 'downloads' ? 'My Downloads' : 'All Resources'}
                        </h1>
                        <p className="sd-subtitle">Welcome back, {user?.name || 'Student'} 👋</p>
                    </div>
                    <div className="sd-search-wrap">
                        <span className="sd-search-icon">🔍</span>
                        <input className="sd-search" placeholder="Search resources…"
                            value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>

                {loading ? <div className="sd-loading">Loading resources…</div> : (
                    <>
                        {/* Dashboard stats */}
                        {activeTab === 'dashboard' && (
                            <div className="sd-stats">
                                <div className="sd-stat-card sd-indigo">
                                    <div className="sd-stat-icon">📋</div>
                                    <div className="sd-stat-num">{resources.length}</div>
                                    <div className="sd-stat-label">Available Resources</div>
                                </div>
                                <div className="sd-stat-card sd-purple">
                                    <div className="sd-stat-icon">📚</div>
                                    <div className="sd-stat-num">{subjects.length}</div>
                                    <div className="sd-stat-label">Active Subjects</div>
                                </div>
                                <div className="sd-stat-card sd-teal">
                                    <div className="sd-stat-icon">🎓</div>
                                    <div className="sd-stat-num">Sem {user?.semester || '?'}</div>
                                    <div className="sd-stat-label">Current Semester</div>
                                </div>
                            </div>
                        )}

                        {/* Filters */}
                        {activeTab !== 'dashboard' && (
                            <div className="sd-filters">
                                <div className="sd-filter-group">
                                    <label className="sd-filter-label">Subject</label>
                                    <select className="sd-select" value={subject} onChange={e => setSubject(e.target.value)}>
                                        <option value="all">All Subjects</option>
                                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="sd-filter-group">
                                    <label className="sd-filter-label">Semester</label>
                                    <select className="sd-select" value={semester} onChange={e => setSemester(e.target.value)}>
                                        <option value="all">All Semesters</option>
                                        {semesters.map(s => <option key={s} value={s}>Semester {s}</option>)}
                                    </select>
                                </div>
                                <div className="sd-filter-group">
                                    <label className="sd-filter-label">File Type</label>
                                    <select className="sd-select" value={fileType} onChange={e => setFileType(e.target.value)}>
                                        <option value="all">All Types</option>
                                        <option value="PDF">PDF</option>
                                        <option value="PPT">PPT</option>
                                        <option value="DOCX">DOCX</option>
                                    </select>
                                </div>
                                <button className="sd-clear-btn" onClick={() => { setSubject('all'); setSemester('all'); setFileType('all'); setSearch(''); }}>
                                    Clear Filters
                                </button>
                            </div>
                        )}

                        {/* Resources grid */}
                        {activeTab !== 'dashboard' && (
                            <>
                                <p className="sd-count">Showing {filtered.length} of {resources.length} resources</p>
                                <div className="sd-grid">
                                    {filtered.map(r => (
                                        <div key={r.id} className="sd-card" onClick={() => handleViewResource(r.id)}>
                                            <div className="sd-card-top">
                                                <span className="sd-file-icon">{r.fileType === 'PDF' ? '📄' : r.fileType === 'PPT' ? '📊' : '📝'}</span>
                                                <span className={`sd-ft-badge ft-${r.fileType.toLowerCase()}`}>{r.fileType}</span>
                                            </div>
                                            <h3 className="sd-card-title">{r.fileName}</h3>
                                            <div className="sd-card-tags">
                                                <span className="sd-tag">{r.subject}</span>
                                                <span className="sd-tag">Sem {r.semester}</span>
                                            </div>
                                            <div className="sd-card-footer">
                                                <span className="sd-dl-count">⬇️ {r.downloads} downloads</span>
                                                <button className="sd-dl-btn" onClick={e => { e.stopPropagation(); handleDownload(r); }}>
                                                    ⬇️ Download
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {filtered.length === 0 && <p className="sd-empty">No resources found. Try clearing filters.</p>}
                                </div>
                            </>
                        )}

                        {/* Dashboard — recent resources */}
                        {activeTab === 'dashboard' && (
                            <>
                                <h2 className="sd-section-title">Recent Resources</h2>
                                <div className="sd-grid">
                                    {resources.slice(0, 6).map(r => (
                                        <div key={r.id} className="sd-card" onClick={() => handleViewResource(r.id)}>
                                            <div className="sd-card-top">
                                                <span className="sd-file-icon">{r.fileType === 'PDF' ? '📄' : r.fileType === 'PPT' ? '📊' : '📝'}</span>
                                                <span className={`sd-ft-badge ft-${r.fileType.toLowerCase()}`}>{r.fileType}</span>
                                            </div>
                                            <h3 className="sd-card-title">{r.fileName}</h3>
                                            <div className="sd-card-tags">
                                                <span className="sd-tag">{r.subject}</span>
                                                <span className="sd-tag">Sem {r.semester}</span>
                                            </div>
                                            <div className="sd-card-footer">
                                                <span className="sd-dl-count">⬇️ {r.downloads}</span>
                                                <button className="sd-dl-btn" onClick={e => { e.stopPropagation(); handleDownload(r); }}>Download</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
