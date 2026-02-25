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
            setError('Connection failed. Make sure json-server is running on port 3001.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="sl-root">
            <div className="sl-blob sl-blob-1" />
            <div className="sl-blob sl-blob-2" />

            <div className="sl-grid">
                {/* Left panel */}
                <div className="sl-left">
                    <div className="sl-left-card">
                        <div className="sl-left-icon">📚</div>
                        <h2 className="sl-left-h2">Your Learning Library Awaits</h2>
                        <p className="sl-left-p">
                            Access thousands of quality academic resources. Search, download, and study smarter.
                        </p>
                        <div className="sl-features">
                            {[
                                { icon: '🔍', title: 'Smart Search', sub: 'Find resources instantly with filters' },
                                { icon: '⬇️', title: 'Easy Downloads', sub: 'Download PDFs, PPTs, and documents' },
                                { icon: '⭐', title: 'Bookmark Favorites', sub: 'Save resources for quick access' },
                            ].map((f, i) => (
                                <div className="sl-feature-row" key={i}>
                                    <div className="sl-feature-icon">{f.icon}</div>
                                    <div>
                                        <div className="sl-feature-title">{f.title}</div>
                                        <div className="sl-feature-sub">{f.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <img
                            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=80"
                            alt="Library"
                            className="sl-left-img"
                        />
                    </div>
                </div>

                {/* Right form */}
                <div className="sl-right">
                    <div className="sl-form-card">
                        <div className="sl-badge">📖 Student Portal</div>
                        <h1 className="sl-h1">Welcome Back</h1>
                        <p className="sl-desc">Sign in to access your academic resource library</p>

                        {error && <div className="sl-error">⚠️ {error}</div>}

                        <form onSubmit={handleSubmit} className="sl-form">
                            <div className="sl-field">
                                <label className="sl-label" htmlFor="sl-email">Email Address</label>
                                <div className="sl-input-wrap">
                                    <span className="sl-input-icon">✉️</span>
                                    <input id="sl-email" type="email" placeholder="student@university.edu"
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
                                {isLoading ? 'Signing in…' : 'Sign In to EduVault →'}
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

                        {/* Demo credentials hint */}
                        <div className="sl-hint">
                            <strong>Demo:</strong> alice@university.edu / student123
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
