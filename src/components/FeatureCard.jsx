import React from 'react';
import './FeatureCard.css';

export default function FeatureCard({ icon, title, description }) {
    return (
        <div className="fc-card">
            <div className="fc-overlay" />
            <div className="fc-content">
                <div className="fc-icon-wrap">{icon}</div>
                <h3 className="fc-title">{title}</h3>
                <p className="fc-desc">{description}</p>
            </div>
        </div>
    );
}
