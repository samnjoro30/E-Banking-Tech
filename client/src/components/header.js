import React from 'react';
import Notification from './notification';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { clearCsrf } from '../utils/csrf';
import '../styles/header.css';

const Header = ({ toggleDarkMode, isDarkMode }) => {
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const res = await axiosInstance.post('/auth/logout');
      if (res.status === 200) {
        navigate('/auth');
      }
    } catch (err) {
      console.error('Logout failed', err);
    }finally{
      clearCsrf();
    }
  };
  return (
    <header className="header-container">
      <div className="header-content">
        <h1 className="header-title">Welcome to E-Payment!</h1>
        <div className="header-actions">
          <button onClick={toggleDarkMode} className="mode-toggle">
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <Notification />
          <button onClick={handleLogOut} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
