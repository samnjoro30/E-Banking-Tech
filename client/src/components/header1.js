import React, { useState, useEffect } from 'react';
import {
  FaBars,
  FaTimes,
  FaHome,
  FaCog,
  FaInfoCircle,
  FaPhone,
  FaSignInAlt,
  FaUserPlus,
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header1.css';

const Header1 = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = isMobile ? 'hidden' : 'auto';

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  const navItems = [
    { path: '#', label: 'Home', icon: <FaHome /> },
    { path: '#', label: 'Services', icon: <FaCog /> },
    { path: '#', label: 'About', icon: <FaInfoCircle /> },
    { path: '#', label: 'Contact', icon: <FaPhone /> },
  ];
  const isActive = path => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`eb-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="eb-container">
        <Link to="/" className="eb-logo">
          E-Payment
        </Link>

        <nav className={isMobile ? 'eb-nav mobile-nav' : 'eb-nav'}>
          <div className="nav-main">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setIsMobile(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="nav-actions">
            <Link
              to="/auth"
              className="nav-link login-btn"
              onClick={() => setIsMobile(false)}
            >
              <FaSignInAlt />
              <span>Login</span>
            </Link>
            <Link
              to="/auth"
              className="nav-link register-btn"
              onClick={() => setIsMobile(false)}
            >
              <FaUserPlus />
              <span>Register</span>
            </Link>
          </div>
        </nav>

        <button
          className="menu-icon"
          onClick={() => setIsMobile(!isMobile)}
          aria-label={isMobile ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobile}
        >
          {isMobile ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
};

export default Header1;
