import React, { useState, useEffect, useCallback } from 'react';
import { getBookmarks, addBookmark, removeBookmark } from '../api/studentApi';
import './BookmarksTab.css';

const FILE_ICONS = { PDF: '📄', PPT: '📊', DOCX: '📝', DOC: '📝', default: '📁' };
const FILE_BADGE_CLASS = { PDF: 'ft-pdf', PPT: 'ft-ppt', DOCX: 'ft-docx' };

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function BookmarksTab({ studentId, onViewResource, onDownload, onStatsRefresh }) {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [removingId, setRemovingId] = useState(null);

    const fetchBookmarks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getBookmarks(studentId);
            setBookmarks(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Failed to load bookmarks. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [studentId]);

    useEffect(() => { fetchBookmarks(); }, [fetchBookmarks]);

    const handleRemoveBookmark = async (bm) => {
        setRemovingId(bm.resourceId);
        try {
            await removeBookmark(studentId, bm.resourceId);
            // Optimistic UI update
            setBookmarks(prev => prev.filter(b => b.resourceId !== bm.resourceId));
            if (onStatsRefresh) onStatsRefresh();
        } catch (err) {
            console.error('Remove bookmark failed:', err);
            // Re-fetch on failure
            await fetchBookmarks();
        } finally {
            setRemovingId(null);
        }
    };

    const handleDownload = async (bm) => {
        if (onDownload) {
            onDownload({
                id: bm.resourceId,
                fileName: bm.fileName,
                fileType: bm.fileType,
                fileUrl: bm.fileUrl,
                downloads: bm.downloads,
            });
        } else if (bm.fileUrl) {
            const link = document.createElement('a');
            link.href = bm.fileUrl;
            link.download = bm.fileName || 'resource';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="bmt-root">
            {/* Header */}
            <div className="bmt-header">
                <div>
                    <h2 className="bmt-title">Bookmarked Resources</h2>
                    <p className="bmt-subtitle">Your saved resources for quick access</p>
                </div>
                {!loading && !error && (
                    <span className="bmt-count-badge">{bookmarks.length} saved</span>
                )}
            </div>

            {/* Content */}
            {loading ? (
                <div className="bmt-grid">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bmt-skeleton">
                            <div className="bmt-sk-top">
                                <div className="bmt-sk-icon"></div>
                                <div className="bmt-sk-bookmark"></div>
                            </div>
                            <div className="bmt-sk-line bmt-sk-title"></div>
                            <div className="bmt-sk-line bmt-sk-sub"></div>
                            <div className="bmt-sk-line bmt-sk-sub2"></div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="bmt-error-card">
                    <div className="bmt-error-icon">⚠️</div>
                    <div className="bmt-error-msg">{error}</div>
                    <button className="bmt-retry-btn" onClick={fetchBookmarks}>Try Again</button>
                </div>
            ) : bookmarks.length === 0 ? (
                <div className="bmt-empty">
                    <div className="bmt-empty-icon">🔖</div>
                    <div className="bmt-empty-title">No bookmarks yet</div>
                    <div className="bmt-empty-sub">
                        Browse <strong>All Resources</strong> or <strong>Categories</strong> and bookmark resources you want to revisit.
                    </div>
                </div>
            ) : (
                <div className="bmt-grid">
                    {bookmarks.map(bm => (
                        <div key={bm.id} className="bmt-card">
                            {/* Bookmark toggle */}
                            <button
                                className={`bmt-bookmark-btn ${removingId === bm.resourceId ? 'removing' : ''}`}
                                title="Remove bookmark"
                                onClick={() => handleRemoveBookmark(bm)}
                                disabled={removingId === bm.resourceId}
                            >
                                {removingId === bm.resourceId ? '⏳' : '🔖'}
                            </button>

                            <div className="bmt-card-top">
                                <span className="bmt-file-icon">{FILE_ICONS[bm.fileType] || FILE_ICONS.default}</span>
                                <span className={`bmt-ft-badge ${FILE_BADGE_CLASS[bm.fileType] || 'ft-default'}`}>
                                    {bm.fileType}
                                </span>
                            </div>

                            <h3 className="bmt-card-title">{bm.fileName}</h3>

                            <div className="bmt-badges">
                                {bm.category && <span className="bmt-badge bmt-badge-cat">{bm.category}</span>}
                                {bm.semester && <span className="bmt-badge bmt-badge-sem">Sem {bm.semester}</span>}
                            </div>

                            <div className="bmt-meta">
                                <span className="bmt-dl-count">⬇️ {bm.downloads || 0} downloads</span>
                                {bm.uploadDate && (
                                    <span className="bmt-date">📅 {formatDate(bm.uploadDate)}</span>
                                )}
                            </div>

                            {bm.tags && bm.tags.length > 0 && (
                                <div className="bmt-tags">
                                    {bm.tags.slice(0, 4).map(tag => (
                                        <span key={tag} className="bmt-tag">#{tag}</span>
                                    ))}
                                </div>
                            )}

                            <div className="bmt-actions">
                                <button
                                    className="bmt-btn bmt-btn-ghost"
                                    onClick={() => onViewResource && onViewResource(bm.resourceId)}
                                >
                                    👁 Preview
                                </button>
                                <button
                                    className="bmt-btn bmt-btn-primary"
                                    onClick={() => handleDownload(bm)}
                                >
                                    ⬇️ Download
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
