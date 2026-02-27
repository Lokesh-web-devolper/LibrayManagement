import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { resourcesAPI, authHelpers } from '../api/api';
import ResourceCard from './ResourceCard';
import './ResourceDetails.css';

export default function ResourceDetails() {
    const navigate = useNavigate();
    const { id } = useParams();           // get :id from route /resource/:id
    const user = authHelpers.getUser();

    const [resource, setResource] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [rRes, allRes] = await Promise.all([
                    resourcesAPI.getById(id),
                    resourcesAPI.getAll(),
                ]);
                setResource(rRes.data);
                setRelated(allRes.data.filter(r =>
                    r.id !== id &&
                    r.subject === rRes.data.subject &&
                    r.status === 'approved'
                ).slice(0, 4));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleDownload = async () => {
        if (!resource) return;
        await resourcesAPI.incrementDownload(resource.id, resource.downloads);
        setResource(r => ({ ...r, downloads: r.downloads + 1 }));
        // Trigger a real browser download
        const link = document.createElement('a');
        link.href = resource.fileUrl || `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`;
        link.download = resource.fileName + (resource.fileType === 'PDF' ? '.pdf' : resource.fileType === 'PPT' ? '.pptx' : '.docx');
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleBack = () => {
        navigate(user?.role === 'admin' ? '/admin-dashboard' : '/student-dashboard');
    };

    if (loading) return <div className="rd-loading">Loading resource…</div>;
    if (!resource) return <div className="rd-loading">Resource not found.</div>;

    return (
        <div className="rd-root">
            <div className="rd-inner">
                <button className="rd-back" onClick={handleBack}>← Back</button>

                <div className="rd-layout">
                    <div className="rd-main">
                        <div className="rd-preview-card">
                            <div className="rd-preview">
                                <span className="rd-preview-icon">
                                    {resource.fileType === 'PDF' ? '📄' : resource.fileType === 'PPT' ? '📊' : '📝'}
                                </span>
                                <span className="rd-preview-label">{resource.fileType} Preview</span>
                            </div>
                            <h1 className="rd-title">{resource.fileName}</h1>
                            {resource.description && <p className="rd-description">{resource.description}</p>}
                            {resource.tags?.length > 0 && (
                                <div className="rd-tags">
                                    {resource.tags.map(t => <span key={t} className="rd-tag">🏷️ {t}</span>)}
                                </div>
                            )}
                            <button className="rd-dl-btn" onClick={handleDownload}>
                                ⬇️ Download Resource
                            </button>
                        </div>

                        {related.length > 0 && (
                            <div>
                                <h2 className="rd-related-title">Related Resources</h2>
                                <div className="rd-related-grid">
                                    {related.map(r => (
                                        <ResourceCard
                                            key={r.id}
                                            resource={r}
                                            onDownload={() => { }}
                                            onView={(rid) => navigate(`/resource/${rid}`)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <aside className="rd-sidebar">
                        <div className="rd-info-card">
                            <h3 className="rd-info-title">Resource Information</h3>
                            {[
                                { label: 'Uploaded by', value: resource.uploader, icon: '👤' },
                                { label: 'Upload Date', value: new Date(resource.uploadDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), icon: '📅' },
                                { label: 'Category', value: resource.category, icon: '📁' },
                                { label: 'Downloads', value: resource.downloads?.toLocaleString(), icon: '⬇️' },
                            ].map(({ label, value, icon }) => (
                                <div key={label} className="rd-meta-row">
                                    <span className="rd-meta-icon">{icon}</span>
                                    <div>
                                        <div className="rd-meta-label">{label}</div>
                                        <div className="rd-meta-value">{value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="rd-details-card">
                            <h3 className="rd-info-title">File Details</h3>
                            {[
                                { label: 'Subject', value: resource.subject },
                                { label: 'Semester', value: `Semester ${resource.semester}` },
                                { label: 'File Type', value: resource.fileType },
                                { label: 'Size', value: resource.size },
                                { label: 'Pages', value: resource.pages },
                                { label: 'Language', value: resource.language },
                            ].map(({ label, value }) => (
                                <div key={label} className="rd-detail-row">
                                    <span className="rd-detail-label">{label}</span>
                                    <span className="rd-detail-value">{value}</span>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
