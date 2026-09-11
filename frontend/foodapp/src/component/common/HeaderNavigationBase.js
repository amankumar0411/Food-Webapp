import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HeaderNavigation.css';
import VoiceOrderModal from '../Client/VoiceOrderModal';

export const HeaderNavigationBase = ({ items, brandName, toggleTheme, isDark, searchQuery, setSearchQuery, isHomePage }) => {
    const navigate = useNavigate();
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.location.href = "/";
    };

    const toggleDropdown = (label) => {
        setOpenDropdown(openDropdown === label ? null : label);
    };

    return (
        <nav className="header-nav">
            <VoiceOrderModal isOpen={isVoiceModalOpen} onClose={() => setIsVoiceModalOpen(false)} />
            <div className="nav-container">
                {/* Brand */}
                <div className="nav-brand" onClick={() => navigate('/')}>
                    <h2>{brandName}</h2>
                </div>

                {/* Integrated Search Bar with Quick Voice Order Mic Button */}
                <div className="nav-search" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="search-input-wrapper">
                        <span className="search-icon">🔍</span>
                        <input 
                            type="text" 
                            placeholder="Search foods..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ position: 'relative', zIndex: 100 }}
                        />
                    </div>
                    <button 
                        className="btn btn-warning d-flex align-items-center gap-1"
                        onClick={() => setIsVoiceModalOpen(true)}
                        title="Quick Voice Order"
                        style={{
                            borderRadius: '16px',
                            fontWeight: '800',
                            padding: '8px 14px',
                            backgroundColor: 'var(--primary-color)',
                            color: '#fff',
                            border: 'none',
                            fontSize: '0.88rem',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 4px 12px rgba(226,55,68,0.25)'
                        }}
                    >
                        <span>🎙️</span>
                        <span className="d-none d-md-inline">Voice Order</span>
                    </button>
                </div>

                {/* Nav Items (Bottom Capsule on Mobile) */}
                <div className={`nav-menu ${isHomePage ? 'hide-on-home' : ''}`}>
                    <ul className="nav-list">
                        {items.map((item, index) => (
                            <li key={index} className={`nav-item ${item.items ? 'has-dropdown' : ''}`}>
                                {item.items ? (
                                    <>
                                        <button 
                                            className="dropdown-toggle" 
                                            onClick={() => toggleDropdown(item.label)}
                                        >
                                            {item.label}
                                            <span className={`arrow ${openDropdown === item.label ? 'up' : 'down'}`}></span>
                                        </button>
                                        <ul className={`dropdown-menu ${openDropdown === item.label ? 'show' : ''}`}>
                                            {item.items.map((subItem, subIndex) => (
                                                <li key={subIndex} className="dropdown-item">
                                                    <Link 
                                                        to={subItem.href} 
                                                        className={subItem.current ? 'active' : ''}
                                                        onClick={() => setOpenDropdown(null)}
                                                    >
                                                        {subItem.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <Link 
                                        to={item.href} 
                                        className={item.current ? 'active' : ''}
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Nav Actions (Theme & Logout) */}
                <div className="nav-actions">
                    <div className="theme-switch-wrapper">
                        <span className="theme-switch-icon text-warning">☀️</span>
                        <label className="theme-switch">
                            <input 
                                type="checkbox" 
                                checked={isDark} 
                                onChange={toggleTheme} 
                            />
                            <span className="theme-switch-slider"></span>
                        </label>
                        <span className="theme-switch-icon text-info">🌙</span>
                    </div>

                    <button className="logout-button" onClick={handleLogout}>
                        LOGOUT
                    </button>
                </div>
            </div>
        </nav>
    );
};
