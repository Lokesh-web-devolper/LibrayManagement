import React, { useState, useEffect, useCallback } from 'react';
import { getDownloads, recordDownload } from '../api/studentApi';
import './MyDownloadsTab.css';

const FILE_ICONS = { PDF: '📄', PPT: '📊', DOCX: '📝', DOC: '📝', default: '📁' };
const FILE_BADGE_CLASS = { PDF: 'ft-pdf', PPT: 'ft-ppt', DOCX: 'ft-docx', DOC: 'ft-docx' };

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function timeAgo(dateStr) {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

const FILTERS = [
    { key: 'all', label: 'All Time' },
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
];

export default function MyDownloadsTab({ studentId, onViewResource, onStatsRefresh }) {
    const [downloads, setDownloads] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [redownloading, setRedownloading] = useState(null);

    const fetchDownloads = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getDownloads(studentId, filter);
            setDownloads(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Failed to load downloads. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [studentId, filter]);

    useEffect(() => { fetchDownloads(); }, [fetchDownloads]);

    const handleRedownload = async (dl) => {
        setRedownloading(dl.resourceId);
        try {
            await recordDownload(studentId, dl.resourceId);
            // Trigger file download
            if (dl.fileUrl) {
                const link = document.createElement('a');
                link.href = dl.fileUrl;
                link.download = dl.fileName || 'resource';
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            await fetchDownloads();
            if (onStatsRefresh) onStatsRefresh();
        } catch (err) {
            console.error('Re-download failed:', err);
        } finally {
            setRedownloading(null);
        }
    };

    return (
        <div className="mdt-root">
            {/* Header */}
            <div className="mdt-header">
                <div>
                    <h2 className="mdt-title">My Downloads</h2>
                    <p className="mdt-subtitle">View and manage your download history</p>
                </div>
                <div className="mdt-badge-wrap">
                    <span className="mdt-total-badge">{downloads.length} {downloads.length === 1 ? 'file' : 'files'}</span>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="mdt-filters">
                {FILTERS.map(f => (
                    <button
                        key={f.key}
                        className={`mdt-filter-pill${filter === f.key ? ' active' : ''}`}
                        onClick={() => setFilter(f.key)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="mdt-loading-wrap">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="mdt-skeleton">
                            <div className="mdt-sk-icon"></div>
                            <div className="mdt-sk-lines">
                                <div className="mdt-sk-line mdt-sk-title"></div>
                                <div className="mdt-sk-line mdt-sk-sub"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="mdt-error-card">
                    <div className="mdt-error-icon">⚠️</div>
                    <div className="mdt-error-msg">{error}</div>
                    <button className="mdt-retry-btn" onClick={fetchDownloads}>Try Again</button>
                </div>
            ) : downloads.length === 0 ? (
                <div className="mdt-empty">
                    <div className="mdt-empty-icon">📭</div>
                    <div className="mdt-empty-title">No downloads yet</div>
                    <div className="mdt-empty-sub">
                        {filter === 'all'
                            ? 'Download resources from All Resources to see them here.'
                            : `No downloads found for "${FILTERS.find(f => f.key === filter)?.label}". Try a different time range.`}
                    </div>
                </div>
            ) : (
                <div className="mdt-list">
                    {downloads.map(dl => (
                        <div key={dl.id} className="mdt-card">
                            <div className="mdt-card-left">
                                <div className="mdt-file-icon-wrap">
                                    <span className="mdt-file-icon">{FILE_ICONS[dl.fileType] || FILE_ICONS.default}</span>
                                </div>
                            </div>
                            <div className="mdt-card-body">
                                <div className="mdt-card-top-row">
                                    <h3 className="mdt-filename">{dl.fileName}</h3>
                                    <span className="mdt-time-ago">{timeAgo(dl.downloadedAt)}</span>
                                </div>
                                <div className="mdt-meta-row">
                                    <span className={`mdt-ft-badge ${FILE_BADGE_CLASS[dl.fileType] || 'ft-default'}`}>
                                        {dl.fileType}
                                    </span>
                                    {dl.category && <span className="mdt-meta-tag">{dl.category}</span>}
                                    {dl.subject && <span className="mdt-meta-tag">{dl.subject}</span>}
                                    {dl.semester && <span className="mdt-meta-tag">Sem {dl.semester}</span>}
                                    <span className="mdt-dl-count">⬇️ Downloaded {dl.downloadCount}×</span>
                                </div>
                                <div className="mdt-date-row">
                                    <span className="mdt-date">🗓 {formatDate(dl.downloadedAt)}</span>
                                </div>
                                {dl.tags && dl.tags.length > 0 && (
                                    <div className="mdt-tags-row">
                                        {dl.tags.map(tag => <span key={tag} className="mdt-tag">#{tag}</span>)}
                                    </div>
                                )}
                            </div>
                            <div className="mdt-card-actions">
                                <button
                                    className="mdt-btn mdt-btn-primary"
                                    onClick={() => handleRedownload(dl)}
                                    disabled={redownloading === dl.resourceId}
                                >
                                    {redownloading === dl.resourceId ? '⏳ Loading…' : '⬇️ Re-download'}
                                </button>
                                {onViewResource && (
                                    <button
                                        className="mdt-btn mdt-btn-ghost"
                                        onClick={() => onViewResource(dl.resourceId)}
                                    >
                                        👁 View Details
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
