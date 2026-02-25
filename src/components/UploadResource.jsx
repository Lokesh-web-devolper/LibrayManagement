import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resourcesAPI, authHelpers } from '../api/api';
import './UploadResource.css';

export default function UploadResource() {
    const navigate = useNavigate();
    const user = authHelpers.getUser();
    const backPath = user?.role === 'admin' ? '/admin-dashboard' : '/student-dashboard';

    const [selectedFile, setSelectedFile] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState('');
    const [form, setForm] = useState({ title: '', subject: '', semester: '', category: '', description: '' });
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === 'dragenter' || e.type === 'dragover');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files[0]) setSelectedFile(e.dataTransfer.files[0]);
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) setSelectedFile(e.target.files[0]);
    };

    const addTag = () => {
        const t = currentTag.trim();
        if (t && !tags.includes(t)) { setTags([...tags, t]); setCurrentTag(''); }
    };

    const getFileType = (file) => {
        const ext = file.name.split('.').pop().toUpperCase();
        if (['PPT', 'PPTX'].includes(ext)) return 'PPT';
        if (['DOC', 'DOCX'].includes(ext)) return 'DOCX';
        return 'PDF';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;
        setUploading(true);

        try {
            const newResource = {
                id: Date.now().toString(),
                fileName: form.title || selectedFile.name,
                subject: form.subject,
                semester: form.semester,
                fileType: getFileType(selectedFile),
                downloads: 0,
                uploadDate: new Date().toISOString().split('T')[0],
                uploader: user?.name || 'Current User',
                category: form.category,
                tags,
                status: 'pending',
                description: form.description,
                size: `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB`,
                pages: 0,
                language: 'English',
            };

            await resourcesAPI.create(newResource);
            setSuccess(true);
            setTimeout(() => navigate(backPath), 1500);
        } catch (err) {
            alert('Upload failed. Is json-server running on port 3001?');
        } finally {
            setUploading(false);
        }
    };

    if (success) return (
        <div className="ur-success">
            <span className="ur-success-icon">✅</span>
            <h2>Resource Uploaded!</h2>
            <p>Pending admin approval. Redirecting…</p>
        </div>
    );

    return (
        <div className="ur-root">
            <div className="ur-inner">
                <button className="ur-back" onClick={() => navigate(backPath)}>
                    ← Back to Dashboard
                </button>

                <div className="ur-card">
                    <div className="ur-card-header">
                        <h1 className="ur-h1">Upload New Resource</h1>
                        <p className="ur-desc">Share academic materials. All uploads go through admin approval.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="ur-form">
                        {/* Drop zone */}
                        <div
                            className={`ur-dropzone ${dragActive ? 'active' : ''} ${selectedFile ? 'has-file' : ''}`}
                            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                        >
                            <input type="file" id="ur-file" className="ur-file-input" onChange={handleFileChange}
                                accept=".pdf,.ppt,.pptx,.doc,.docx" />
                            {!selectedFile ? (
                                <label htmlFor="ur-file" className="ur-drop-label">
                                    <div className="ur-drop-icon">⬆️</div>
                                    <p className="ur-drop-title">Drop your file here, or <span className="ur-browse">browse</span></p>
                                    <p className="ur-drop-sub">PDF, PPT, PPTX, DOC, DOCX — Max 50 MB</p>
                                </label>
                            ) : (
                                <div className="ur-file-preview">
                                    <span className="ur-file-icon">📄</span>
                                    <div className="ur-file-info">
                                        <p className="ur-file-name">{selectedFile.name}</p>
                                        <p className="ur-file-size">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <button type="button" className="ur-remove-btn" onClick={() => setSelectedFile(null)}>✕</button>
                                </div>
                            )}
                        </div>

                        <div className="ur-fields">
                            <div className="ur-field">
                                <label className="ur-label">Resource Title</label>
                                <input className="ur-input" placeholder="e.g., Data Structures Complete Notes"
                                    value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                            </div>
                            <div className="ur-field">
                                <label className="ur-label">Subject</label>
                                <select className="ur-select" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required>
                                    <option value="">Select subject…</option>
                                    {['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Mechanical Engineering', 'Electrical Engineering', 'Electronics Engineering'].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="ur-field">
                                <label className="ur-label">Semester</label>
                                <select className="ur-select" value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })} required>
                                    <option value="">Select semester…</option>
                                    {['1', '2', '3', '4', '5', '6', '7', '8'].map(s => <option key={s} value={s}>Semester {s}</option>)}
                                </select>
                            </div>
                            <div className="ur-field">
                                <label className="ur-label">Category</label>
                                <select className="ur-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                                    <option value="">Select category…</option>
                                    {['Lecture Notes', 'Study Material', 'Presentations', 'Assignments', 'Textbooks', 'Solutions', 'Reference Material'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="ur-field">
                            <label className="ur-label">Description</label>
                            <textarea className="ur-textarea" rows={4} placeholder="Describe the content…"
                                value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                        </div>

                        <div className="ur-field">
                            <label className="ur-label">Tags</label>
                            <div className="ur-tag-row">
                                <input className="ur-input" placeholder="Add tag & press Enter"
                                    value={currentTag} onChange={e => setCurrentTag(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} />
                                <button type="button" className="ur-add-tag" onClick={addTag}>+ Add</button>
                            </div>
                            {tags.length > 0 && (
                                <div className="ur-tags">
                                    {tags.map(t => (
                                        <span key={t} className="ur-tag">
                                            {t} <button type="button" onClick={() => setTags(tags.filter(x => x !== t))}>✕</button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="ur-actions">
                            <button type="submit" className="ur-submit" disabled={!selectedFile || uploading}>
                                {uploading ? '⏳ Uploading…' : '⬆️ Upload Resource'}
                            </button>
                            <button type="button" className="ur-cancel" onClick={() => navigate(backPath)}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
