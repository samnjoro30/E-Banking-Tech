// Header.js
import React from 'react';
import Notification from './notification';

const Header = ({ toggleDarkMode, isDarkMode, handleLogout }) => {
    return (
        <header className="header-container">
            <div className="toggle-container">
                <button onClick={toggleDarkMode}>
                    {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>
            </div>
            <div className="logout-container">
                <Notification />
                <button onClick={handleLogout}>Logout</button>
            </div>
        </header>
    );
};

export default Header;
