import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, authHelpers } from '../api/api';
import './AdminLogin.css';

export default function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Fetch from http://localhost:3001/admins?email=...&password=...
            const user = await authAPI.adminLogin(email, password);

            if (user) {
                // Save to localStorage
                authHelpers.saveUser(user, 'admin');
                navigate('/admin-dashboard');
            } else {
                setError('Invalid Credentials. Please check your email and password.');
            }
        } catch (err) {
            setError('Connection failed. Make sure json-server is running on port 3001.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="al-root">
            <div className="al-blob al-blob-1" />
            <div className="al-blob al-blob-2" />

            <div className="al-grid">
                {/* Left panel */}
                <div className="al-left">
                    <div className="al-left-card">
                        <div className="al-left-icon">🛡️</div>
                        <h2 className="al-left-h2">Admin Access Portal</h2>
                        <p className="al-left-p">
                            Manage resources, monitor analytics, and oversee the entire EduVault platform.
                        </p>
                        <div className="al-features">
                            {[
                                { icon: '📁', title: 'Full Resource Control', sub: 'Upload, edit, and delete resources' },
                                { icon: '📊', title: 'Analytics Dashboard', sub: 'Track downloads and user activity' },
                                { icon: '👥', title: 'User Management', sub: 'Monitor and manage user accounts' },
                            ].map((f, i) => (
                                <div className="al-feature-row" key={i}>
                                    <div className="al-feature-icon">{f.icon}</div>
                                    <div>
                                        <div className="al-feature-title">{f.title}</div>
                                        <div className="al-feature-sub">{f.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <img
                            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80"
                            alt="Admin workspace"
                            className="al-left-img"
                        />
                    </div>
                </div>

                {/* Right form */}
                <div className="al-right">
                    <div className="al-form-card">
                        <div className="al-badge">🛡️ Admin Portal</div>
                        <h1 className="al-h1">Welcome Back</h1>
                        <p className="al-desc">Sign in to your admin account to manage EduVault</p>

                        {error && <div className="al-error">⚠️ {error}</div>}

                        <form onSubmit={handleSubmit} className="al-form">
                            <div className="al-field">
                                <label className="al-label" htmlFor="al-email">Email Address</label>
                                <div className="al-input-wrap">
                                    <span className="al-input-icon">✉️</span>
                                    <input id="al-email" type="email" placeholder="admin@eduvault.com"
                                        className="al-input" value={email}
                                        onChange={e => setEmail(e.target.value)} required />
                                </div>
                            </div>

                            <div className="al-field">
                                <label className="al-label" htmlFor="al-pass">Password</label>
                                <div className="al-input-wrap">
                                    <span className="al-input-icon">🔒</span>
                                    <input id="al-pass" type="password" placeholder="Enter your password"
                                        className="al-input" value={password}
                                        onChange={e => setPassword(e.target.value)} required />
                                </div>
                            </div>

                            <div className="al-row-between">
                                <label className="al-check-label">
                                    <input type="checkbox" /> Remember me
                                </label>
                                <button type="button" className="al-link">Forgot password?</button>
                            </div>

                            <button type="submit" className="al-submit-btn" disabled={isLoading}>
                                {isLoading && <span className="al-spinner" />}
                                {isLoading ? 'Signing in…' : 'Sign In to Admin Portal →'}
                            </button>

                            <button type="button" className="al-back-btn" onClick={() => navigate('/')}>
                                ← Back to Home
                            </button>
                        </form>

                        <p className="al-security-note">🔒 Protected with enterprise-grade security</p>

                        {/* Demo credentials hint */}
                        <div className="al-hint">
                            <strong>Demo:</strong> admin@eduvault.com / admin123
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
