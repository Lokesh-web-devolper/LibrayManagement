import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="lp-root">
            {/* Background blobs */}
            <div className="lp-bg">
                <div className="lp-blob lp-blob-1" />
                <div className="lp-blob lp-blob-2" />
                <div className="lp-blob lp-blob-3" />
            </div>

            {/* Navbar */}
            <header className="lp-navbar">
                <div className="lp-nav-inner">
                    <div className="lp-brand">
                        <span className="lp-brand-icon">📚</span>
                        <span className="lp-brand-name">EduVault</span>
                    </div>

                    <nav className={`lp-nav-links ${menuOpen ? 'open' : ''}`}>
                        <button className="lp-nav-btn" onClick={() => { document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); }}>Features</button>
                        <button className="lp-nav-btn" onClick={() => { document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); }}>About</button>
                        <button className="lp-nav-btn" onClick={() => { document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false); }}>Contact</button>
                        <button className="lp-cta-nav" onClick={() => navigate('/student-login')}>Get Started</button>
                    </nav>

                    <button className="lp-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                        <span /><span /><span />
                    </button>
                </div>
            </header>

            {/* Hero */}
            <section className="lp-hero">
                <div className="lp-hero-inner">
                    {/* Left */}
                    <div className="lp-hero-left">
                        <div className="lp-badge">
                            <span className="lp-badge-icon">📖</span>
                            Academic Resource Management
                        </div>

                        <h1 className="lp-h1">
                            Your Smart Digital{' '}
                            <span className="lp-gradient-text">Academic Library</span>
                        </h1>

                        <p className="lp-hero-desc">
                            Centralized access to quality educational resources. Search, download,
                            and manage study materials effortlessly—all in one place.
                        </p>

                        <div className="lp-hero-cta">
                            {/* "Get Started" → Student Login */}
                            <button className="lp-btn-primary" onClick={() => navigate('/student-login')}>
                                Get Started <span>→</span>
                            </button>
                            {/* "Admin Dashboard" → Admin Login */}
                            <button className="lp-btn-secondary" onClick={() => navigate('/admin-login')}>
                                Admin Dashboard
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="lp-stats">
                            <div className="lp-stat-card">
                                <div className="lp-stat-num lp-grad-violet">10,000+</div>
                                <div className="lp-stat-label">Resources</div>
                            </div>
                            <div className="lp-stat-card">
                                <div className="lp-stat-num lp-grad-indigo">2,500+</div>
                                <div className="lp-stat-label">Active Users</div>
                            </div>
                            <div className="lp-stat-card">
                                <div className="lp-stat-num lp-grad-purple">50+</div>
                                <div className="lp-stat-label">Departments</div>
                            </div>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="lp-hero-right">
                        <div className="lp-img-wrap">
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=80"
                                alt="Students studying"
                                className="lp-hero-img"
                            />
                            <div className="lp-img-overlay" />
                        </div>

                        <div className="lp-float lp-float-tl lp-float-anim-1">
                            <div className="lp-float-icon" style={{ background: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }}>🔍</div>
                            <div><div className="lp-float-title">Search Books</div><div className="lp-float-sub">Find anything fast</div></div>
                        </div>
                        <div className="lp-float lp-float-tr lp-float-anim-2">
                            <div className="lp-float-icon" style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>⬇️</div>
                            <div><div className="lp-float-title">Download Papers</div><div className="lp-float-sub">Instant access</div></div>
                        </div>
                        <div className="lp-float lp-float-bl lp-float-anim-3">
                            <div className="lp-float-icon" style={{ background: 'linear-gradient(135deg,#9333ea,#7c3aed)' }}>📊</div>
                            <div><div className="lp-float-title">Track Analytics</div><div className="lp-float-sub">Monitor progress</div></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="lp-features" id="features">
                <div className="lp-section-inner">
                    <div className="lp-section-head">
                        <h2 className="lp-h2">
                            Powerful Features for{' '}
                            <span className="lp-gradient-text">Academic Success</span>
                        </h2>
                        <p className="lp-section-sub">
                            Everything you need to access, organize, and collaborate on educational resources
                        </p>
                    </div>
                    <div className="lp-cards">
                        {[
                            { icon: '🔍', title: 'Smart AI Search', desc: 'Intelligent search across subjects, semesters, and file types.' },
                            { icon: '🗂️', title: 'Organized by Dept & Sem', desc: 'Neatly categorized resources by department, subject, and semester.' },
                            { icon: '🛡️', title: 'Secure & Reliable Access', desc: 'Admin-approved content ensures quality and accuracy.' },
                            { icon: '👥', title: 'Collaboration Tools', desc: 'Faculty and students build a comprehensive resource library together.' },
                            { icon: '📈', title: 'Download Analytics', desc: 'Monitor download history for quick retrieval and better study planning.' },
                            { icon: '📄', title: 'Multi-format Support', desc: 'PDFs, presentations, documents, and more — all file formats supported.' },
                        ].map((f, i) => (
                            <div className="lp-card" key={i}>
                                <div className="lp-card-icon"><span style={{ fontSize: '1.6rem' }}>{f.icon}</span></div>
                                <h3 className="lp-card-title">{f.title}</h3>
                                <p className="lp-card-desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Divider */}
            <div className="lp-divider" id="about" />

            {/* CTA */}
            <section className="lp-cta-section">
                <div className="lp-cta-banner">
                    <div className="lp-cta-shimmer" />
                    <div className="lp-cta-content">
                        <h2 className="lp-cta-h2">Start Your Learning Journey Today</h2>
                        <p className="lp-cta-p">
                            Join thousands of students and faculty using EduVault for seamless academic resource management
                        </p>
                        <button className="lp-cta-btn" onClick={() => navigate('/student-login')}>
                            Get Started Now <span>→</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="lp-footer" id="footer">
                <div className="lp-footer-inner">
                    <div className="lp-footer-grid">
                        <div>
                            <div className="lp-footer-brand">
                                <span className="lp-brand-icon">📚</span>
                                <span className="lp-brand-name">EduVault</span>
                            </div>
                            <p className="lp-footer-tagline">Your smart digital academic library.</p>
                        </div>
                        <div>
                            <h4 className="lp-footer-heading">Quick Links</h4>
                            <ul className="lp-footer-list">
                                <li><button className="lp-footer-link" onClick={() => navigate('/student-login')}>Browse Resources</button></li>
                                <li><button className="lp-footer-link" onClick={() => navigate('/admin-login')}>Admin Dashboard</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="lp-footer-heading">Resources</h4>
                            <ul className="lp-footer-list">
                                <li><a href="#" className="lp-footer-link">Documentation</a></li>
                                <li><a href="#" className="lp-footer-link">Help Center</a></li>
                                <li><a href="#" className="lp-footer-link">Contact Support</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="lp-footer-heading">Connect</h4>
                            <div className="lp-social">
                                <a href="#" className="lp-social-icon">🐦</a>
                                <a href="#" className="lp-social-icon">💼</a>
                                <a href="#" className="lp-social-icon">🐙</a>
                            </div>
                        </div>
                    </div>
                    <div className="lp-footer-copy">
                        © 2026 EduVault. All rights reserved. Built with ❤️ for students and educators.
                    </div>
                </div>
            </footer>
        </div>
    );
}