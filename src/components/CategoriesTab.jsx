import React, { useState, useEffect, useCallback } from 'react';
import { getCategories, getCategoryResources } from '../api/studentApi';
import './CategoriesTab.css';

// Map iconKey strings to emoji (no external icon lib needed)
const ICON_MAP = {
    code: '💻',
    calculator: '🧮',
    box: '⚙️',
    sparkles: '⚡',
    flask: '🧪',
    book: '📖',
    'file-text': '📄',
    layers: '🗂',
    bookmark: '🔖',
    archive: '📦',
    folder: '📁',
};

const FILE_ICONS = { PDF: '📄', PPT: '📊', DOCX: '📝', default: '📁' };
const FILE_BADGE_CLASS = { PDF: 'ft-pdf', PPT: 'ft-ppt', DOCX: 'ft-docx' };

export default function CategoriesTab({ studentId, onViewResource, onDownload }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Sub-view state for viewing resources under a category
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [catResources, setCatResources] = useState([]);
    const [catLoading, setCatLoading] = useState(false);
    const [catError, setCatError] = useState(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getCategories();
            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            setError('Failed to load categories. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    const handleCategoryClick = async (cat) => {
        setSelectedCategory(cat);
        setCatLoading(true);
        setCatError(null);
        try {
            const data = await getCategoryResources(cat.name);
            setCatResources(Array.isArray(data) ? data : []);
        } catch (err) {
            setCatError('Failed to load resources for this category.');
            console.error(err);
        } finally {
            setCatLoading(false);
        }
    };

    const handleBack = () => {
        setSelectedCategory(null);
        setCatResources([]);
        setCatError(null);
    };

    // ── Category Resources Sub-view ──────────────────────────────
    if (selectedCategory) {
        return (
            <div className="cat-root">
                <button className="cat-back-btn" onClick={handleBack}>
                    ← Back to Categories
                </button>

                <div className="cat-subview-header"
                    style={{ '--grad-start': selectedCategory.gradientStart, '--grad-end': selectedCategory.gradientEnd }}>
                    <span className="cat-subview-icon">
                        {ICON_MAP[selectedCategory.iconKey] || '📁'}
                    </span>
                    <div>
                        <h2 className="cat-subview-title">{selectedCategory.name}</h2>
                        <p className="cat-subview-sub">
                            {catResources.length} resource{catResources.length !== 1 ? 's' : ''} available
                        </p>
                    </div>
                </div>

                {catLoading ? (
                    <div className="cat-spin-wrap">
                        <div className="cat-spinner"></div>
                        <p>Loading resources…</p>
                    </div>
                ) : catError ? (
                    <div className="cat-error-card">
                        <span>⚠️</span> {catError}
                    </div>
                ) : catResources.length === 0 ? (
                    <div className="cat-empty">
                        <div className="cat-empty-icon">📭</div>
                        <div className="cat-empty-title">No resources in this category yet</div>
                    </div>
                ) : (
                    <div className="cat-res-grid">
                        {catResources.map(r => (
                            <div key={r.id} className="cat-res-card" onClick={() => onViewResource && onViewResource(r.id)}>
                                <div className="cat-res-top">
                                    <span className="cat-res-file-icon">{FILE_ICONS[r.fileType] || FILE_ICONS.default}</span>
                                    <span className={`cat-res-badge ${FILE_BADGE_CLASS[r.fileType] || ''}`}>{r.fileType}</span>
                                </div>
                                <h3 className="cat-res-title">{r.fileName}</h3>
                                <div className="cat-res-tags">
                                    {r.subject && <span className="cat-res-tag">{r.subject}</span>}
                                    {r.semester && <span className="cat-res-tag">Sem {r.semester}</span>}
                                </div>
                                <div className="cat-res-footer">
                                    <span className="cat-res-dl">⬇️ {r.downloads}</span>
                                    <button className="cat-res-dl-btn" onClick={e => { e.stopPropagation(); onDownload && onDownload(r); }}>
                                        Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // ── Category Cards Grid ──────────────────────────────────────
    return (
        <div className="cat-root">
            <div className="cat-header">
                <div>
                    <h2 className="cat-main-title">Browse Categories</h2>
                    <p className="cat-main-sub">Explore resources organized by subject</p>
                </div>
                <span className="cat-count-badge">{categories.length} categories</span>
            </div>

            {loading ? (
                <div className="cat-grid">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="cat-card-skeleton">
                            <div className="cat-sk-icon"></div>
                            <div className="cat-sk-line cat-sk-name"></div>
                            <div className="cat-sk-line cat-sk-count"></div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="cat-error-card">
                    <div className="cat-error-icon">⚠️</div>
                    <div>{error}</div>
                    <button className="cat-retry-btn" onClick={fetchCategories}>Try Again</button>
                </div>
            ) : categories.length === 0 ? (
                <div className="cat-empty">
                    <div className="cat-empty-icon">📚</div>
                    <div className="cat-empty-title">No categories available yet</div>
                    <div className="cat-empty-sub">Resources will be organized into categories as they are added.</div>
                </div>
            ) : (
                <div className="cat-grid">
                    {categories.map(cat => (
                        <button
                            key={cat.name}
                            className="cat-card"
                            style={{ '--grad-start': cat.gradientStart, '--grad-end': cat.gradientEnd }}
                            onClick={() => handleCategoryClick(cat)}
                        >
                            {cat.trending && (
                                <span className="cat-trending-badge">🔥 Trending</span>
                            )}
                            <div className="cat-card-icon">{ICON_MAP[cat.iconKey] || '📁'}</div>
                            <div className="cat-card-name">{cat.name}</div>
                            <div className="cat-card-count">
                                {cat.resourceCount} resource{cat.resourceCount !== 1 ? 's' : ''}
                            </div>
                            <div className="cat-card-arrow">→</div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
