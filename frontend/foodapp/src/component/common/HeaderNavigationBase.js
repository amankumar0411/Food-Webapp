import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './HeaderNavigation.css';
import VoiceOrderModal from '../Client/VoiceOrderModal';

export const HeaderNavigationBase = ({ items, brandName, toggleTheme, isDark, searchQuery, setSearchQuery, isHomePage }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/";
    };

    return (
        <>
            {/* FIXED STITCH TOP HEADER */}
            <header className="stitch-top-header">
                <VoiceOrderModal isOpen={isVoiceModalOpen} onClose={() => setIsVoiceModalOpen(false)} />
                <div className="stitch-header-inner">
                    {/* Location Pill / Brand */}
                    <div className="stitch-location-pill" onClick={() => navigate('/')}>
                        <div className="stitch-icon-circle">
                            <span className="material-symbols-outlined text-primary" style={{ transform: 'rotate(45deg)' }}>near_me</span>
                        </div>
                        <div className="stitch-loc-info">
                            <div className="stitch-loc-title">
                                <span>Food Delivery</span>
                                <span className="material-symbols-outlined text-muted" style={{ fontSize: '18px' }}>expand_more</span>
                            </div>
                            <span className="stitch-loc-sub truncate">Indiranagar, 100ft Road, Bengaluru</span>
                        </div>
                    </div>

                    {/* Search & Actions */}
                    <div className="stitch-header-actions">
                        <button 
                            className="stitch-header-btn" 
                            onClick={() => setIsVoiceModalOpen(true)}
                            title="Quick Voice Order"
                        >
                            <span className="material-symbols-outlined" style={{ color: 'var(--primary-color)' }}>mic</span>
                        </button>
                        
                        <div className="theme-switch-wrapper" style={{ scale: 0.75 }}>
                            <span className="theme-switch-icon text-warning">☀️</span>
                            <label className="theme-switch">
                                <input type="checkbox" checked={isDark} onChange={toggleTheme} />
                                <span className="theme-switch-slider"></span>
                            </label>
                            <span className="theme-switch-icon text-info">🌙</span>
                        </div>

                        <button 
                            className="stitch-avatar-btn" 
                            onClick={() => navigate('/account')}
                            title={user.username || "Account"}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person</span>
                        </button>

                        <button className="stitch-logout-btn" onClick={handleLogout}>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* PERSISTENT STITCH BOTTOM NAVIGATION */}
            <nav className="stitch-bottom-nav">
                <div className="stitch-bottom-nav-inner">
                    {/* 1. Food */}
                    <Link 
                        to="/" 
                        className={`stitch-nav-item ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        <span className="material-symbols-outlined fill">restaurant</span>
                        <span className="stitch-nav-label">Food</span>
                    </Link>

                    {/* 2. EatRight with NEW Badge */}
                    <Link 
                        to="/?filter=eatright" 
                        className={`stitch-nav-item ${location.search.includes('eatright') ? 'active' : ''}`}
                    >
                        <div className="stitch-nav-icon-wrap">
                            <span className="material-symbols-outlined">eco</span>
                            <span className="stitch-new-badge">NEW</span>
                        </div>
                        <span className="stitch-nav-label">EatRight</span>
                    </Link>

                    {/* 3. Reorder / Cart */}
                    <Link 
                        to="/account" 
                        className={`stitch-nav-item ${location.pathname === '/account' ? 'active' : ''}`}
                    >
                        <span className="material-symbols-outlined">history</span>
                        <span className="stitch-nav-label">Reorder</span>
                    </Link>

                    {/* 4. Yellow Offers Flame Button */}
                    <Link 
                        to="/?filter=offers" 
                        className="stitch-offers-flame-btn"
                    >
                        <span className="material-symbols-outlined fill">local_fire_department</span>
                        <div className="stitch-offers-text">
                            <span className="stitch-offers-sub">OFFERS</span>
                            <span className="stitch-offers-main">Pick Free!</span>
                        </div>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>auto_awesome</span>
                    </Link>
                </div>
            </nav>
        </>
    );
};
