import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './HeaderNavigation.css';

export const HeaderNavigationBase = ({ items, brandName, toggleTheme, isDark, searchQuery, setSearchQuery, isHomePage }) => {
    const navigate = useNavigate();
    const [openDropdown, setOpenDropdown] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    const toggleDropdown = (label) => {
        setOpenDropdown(openDropdown === label ? null : label);
    };

    return (
        <nav className="header-nav">
            <div className="nav-container">
                {/* Brand */}
                <div className="nav-brand" onClick={() => navigate('/')}>
                    <h2>{brandName}</h2>
                </div>

                {/* Integrated Search Bar */}
                <div className="nav-search">
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
