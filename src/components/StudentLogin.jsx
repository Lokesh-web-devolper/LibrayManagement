import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, authHelpers } from '../api/api';
import './StudentLogin.css';

export default function StudentLogin() {
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
            // Fetch from http://localhost:3001/students?email=...&password=...
            const user = await authAPI.studentLogin(email, password);

            if (user) {
                // Save to localStorage
                authHelpers.saveUser(user, 'student');
                navigate('/student-dashboard');
            } else {
                setError('Invalid Credentials. Please check your email and password.');
            }
        } catch (err) {
            if (err.response?.status === 403) {
                setError('Your account is inactive. Please contact admin.');
            } else {
                setError('Connection failed. Make sure the backend server is running.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="sl-root">
            {/* Ambient glow orbs */}
            <div className="sl-blob sl-blob-1" />
            <div className="sl-blob sl-blob-2" />

            <div className="sl-grid">
                {/* Single centered glass card */}
                <div className="sl-right">
                    <div className="sl-form-card">

                        {/* ── KL EduVault Logo ── */}
                        <div className="sl-logo">
                            <div className="sl-logo-icon">📚</div>
                            <div className="sl-logo-text">
                                <span className="sl-logo-primary">KL EduVault</span>
                                <span className="sl-logo-sub">KL University</span>
                            </div>
                        </div>

                        <div className="sl-divider" />

                        <div className="sl-badge" style={{ marginTop: '1.25rem' }}>📖 Student Portal</div>
                        <h1 className="sl-h1">Welcome Back</h1>
                        <p className="sl-desc">Sign in to access your academic resource library</p>

                        {error && <div className="sl-error">⚠️ {error}</div>}

                        <form onSubmit={handleSubmit} className="sl-form">
                            <div className="sl-field">
                                <label className="sl-label" htmlFor="sl-email">Email Address</label>
                                <div className="sl-input-wrap">
                                    <span className="sl-input-icon">✉️</span>
                                    <input id="sl-email" type="email" placeholder="student@kluniversity.in"
                                        className="sl-input" value={email}
                                        onChange={e => setEmail(e.target.value)} required />
                                </div>
                            </div>

                            <div className="sl-field">
                                <label className="sl-label" htmlFor="sl-pass">Password</label>
                                <div className="sl-input-wrap">
                                    <span className="sl-input-icon">🔒</span>
                                    <input id="sl-pass" type="password" placeholder="Enter your password"
                                        className="sl-input" value={password}
                                        onChange={e => setPassword(e.target.value)} required />
                                </div>
                            </div>

                            <div className="sl-row-between">
                                <label className="sl-check-label">
                                    <input type="checkbox" /> Remember me
                                </label>
                                <button type="button" className="sl-link">Forgot password?</button>
                            </div>

                            <button type="submit" className="sl-submit-btn" disabled={isLoading}>
                                {isLoading && <span className="sl-spinner" />}
                                {isLoading ? 'Signing in…' : 'Sign In to KL EduVault →'}
                            </button>

                            <button type="button" className="sl-back-btn" onClick={() => navigate('/')}>
                                ← Back to Home
                            </button>
                        </form>

                        <p className="sl-signup">
                            Admin?{' '}
                            <button className="sl-link" onClick={() => navigate('/admin-login')}>
                                Go to Admin Login
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
