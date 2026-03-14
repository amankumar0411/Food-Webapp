import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CardNav.css';

const CardNav = ({ items, logo, logoAlt, baseColor, menuColor, buttonBgColor, buttonTextColor, theme, toggleTheme }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <div className={`card-nav-wrapper ${theme}`} style={{ backgroundColor: baseColor }}>
            {/* Header / Logo */}
            <header className="card-nav-header">
                {logo ? (
                    <img src={logo} alt={logoAlt} className="nav-logo" />
                ) : (
                    <h1 className="nav-brand-text">TASTY WHEELS</h1>
                )}
            </header>

            {/* Cards Container */}
            <main className="cards-container">
                {items.map((item, index) => (
                    <div 
                        key={index}
                        className={`nav-card ${activeIndex === index ? 'active' : ''}`}
                        style={{ 
                            backgroundColor: item.bgColor, 
                            color: item.textColor 
                        }}
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseLeave={() => setActiveIndex(null)}
                    >
                        <div className="card-content">
                            <h2 className="card-label">{item.label}</h2>
                            <div className="card-links">
                                {item.links.map((link, lIndex) => (
                                    <Link 
                                        key={lIndex} 
                                        to={link.href} 
                                        aria-label={link.ariaLabel}
                                        style={{ color: item.textColor }}
                                        className="card-link-item"
                                    >
                                        {link.label}
                                        <span className="link-arrow">→</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </main>

            {/* Footer / Meta Actions */}
            <footer className="card-nav-footer">
                <div className="theme-switch-wrapper" style={{ marginRight: '30px' }}>
                    <span className="theme-switch-icon text-warning">☀️</span>
                    <label className="theme-switch">
                        <input 
                            type="checkbox" 
                            checked={theme === 'dark'} 
                            onChange={() => {
                                // We use the prop to toggle the parent state
                                if (typeof toggleTheme === 'function') toggleTheme();
                            }} 
                        />
                        <span className="theme-switch-slider"></span>
                    </label>
                    <span className="theme-switch-icon text-info">🌙</span>
                </div>

                <button 
                    className="meta-toggle-btn"
                    style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
                    onClick={() => {
                        localStorage.removeItem("user");
                        window.location.href = "/";
                    }}
                >
                    LOGOUT
                </button>
            </footer>
        </div>
    );
};

export default CardNav;
