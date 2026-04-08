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
            {/* Ambient glow orbs */}
            <div className="al-blob al-blob-1" />
            <div className="al-blob al-blob-2" />

            <div className="al-grid">
                {/* Single centered glass card — no left panel */}
                <div className="al-right">
                    <div className="al-form-card">

                        {/* ── KL EduVault Logo ── */}
                        <div className="al-logo">
                            <div className="al-logo-icon">📚</div>
                            <div className="al-logo-text">
                                <span className="al-logo-primary">KL EduVault</span>
                                <span className="al-logo-sub">KL University</span>
                            </div>
                        </div>

                        <div className="al-divider" />

                        <div className="al-badge" style={{ marginTop: '1.25rem' }}>🛡️ Admin Portal</div>
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
                    </div>
                </div>
            </div>
        </div>
    );
}
