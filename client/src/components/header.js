import React from 'react';
import Notification from './notification';
import '../styles/header.css';

const Header = ({ toggleDarkMode, isDarkMode, onLogout }) => {
    return (
        <header className="header-container">
            <div className="header-content">
                <h1 className="header-title">Welcome to E-Payment!</h1>
                <div className="header-actions">
                    <button onClick={toggleDarkMode} className="mode-toggle">
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <Notification />
                    <button onClick={onLogout} className="logout-button">Logout</button>
                </div>
            </div>
        </header>
    );
};

export default Header;