import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance';
import { useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../utils/auth';
import { FaMoneyCheckAlt, FaBalanceScale, FaHistory, FaFileInvoice, FaKey, FaFileAlt, FaUserCog, FaUniversity, FaExchangeAlt, FaTachometerAlt } from 'react-icons/fa';
import '../styles/sideview.css';

const Sidebar = () => {
    const [showTransactions, setShowTransactions] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [showerror, setShowError] = useState('');
    const [setTest, setShowTest] = useState(false)
    const [leftPanelContent, setLeftPanelContent] = useState(null);
    const [transferData, setTransferData] = useState({
        recipient: '',
        amount: '',
        pin: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const getAuthConfig = () => ({
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const showContent = (contentType) => {
        setLeftPanelContent(contentType);
      };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const transactionsRes = await axiosInstance.get('/transaction/transactions', getAuthConfig());
                setTransactions(transactionsRes.data);
            } catch (error) {
                setShowError('Failed to fetch user data. Please log in again.');
            }
        };
        fetchData();
    }, []);

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
            await axiosInstance.post(
                '/transaction/transfer',
                { ...transferData, amount: transferAmount },
                getAuthConfig()
            );
            setModalOpen(false);
            alert('Transfer successful!');
            setTransferData({ recipient: '', amount: '', pin: '' });
        } catch (error) {
            setError(error.response?.data?.message || 'Transfer failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sidebar-container">
            <div className="sidebar-Sections">
               
                    <h3 className="section-title">Dashboard</h3>
                    <div className='buttons-container' >
                        <button
                           className="sidebar-button"
                           onClick={() => setShowTest(true)}
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
                           onClick={() => setModalOpen(true)}
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
                            onClick={() => setModalOpen(true)}
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
              


                {modalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Transfer Funds</h2>
                            {error && <p className="error-message">{error}</p>}
                            <label>
                                To Account:
                                <input 
                                    type="text" 
                                    value={transferData.recipient} 
                                    onChange={(e) => setTransferData({ ...transferData, recipient: e.target.value })} 
                                />
                            </label>
                            <label>
                                Amount:
                                <input 
                                    type="number" 
                                    value={transferData.amount} 
                                    onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })} 
                                />
                            </label>
                            <label>
                                PIN:
                                <input 
                                    type="password" 
                                    value={transferData.pin} 
                                    onChange={(e) => setTransferData({ ...transferData, pin: e.target.value })} 
                                />
                            </label>
                            <div className="modal-actions">
                                <button 
                                    onClick={transferFunds} 
                                    disabled={loading}
                                    className="primary-button"
                                >
                                    {loading ? 'Processing...' : 'Submit'}
                                </button>
                                <button 
                                    onClick={() => {
                                        setModalOpen(false);
                                        setError('');
                                    }}
                                    className="secondary-button"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;