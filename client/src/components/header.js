import React from 'react';
import Notification from './Notification';
import bankVideo from '../images/Bank1.mp4';
import '../styles/header.css';

const Header = ({ toggleDarkMode, isDarkMode, onLogout }) => {
    return (
        <header className="header-container">
            <div className="video-overlay-container">
                <video autoPlay muted loop className="header-video">
                    <source src={bankVideo} type="video/mp4" />
                </video>
                <div className="video-overlay-text">E-Banking</div>
            </div>
            <div className="header-items">
                <button onClick={toggleDarkMode} className="mode-toggle">
                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
                <Notification />
                <button onClick={onLogout} className="logout-button">Logout</button>
            </div>
        </header>
    );
};


export default Header;
