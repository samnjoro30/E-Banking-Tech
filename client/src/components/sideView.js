import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance';
import { useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../utils/auth';
import { FaMoneyCheckAlt, FaBalanceScale, FaHistory, FaFileInvoice, FaKey, FaFileAlt, FaUserCog, FaUniversity, FaExchangeAlt, FaTachometerAlt } from 'react-icons/fa';
import Transfer from './Transfer';
import User from './user';
import '../styles/sideview.css';

const Sidebar = ({ setActivePanel }) => {
    const [showTransactions, setShowTransactions] = useState(false);
    const [showTransfer, setShowTranfer] = useState(false);
    const [showUser,  setShowUser] = useState(true);
    const [setTest, setShowTest] = useState(false)
    const [leftPanelContent, setLeftPanelContent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const showContent = (contentType) => {
        setLeftPanelContent(contentType);
      };

  
    return (
        <div className="sidebar-container">
            <div className="sidebar-Sections">
                    <h3 className="section-title">Dashboard</h3>
                    <div className='buttons-container' >
                        <button
                           className="sidebar-button"
                           onClick={() => setActivePanel('user')}
                        >
                            <FaTachometerAlt className="button-icon" />
                            Overview
                        </button>
                        <button
                            className="sidebar-button"
                            onClick={() => setShowTest(true)}
                        >
                           <FaUserCog className="button-icon"/>
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
                            onClick={() => setShowTest(true)} 
                        >
                           <FaFileAlt className="button-icon" />
                           Pay Bills
                        </button>
                        <button 
                           className="sidebar-button"
                            onClick={() =>  setShowTest(true)} 
                        >
                            <FaBalanceScale className="button-icon" />
                            Check Balance
                        </button>
                        <button 
                            className="sidebar-button"
                             onClick={() => setShowTransactions(!showTransactions)}
                        >
                           <FaHistory className="button-icon" />
                            Transaction History
                        </button>
                        <button
                           className="sidebar-button"
                           onClick={() => setShowTest(true)} 
                        >
                            <FaExchangeAlt className="button-icon"/>
                            Global Pay
                        </button>
                    </div>
            </div>
            
        </div>
    );
};

export default Sidebar;