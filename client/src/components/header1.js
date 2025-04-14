import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header1.css';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect (() =>{
        document.body.style.overflow = isMobile ? 'hidden' : 'auto';
    },
    [isMobile]
    );

    return (
        <header className="eb-header">
            <div className="eb-container">
                <h1 className="eb-logo">E-Banking</h1>
                
                <nav className={isMobile ? "eb-nav mobile-nav" : "eb-nav"}>
                    <Link to="/" onClick={() => setIsMobile(false)}>Home</Link>
                    <Link to="/services" onClick={() => setIsMobile(false)}>Services</Link>
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/auth" className="login-btn">Login</Link>
                    <Link to="/auth" className="register-btn">Register</Link>
                </nav>

                <div className="menu-icon" onClick={() => setIsMobile(!isMobile)}>
                    {isMobile ? <FaTimes /> : <FaBars />}
                </div>
            </div>
        </header>
    );
};

export default Header;
