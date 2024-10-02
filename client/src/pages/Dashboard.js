import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../utils/auth';
import '../styles/dashboard.css';

const Dashboard = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        accountNumber: '',
        balance: 0,
    });
    const [error, setError] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [transferData, setTransferData] = useState({ recipient: '', amount: '' });
    const [showTransactions, setShowTransactions] = useState(false);
    const navigate = useNavigate();

    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('darkMode') === 'true';
        setIsDarkMode(savedTheme);
    }, []);

    useEffect(() => {
        localStorage.setItem('darkMode', isDarkMode);
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);


    // Fetch user data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getToken();
                if (!token) {
                    navigate('/login');
                    return;
                }
                const res = await axios.get('http://localhost:5000/api/auth/dashboard', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUserData(res.data);
                const transactionsRes = await axios.get('http://localhost:5000/api/auth/transactions', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setTransactions(transactionsRes.data);
            } catch (err) {
                setError('Failed to fetch user data. Please log in again.');
                console.error(err.response?.data);
                removeToken();
                navigate('/login'); // Redirect to login if there's an error
            }
        };
        fetchData();
    }, [navigate]);

    // Transfer funds function
    const transferFunds = async () => {
        if (!transferData.recipient || !transferData.amount) {
            setError('Recipient and amount are required.');
            return;
        }

        try {
            const token = getToken();
            await axios.post('http://localhost:5000/api/auth/transfer', transferData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setModalOpen(false);
            alert('Transfer successful!');
            // Optionally, refetch user data or transactions here
        } catch (error) {
            setError('Transfer failed. Please try again.');
            console.error(error);
        }
    };

    const checkBalance = () => {
        alert(`Your current balance is $${userData.balance}`);
    };

    const handleLogout = () => {
        removeToken();
        navigate('/');
    };

    return (
        <div className={`dashboard-container ${isDarkMode ? 'dark' : 'light'}`}>
            <div className="toggle-container">
                <button onClick={toggleDarkMode}>
                    {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>
            </div>

            <div className="logout-container">
                <button onClick={handleLogout}>Logout</button>
            </div>

            <h1>Welcome, {userData.firstName} {userData.lastName}</h1>

            <div className="user-info">
                <p>Email: {userData.email}</p>
                <p>Account Number: {userData.accountNumber}</p>
            </div>

            <p>Balance: ${userData.balance}</p>

            <h2>Banking Features</h2>
            <button onClick={checkBalance}>Check Balance</button>

            <button onClick={() => setShowTransactions(!showTransactions)}>
                {showTransactions ? 'Hide Transactions' : 'View Transaction History'}
            </button>

       
            {/* Toggle Transactions */}
            {showTransactions && (
                <div>
                    <h2>Recent Transactions</h2>
                    <ul>
                        {transactions.map(transaction => (
                            <li key={transaction.id}>
                                {transaction.date}: {transaction.description} - ${transaction.amount.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Transfer Funds Modal */}
            <button onClick={() => setModalOpen(true)}>Transfer Funds</button>
            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Transfer Funds</h2>
                        <label>
                            Recipient:
                            <input 
                                type="text" 
                                value={transferData.recipient} 
                                onChange={(e) => setTransferData({ ...transferData, recipient: e.target.value })} 
                                required 
                            />
                        </label>
                        <label>
                            Amount:
                            <input 
                                type="number" 
                                value={transferData.amount} 
                                onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })} 
                                required 
                            />
                        </label>
                        <button 
                            onClick={transferFunds} 
                            disabled={!transferData.recipient || !transferData.amount || isNaN(transferData.amount)}
                        >
                            Submit
                        </button>
                        <button onClick={() => setModalOpen(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Error Handling */}
            {error && <p className="error-message">{error}</p>}
            <div>
                
            </div>
        </div>
    );
};

export default Dashboard;
