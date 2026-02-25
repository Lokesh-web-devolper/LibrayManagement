import React from 'react';
import './ResourceCard.css';

export default function ResourceCard({ resource, onDownload, onView }) {
    const icons = { PDF: '📄', PPT: '📊', DOCX: '📝', DOC: '📝' };
    const icon = icons[resource.fileType] || '📁';

    return (
        <div className="rc-card" onClick={() => onView && onView(resource.id)}>
            <div className="rc-top">
                <div className={`rc-icon-wrap rc-ft-${resource.fileType?.toLowerCase()}`}>{icon}</div>
                <span className={`rc-ft-badge rc-ft-${resource.fileType?.toLowerCase()}`}>{resource.fileType}</span>
            </div>
            <h3 className="rc-title">{resource.fileName}</h3>
            <div className="rc-tags">
                <span className="rc-tag">{resource.subject}</span>
                <span className="rc-tag">Sem {resource.semester}</span>
            </div>
            <div className="rc-footer">
                <span className="rc-dl-count">⬇️ {resource.downloads}</span>
                <button className="rc-dl-btn" onClick={e => { e.stopPropagation(); onDownload && onDownload(resource); }}>
                    ⬇️ Download
                </button>
            </div>
        </div>
    );
}
