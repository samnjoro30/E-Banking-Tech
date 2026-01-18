import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaMoneyCheckAlt,
  FaBalanceScale,
  FaHistory,
  FaFileInvoice,
  FaKey,
  FaFileAlt,
  FaUserCog,
  FaUniversity,
  FaExchangeAlt,
  FaTachometerAlt,
} from 'react-icons/fa';
import '../styles/sideview.css';

const Sidebar = ({ setActivePanel }) => {
  const [setShowTest] = useState(false);

  return (
    <div className="sidebar-container">
      <div className="sidebar-Sections">
        <h3 className="section-title">Dashboard</h3>
        <div className="buttons-container">
          <button
            className="sidebar-button"
            onClick={() => setActivePanel('user')}
          >
            <FaTachometerAlt className="button-icon" />
            Overview
          </button>
          <button className="sidebar-button" onClick={() => setShowTest(true)}>
            <FaUserCog className="button-icon" />
            User Profile
          </button>
        </div>
        <h3 className="section-title">Transactions</h3>
        <div className="buttons-container">
          <button
            className="sidebar-button"
            onClick={() => setActivePanel('transfer')}
          >
            <FaMoneyCheckAlt className="button-icon" />
            Transfer Funds
          </button>
          <button
            className="sidebar-button"
            onClick={() => setActivePanel('pay bills')}
          >
            <FaFileAlt className="button-icon" />
            Pay Bills
          </button>
          <button
            className="sidebar-button"
            onClick={() => setActivePanel('balance')}
          >
            <FaBalanceScale className="button-icon" />
            Check Balance
          </button>
          <button
            className="sidebar-button"
            onClick={() => setActivePanel('transaction')}
          >
            <FaHistory className="button-icon" />
            Transaction History
          </button>
          <button className="sidebar-button" onClick={() => setShowTest(true)}>
            <FaExchangeAlt className="button-icon" />
            Global Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
