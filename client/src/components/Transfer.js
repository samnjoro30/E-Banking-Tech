import React, { useState } from 'react';
import axiosInstance from './axiosInstance';
import { getToken } from '../utils/auth';
import DashboardSectionWrapper from './dashbordwrapper';
import '../styles/transfer.css';

const Transfer = ({ onClose }) => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [transferData, setTransferData] = useState({
        recipient: '',
        amount: '',
        pin: ''
    });

    const getAuthConfig = () => ({
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });

    const transferFunds = async () => {
        if (!transferData.recipient || !transferData.amount) {
            setError('Recipient, amount, and pin are required.');
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
            alert('Transfer successful!');
            setTransferData({ recipient: '', amount: '', pin: '' });
            onClose();
        } catch (error) {
            setError(error.response?.data?.message || 'Transfer failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
       
            <div className="transfer-form">
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

                <div className="form-actions">
                    <button
                        onClick={transferFunds}
                        disabled={loading}
                        className="primary-button"
                    >
                        {loading ? 'Processing...' : 'Submit'}
                    </button>
                    <button
                        onClick={() => {
                            setError('');
                            onClose();
                        }}
                        className="secondary-button"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        
    );
};

export default Transfer;
