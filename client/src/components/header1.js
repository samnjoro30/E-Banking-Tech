import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaHome, FaCog, FaInfoCircle, FaPhone, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import '../styles/Header1.css';

const Header1 = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        document.body.style.overflow = isMobile ? 'hidden' : 'auto';
        
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMobile]);

    const navItems = [
        { path: '/', label: 'Home', icon: <FaHome /> },
        { path: '/services', label: 'Services', icon: <FaCog /> },
        { path: '/about', label: 'About', icon: <FaInfoCircle /> },
        { path: '/contact', label: 'Contact', icon: <FaPhone /> }
    ];

    return (
        <>
            <header className={`eb-header ${scrolled ? 'scrolled' : ''}`}>
                <div className="eb-container">
                    <h1 className="eb-logo">E-Platform</h1>
                    
                    <nav className={isMobile ? "eb-nav mobile-nav" : "eb-nav"}>
                        {navItems.map((item, index) => (
                            <a 
                                key={index}
                                href={item.path} 
                                className="nav-link"
                                onClick={() => setIsMobile(false)}
                            >
                                {item.icon}
                                {item.label}
                            </a>
                        ))}
                        <a 
                            href="/auth" 
                            className="nav-link login-btn"
                            onClick={() => setIsMobile(false)}
                        >
                            <FaSignInAlt />
                            Login
                        </a>
                        <a 
                            href="/auth" 
                            className="nav-link register-btn"
                            onClick={() => setIsMobile(false)}
                        >
                            <FaUserPlus />
                            Register
                        </a>
                    </nav>

                    <div className="menu-icon" onClick={() => setIsMobile(!isMobile)}>
                        {isMobile ? <FaTimes /> : <FaBars />}
                    </div>
                </div>
            </header>

        </>
    );
};

export default Header1;