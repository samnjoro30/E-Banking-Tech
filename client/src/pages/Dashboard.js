import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../utils/auth';
import CreditCard from '../components/CreditCard';
import Notification from '../components/notification';
import Sidebar from '../components/sideView';
import '../styles/dashboard.css';

const Dashboard = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        accountNumber: '',
        balance: 500,
        cardNumber: '', // Sample card number
        cardHolder: '',           // Sample card holder name
        expiryDate: '',              // Sample expiry date
        cvv: ''
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
                const res = await axios.get('https://e-banking-tech.onrender.com/api/auth/dashboard', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUserData(res.data);
                console.log(res.data);
                const transactionsRes = await axios.get('https://e-banking-tech.onrender.com/api/transaction/transactions', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                setTransactions(transactionsRes.data);
            } catch (err) {
                setError('Failed to fetch user data. Please log in again.');
                console.error(err.response?.data);
                removeToken();
                navigate('/auth'); // Redirect to login if there's an error
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

        const transferAmount = Number(transferData.amount);

        if (isNaN(transferAmount) || transferAmount <= 0) {
            setError('Invalid transfer amount.');
            return;
        }
        try {
            const token = getToken();
            await axios.post('https://e-banking-tech.onrender.com/api/transaction/transfer',
                { ...transferData, amount: transferAmount },
                 {
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
       
        alert(`Your current balance is ${userData.balance}`);
        

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
            <div>
                <Sidebar/>
            </div>
           
            <div className="logout-container">
                <Notification />
                <button onClick={handleLogout}>Logout</button>
            </div>

            <h1>Welcome, {userData.firstName} {userData.lastName}</h1>

            <div className="user-info">
                <p>
                    <span style={{ color: 'black' }}>Email: </span>
                    <span style={{ color: '#007bff' }}>{userData.email}</span>
                </p>
                <p>
                    <span style={{ color: 'black' }}>Account Number: </span>
                    <span style={{ color: '#28a745' }}>{userData.accountNumber}</span>
                </p>
                <p>
                    <span style={{ color: 'black' }}>Balance: </span>
                    <span style={{ color: '#dc3545' }}>Ksh{userData.balance}</span>
                </p>
            </div>

           
            <h2>Banking Features</h2>
            {/* Transfer Funds Modal */}
            <button onClick={() => setModalOpen(true)}>Transfer Funds</button>
            {modalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Transfer Funds</h2>
                        <label>
                            To Account Number:
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
            <button onClick={checkBalance}>Check Balance</button>

            <button onClick={() => setShowTransactions(!showTransactions)}>
                {showTransactions ? 'Hide Transactions' : 'View Transaction History'}
            </button>
            {showTransactions && (
            <div>
            <h2>Recent Transactions</h2>
            {transactions.length > 0 ? (
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
                        {transactions.map(transaction => (
                            <tr key={transaction._id}>
                                <td>{transaction.description}</td>
                                <td>{transaction.amount}</td>
                                <td>{transaction.type}</td>
                                <td>{new Date(transaction.date).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No recent transactions found.</p>
            )}
        </div>
        
            )}


            <div className={`dashboard-container ${isDarkMode ? 'dark' : 'light'}`}>
               {/* ... (rest of your existing JSX) */}

               {/* Credit Card Display */}
               <h2>The upcoming features VISA for global payment</h2>
                <h2>Your Credit Card</h2>
                    <CreditCard
                       cardNumber={userData.cardNumber}
                       cardHolder={userData.cardHolder}
                       expiryDate={userData.expiryDate}
                       cvv={userData.cvv}
                    />
 
              {/* ... (rest of your existing JSX) */}
            </div>
        </div>
    );
};

export default Dashboard;

