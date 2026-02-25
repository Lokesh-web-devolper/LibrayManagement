import React from 'react';
import './Navigation.css';

export default function Navigation({ onSearch, userType = 'guest', onNavigate, user }) {
    return (
        <nav className="nav-bar">
            <div className="nav-inner">
                {/* Logo */}
                <div className="nav-logo" onClick={() => onNavigate && onNavigate('landing')}>
                    <span className="nav-logo-icon">📚</span>
                    <span className="nav-logo-text">EduVault</span>
                </div>

                {/* Search — only for logged-in users */}
                {userType !== 'guest' && (
                    <div className="nav-search-wrap">
                        <span className="nav-search-icon">🔍</span>
                        <input
                            type="search"
                            className="nav-search"
                            placeholder="Search resources…"
                            onChange={e => onSearch && onSearch(e.target.value)}
                        />
                    </div>
                )}

                {/* Actions */}
                <div className="nav-actions">
                    {userType === 'guest' ? (
                        <>
                            <button className="nav-ghost-btn" onClick={() => onNavigate && onNavigate('student-login')}>Student Login</button>
                            <button className="nav-primary-btn" onClick={() => onNavigate && onNavigate('admin-login')}>Admin Login</button>
                        </>
                    ) : (
                        <>
                            <div className="nav-notif">
                                🔔 <span className="nav-notif-dot">3</span>
                            </div>
                            <div className="nav-avatar">
                                {user?.avatar || (userType === 'admin' ? 'AD' : 'ST')}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
