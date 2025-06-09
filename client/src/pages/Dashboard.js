import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../utils/auth';
import CreditCard from '../components/CreditCard';
import App from '../components/dark';
import Header from '../components/header';
import '../styles/dashboard.css';
import axiosInstance from '../components/axiosInstance';
import { FaMoneyCheckAlt, FaBalanceScale, FaHistory } from 'react-icons/fa';
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
    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

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

                const transactionsRes = await axiosInstance.get('/transaction/transactions', getAuthConfig());
                setTransactions(transactionsRes.data);
               
            } catch (err) {
                setError('Failed to fetch user data. Please log in again.');
                removeToken();
                //navigate('/auth');
            }
        };
        fetchData();
    }, [navigate]);

    const transferFunds = async () => {
        if (!transferData.recipient || !transferData.amount) {
            setError('Recipient amount and pin are required.');
            return;
        }

        const transferAmount = Number(transferData.amount);
        if (isNaN(transferAmount) || transferAmount <= 0) {
            setError('Invalid transfer amount.');
            return;
        }

        setLoading(true);
        try {
            const token = getToken();
            await axios.post('https://e-banking-tech.onrender.com/api/transaction/transfer',
                { ...transferData, amount: transferAmount },
                getAuthConfig()
            );
            setModalOpen(false);
            alert('Transfer successful!');
        } catch (error) {
            setError('Transfer failed. Please try again.');
        }finally {
        setLoading(false); // Hide loading state
       }
    };

    const checkBalance = () => {
        alert(`Your current balance is ${userData.balance}`);
    };

    const handleLogout = () => {
        removeToken();
        navigate('/');
    };

    if (loading) return <div>Loading transactions...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className={`dashboard-container ${isDarkMode ? 'dark' : 'light'}`}>
            <Header onLogout={handleLogout} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />

            <App />

            <h1>Welcome, {userData.firstName} {userData.lastName}</h1>


            <div className="dashboard-buttons">
                <button onClick={() => setModalOpen(true)}>
                    <FaMoneyCheckAlt style={{ marginRight: '8px' }} />
                    Transfer Funds
                </button>

                {/* Check Balance Button */}
                <button onClick={checkBalance}>
                    <FaBalanceScale style={{ marginRight: '8px' }} />
                    Check Balance
                </button>
                <div className="dropdown">
                    <button onClick={toggleDropdown}>
                        <FaHistory style={{ marginRight: '8px' }} />
                        {showTransactions ? 'Hide Transactions' : 'View Transaction History'}
                    </button>
                    {showDropdown && (
                    <div className="dropdown-content">
                        <h2>Recent Transactions</h2>
                        <table className="transactions-table">
                            <thead>
                               <tr>
                                    <th>Description</th>
                                    <th>Amount</th>
                                    <th>Type</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((transaction) => (
                                    <tr key={transaction._id}>
                                       <td>{transaction.description}</td>
                                       <td>{transaction.amount}</td>
                                       <td>{transaction.type}</td>
                                       <td>{new Date(transaction.date).toLocaleString()}</td>
                                    </tr>
                               ))}
                            </tbody>
                        </table>
                    </div>
                    )}
                </div>
                
            </div>
            {error && <p className="error-message">{error}</p>}

            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Transfer Funds</h2>
                        <label>
                            To Account:
                            <input type="text" value={transferData.recipient} onChange={(e) => setTransferData({ ...transferData, recipient: e.target.value })} />
                        </label>
                        <label>
                            Amount:
                            <input type="number" value={transferData.amount} onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })} />
                        </label>
                        <label>
                            PIN:
                            <input type="text" value={transferData.pin} onChange={(e) => setTransferData({ ...transferData, pin: e.target.value })} />
                        </label>
                        <button onClick={transferFunds} disabled={loading}>
                            {loading ? 'Processing...' : 'Submit'}
                        </button>
                        <button onClick={() => setModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}

            <div className="user-info-container">
                <div className="user-info">
                    <p><span style={{ color: 'black' }}>Email:</span> <span style={{ color: '#007bff' }}>{userData.email}</span></p>
                    <p><span style={{ color: 'black' }}>Account Number:</span> <span style={{ color: '#28a745' }}>{userData.accountNumber}</span></p>
                    <p><span style={{ color: 'black' }}>Balance:</span> <span style={{ color: '#dc3545' }}>Ksh{userData.balance}</span></p>
                </div>
            </div>

            <h2>The upcoming features VISA for global payment</h2>
            <h2>Your Credit Card</h2>
            <CreditCard
                cardNumber={userData.cardNumber}
                cardHolder={userData.cardHolder}
                expiryDate={userData.expiryDate}
                cvv={userData.cvv}
            />
        </div>
    );
};

export default Dashboard;
