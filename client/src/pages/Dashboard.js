import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../utils/auth';
import CreditCard from '../components/CreditCard';
import Header from '../components/header';
import '../styles/dashboard.css';
import axiosInstance from '../components/axiosInstance';
import { FaMoneyCheckAlt, FaBalanceScale, FaHistory } from 'react-icons/fa';
import Sidebar from '../components/sideView';
import User from '../components/user';

const Dashboard = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        accountNumber: '',
        balance: 500,
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: ''
    });
    

    
    const [loading, setLoading] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [error, setError] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [transferData, setTransferData] = useState({ recipient: '', amount: '', pin: ''});
    const [showTransactions, setShowTransactions] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
    const navigate = useNavigate();

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
        localStorage.setItem('darkMode', !isDarkMode);
    };

    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

    // Authorization Config Helper
    const getAuthConfig = () => ({
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getToken();
                if (!token) {
                    navigate('/auth');
                    return;
                }
                const res = await axiosInstance.get('/auth/dashboard', getAuthConfig());
                setUserData(res.data);

            } catch (err) {
                setError('Failed to fetch user data. Please log in again.');
                removeToken();
                //navigate('/auth');
            }
        };
        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        removeToken();
        navigate('/');
    };

    if (loading) return <div>Loading transactions...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={`dashboard-container ${isDarkMode ? 'dark' : 'light'}`}>
            <div>
                <Header onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                
            </div>
            {/* <div>
                <User />
            </div>  */}
            <div className="dashboard-sidebar">
                < Sidebar/>
            </div>
        </div>
    );
};

export default Dashboard;
