import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../utils/auth';
import Header from '../components/header';
import Sidebar from '../components/sideView';
import User from '../components/user';
import FooterDash from '../components/footerdash';
import '../styles/dashboard.css'; 

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
    const [sideBarVisible, setSidebarVisible] = useState(false);
    const navigate = useNavigate();

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem('darkMode', newMode);
    };

    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);


    const handleLogout = () => {
        removeToken();
        navigate('/');
    };

    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className={`dashboard-app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <Header 
                onLogout={handleLogout} 
                toggleDarkMode={toggleDarkMode} 
                isDarkMode ={isDarkMode} 
            />

            <div className="dashboard-layout">
                <div className="sidebar-container">
                    <Sidebar  />
                </div>
                
                <div className="main-content">
                   <User />
                 </div> 
                <div className="footer">
                   <FooterDash />
                </div>
                
            </div>
        </div>
    );
};

export default Dashboard;