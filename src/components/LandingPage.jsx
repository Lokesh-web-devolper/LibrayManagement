import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LandingPage.css';

const BASE_URL = 'http://localhost:3001';

function useCountUp(target, duration = 1800) {
    const [count, setCount] = useState(0);
    const raf = useRef(null);

    useEffect(() => {
        if (target == null) return;
        const start = performance.now();
        const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) raf.current = requestAnimationFrame(step);
        };
        raf.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf.current);
    }, [target, duration]);

    return count;
}

/* ── Stat card with animated count ── */
function StatCard({ label, target, suffix = '', gradClass }) {
    const count = useCountUp(target);
    return (
        <div className="lp-stat-card">
            <div className={`lp-stat-num ${gradClass}`}>
                {count.toLocaleString()}{suffix}
            </div>
            <div className="lp-stat-label">{label}</div>
        </div>
    );
}

export default function LandingPage() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    // live counts from db.json
    const [resourceCount, setResourceCount] = useState(null);
    const [activeUserCount, setActiveUserCount] = useState(null);
    const [deptCount, setDeptCount] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [resRes, studRes, deptRes] = await Promise.all([
                    axios.get(`${BASE_URL}/resources`),
                    axios.get(`${BASE_URL}/students`),
                    axios.get(`${BASE_URL}/departments`),
                ]);
                // count only approved resources
                const approved = (resRes.data || []).filter(r => r.status === 'approved');
                setResourceCount(approved.length);
                // count active students
                const active = (studRes.data || []).filter(u => u.isActive !== false);
                setActiveUserCount(active.length);
                setDeptCount((deptRes.data || []).length);
            } catch (err) {
                console.error('Stats fetch error:', err);
                // keep null so we show a loading/unavailable state
                setResourceCount(0);
                setActiveUserCount(0);
                setDeptCount(0);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="lp-root lp-fade-in">
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

            {/* Hero — fully centered */}
            <section className="lp-hero">
                <div className="lp-hero-inner">
                    <div className="lp-badge lp-slide-up" style={{ animationDelay: '0.1s' }}>
                        <span className="lp-badge-icon">📖</span>
                        Academic Resource Management
                    </div>

                    <h1 className="lp-h1 lp-slide-up" style={{ animationDelay: '0.2s' }}>
                        Your Smart Digital{' '}
                        <span className="lp-gradient-text">Academic Library</span>
                    </h1>

                    <p className="lp-hero-desc lp-slide-up" style={{ animationDelay: '0.3s' }}>
                        Centralized access to quality educational resources. Search, download,
                        and manage study materials effortlessly—all in one place.
                    </p>

                    <div className="lp-hero-cta lp-slide-up" style={{ animationDelay: '0.4s' }}>
                        <button className="lp-btn-primary" onClick={() => navigate('/student-login')}>
                            Get Started <span>→</span>
                        </button>
                        <button className="lp-btn-secondary" onClick={() => navigate('/admin-login')}>
                            Admin Dashboard
                        </button>
                    </div>

                    {/* Dynamic Stats — only render once all counts are loaded */}
                    {resourceCount != null && activeUserCount != null && deptCount != null && (
                        <div className="lp-stats lp-slide-up" style={{ animationDelay: '0.55s' }}>
                            <StatCard
                                label="Resources"
                                target={resourceCount}
                                suffix=""
                                gradClass="lp-grad-violet"
                            />
                            <StatCard
                                label="Active Users"
                                target={activeUserCount}
                                suffix=""
                                gradClass="lp-grad-indigo"
                            />
                            <StatCard
                                label="Departments"
                                target={deptCount}
                                suffix=""
                                gradClass="lp-grad-purple"
                            />
                        </div>
                    )}
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