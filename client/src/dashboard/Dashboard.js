import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {  removeToken } from '../utils/auth';
import Header from '../components/header';
import Sidebar from '../components/sideView';
import User from '../components/user';
//import Transfer from '../components/Transfer';
import FooterDash from '../components/footerdash';
import '../styles/dashboard.css';
import Transaction from '../components/Transaction';
import Balance from '../components/balance';
import Tbutton from '../components/Tbuttons';
import PayBill from '../components/pay_bill';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );
  //const [sideBarVisible, setSidebarVisible] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
  };

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  // const handleLogout = () => {
  //   removeToken();
  //   navigate('/');
  // };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const renderLeftPanelContent = () => {
    switch (activePanel) {
      case 'user':
        return <User onClose={() => setActivePanel(null)} />;
      case 'transfer':
        return <Tbutton onClose={() => setActivePanel(null)} />;
      case 'transaction':
        return <Transaction onClose={() => setActivePanel(null)} />;
      case 'balance':
        return <Balance onClose={() => setActivePanel(null)} />;
      case 'pay bills':
        return <PayBill onClose={() => setActivePanel(null)} />;
      default:
        return <User />;
    }
  };

  return (
    <div className={`dashboard-app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <Header
        // onLogout={handleLogout}
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />

      <div className="dashboard-layout">
        <div className={`left-panel ${activePanel ? 'open' : ''}`}>
          {renderLeftPanelContent()}
        </div>
        <div className="sidebar-container">
          <Sidebar setActivePanel={setActivePanel} />
        </div>

        {/* <div className="main-content">
                   <User />
                 </div>  */}
        {/* <div className="footer"> */}
        <FooterDash />
        {/* </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
