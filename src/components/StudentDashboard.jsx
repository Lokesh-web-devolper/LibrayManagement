import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { resourcesAPI, authHelpers } from '../api/api';
import { getQuickStats, recordDownload, addBookmark, removeBookmark } from '../api/studentApi';
import MyDownloadsTab from './MyDownloadsTab';
import CategoriesTab from './CategoriesTab';
import BookmarksTab from './BookmarksTab';
import './StudentDashboard.css';

const NAV_ITEMS = [
    { key: 'dashboard',    icon: '🏠', label: 'Dashboard' },
    { key: 'all',          icon: '📋', label: 'All Resources' },
    { key: 'my-downloads', icon: '⬇️', label: 'My Downloads',  statKey: 'myDownloads' },
    { key: 'categories',   icon: '🗂',  label: 'Categories' },
    { key: 'bookmarks',    icon: '🔖', label: 'Bookmarks',     statKey: 'bookmarked' },
];

export default function StudentDashboard() {
    const navigate = useNavigate();
    const user = authHelpers.getUser();
    const studentId = user?.id;

    const [activeTab, setActiveTab] = useState('dashboard');
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subject, setSubject] = useState('all');
    const [semester, setSemester] = useState('all');
    const [fileType, setFileType] = useState('all');
    const [search, setSearch] = useState('');

    // Quick stats
    const [quickStats, setQuickStats] = useState({ totalResources: 0, myDownloads: 0, bookmarked: 0 });
    const [statsLoading, setStatsLoading] = useState(false);

    // Bookmarked resource IDs set (for All Resources tab bookmark toggle)
    const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
    const [bookmarkLoading, setBookmarkLoading] = useState(null);

    useEffect(() => { fetchResources(); }, []);

    useEffect(() => {
        if (studentId) {
            fetchQuickStats();
            fetchBookmarkedIds();
        }
    }, [studentId]);

    const fetchResources = async () => {
        setLoading(true);
        try {
            const res = await resourcesAPI.getAll();
            setResources(res.data.filter(r => r.status === 'approved'));
        } catch (err) {
            console.error('Fetch resources error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchQuickStats = useCallback(async () => {
        if (!studentId) return;
        setStatsLoading(true);
        try {
            const data = await getQuickStats(studentId);
            setQuickStats(data);
        } catch (err) {
            console.error('Quick stats error:', err);
        } finally {
            setStatsLoading(false);
        }
    }, [studentId]);

    const fetchBookmarkedIds = useCallback(async () => {
        if (!studentId) return;
        try {
            const { getBookmarks } = await import('../api/studentApi');
            const data = await getBookmarks(studentId);
            setBookmarkedIds(new Set((data || []).map(b => b.resourceId)));
        } catch (err) {
            console.error('Fetch bookmarks error:', err);
        }
    }, [studentId]);

    const handleLogout = () => {
        authHelpers.logout();
        navigate('/');
    };

    const handleDownload = async (resource) => {
        try {
            await resourcesAPI.incrementDownload(resource.id, resource.downloads);
            setResources(prev =>
                prev.map(r => r.id === resource.id ? { ...r, downloads: r.downloads + 1 } : r)
            );
            if (studentId) {
                await recordDownload(studentId, resource.id);
                fetchQuickStats();
            }
        } catch (err) {
            console.error('Download record error:', err);
        }
        const link = document.createElement('a');
        link.href = resource.fileUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
        link.download = resource.fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleToggleBookmark = async (resource) => {
        if (!studentId) return;
        const isBookmarked = bookmarkedIds.has(resource.id);
        setBookmarkLoading(resource.id);
        try {
            if (isBookmarked) {
                await removeBookmark(studentId, resource.id);
                setBookmarkedIds(prev => { const s = new Set(prev); s.delete(resource.id); return s; });
            } else {
                await addBookmark(studentId, resource.id);
                setBookmarkedIds(prev => new Set([...prev, resource.id]));
            }
            fetchQuickStats();
        } catch (err) {
            console.error('Bookmark toggle error:', err);
        } finally {
            setBookmarkLoading(null);
        }
    };

    const handleViewResource = (id) => navigate(`/resource/${id}`);

    const filtered = resources.filter(r => {
        if (subject !== 'all' && r.subject !== subject) return false;
        if (semester !== 'all' && r.semester !== semester) return false;
        if (fileType !== 'all' && r.fileType !== fileType) return false;
        if (search && !r.fileName.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const subjects = [...new Set(resources.map(r => r.subject))];
    const semesters = [...new Set(resources.map(r => r.semester))].sort();

    const renderResourceCard = (r) => {
        const isBookmarked = bookmarkedIds.has(r.id);
        return (
            <div key={r.id} className="sd-card" onClick={() => handleViewResource(r.id)}>
                <div className="sd-card-top">
                    <span className="sd-file-icon">{r.fileType === 'PDF' ? '📄' : r.fileType === 'PPT' ? '📊' : '📝'}</span>
                    <div className="sd-card-top-right">
                        <button
                            className={`sd-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this resource'}
                            onClick={e => { e.stopPropagation(); handleToggleBookmark(r); }}
                            disabled={bookmarkLoading === r.id}
                        >
                            {bookmarkLoading === r.id ? '⏳' : isBookmarked ? '🔖' : '🔗'}
                        </button>
                        <span className={`sd-ft-badge ft-${r.fileType?.toLowerCase()}`}>{r.fileType}</span>
                    </div>
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
        );
    };

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
                    {NAV_ITEMS.map(item => (
                        <button key={item.key}
                            className={`sd-nav-btn ${activeTab === item.key ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.key)}>
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                            {item.statKey && quickStats[item.statKey] > 0 && (
                                <span className="sd-nav-badge">{quickStats[item.statKey]}</span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Quick Stats Panel */}
                <div className="sd-quick-stats">
                    <div className="sd-qs-label">Quick Stats</div>
                    <div className="sd-qs-row">
                        <span>Total Resources</span>
                        <span className="sd-qs-num">
                            {statsLoading ? '…' : (quickStats.totalResources || resources.length)}
                        </span>
                    </div>
                    <div className="sd-qs-row">
                        <span>My Downloads</span>
                        <span className="sd-qs-num">{statsLoading ? '…' : quickStats.myDownloads}</span>
                    </div>
                    <div className="sd-qs-row">
                        <span>Bookmarked</span>
                        <span className="sd-qs-num">{statsLoading ? '…' : quickStats.bookmarked}</span>
                    </div>
                </div>

                <div className="sd-sidebar-bottom">
                    <div className="sd-user-info">
                        <div className="sd-user-avatar">{user?.avatar || 'ST'}</div>
                        <div>
                            <div className="sd-user-name">{user?.name || 'Student'}</div>
                            <div className="sd-user-role">Student — Sem {user?.semester || '?'}</div>
                        </div>
                    </div>
                    <button className="sd-logout-btn" onClick={handleLogout}>🚪 Logout</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="sd-main">
                {/* Header */}
                <div className="sd-header">
                    <div>
                        <h1 className="sd-title">
                            {activeTab === 'dashboard' ? 'Dashboard' :
                             activeTab === 'all' ? 'All Resources' :
                             activeTab === 'my-downloads' ? 'My Downloads' :
                             activeTab === 'categories' ? 'Browse Categories' :
                             'Bookmarks'}
                        </h1>
                        <p className="sd-subtitle">Welcome back, {user?.name || 'Student'} 👋</p>
                    </div>
                    {(activeTab === 'dashboard' || activeTab === 'all') && (
                        <div className="sd-search-wrap">
                            <span className="sd-search-icon">🔍</span>
                            <input className="sd-search" placeholder="Search resources…"
                                value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                    )}
                </div>

                {/* ── MY DOWNLOADS TAB ── */}
                {activeTab === 'my-downloads' && (
                    <MyDownloadsTab
                        studentId={studentId}
                        onViewResource={handleViewResource}
                        onStatsRefresh={fetchQuickStats}
                    />
                )}

                {/* ── CATEGORIES TAB ── */}
                {activeTab === 'categories' && (
                    <CategoriesTab
                        studentId={studentId}
                        onViewResource={handleViewResource}
                        onDownload={handleDownload}
                    />
                )}

                {/* ── BOOKMARKS TAB ── */}
                {activeTab === 'bookmarks' && (
                    <BookmarksTab
                        studentId={studentId}
                        onViewResource={handleViewResource}
                        onDownload={handleDownload}
                        onStatsRefresh={fetchQuickStats}
                    />
                )}

                {/* ── DASHBOARD & ALL RESOURCES (existing) ── */}
                {(activeTab === 'dashboard' || activeTab === 'all') && (
                    <>
                        {loading ? (
                            <div className="sd-loading">Loading resources…</div>
                        ) : (
                            <>
                                {/* Dashboard stat cards */}
                                {activeTab === 'dashboard' && (
                                    <div className="sd-stats">
                                        <div className="sd-stat-card sd-indigo">
                                            <div className="sd-stat-icon">📋</div>
                                            <div className="sd-stat-num">{resources.length}</div>
                                            <div className="sd-stat-label">Available Resources</div>
                                        </div>
                                        <div className="sd-stat-card sd-purple">
                                            <div className="sd-stat-icon">⬇️</div>
                                            <div className="sd-stat-num">{quickStats.myDownloads}</div>
                                            <div className="sd-stat-label">My Downloads</div>
                                        </div>
                                        <div className="sd-stat-card sd-teal">
                                            <div className="sd-stat-icon">🔖</div>
                                            <div className="sd-stat-num">{quickStats.bookmarked}</div>
                                            <div className="sd-stat-label">Bookmarked</div>
                                        </div>
                                    </div>
                                )}

                                {/* Filters (All Resources tab) */}
                                {activeTab === 'all' && (
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

                                {activeTab === 'all' && (
                                    <p className="sd-count">Showing {filtered.length} of {resources.length} resources</p>
                                )}

                                {/* Resource Grid */}
                                <div className="sd-grid">
                                    {(activeTab === 'all' ? filtered : resources.slice(0, 6)).map(renderResourceCard)}
                                    {activeTab === 'all' && filtered.length === 0 && (
                                        <p className="sd-empty">No resources found. Try clearing filters.</p>
                                    )}
                                </div>

                                {activeTab === 'dashboard' && resources.length > 0 && (
                                    <h2 className="sd-section-title" style={{ marginTop: '2rem' }}>Recent Resources</h2>
                                )}
                            </>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
