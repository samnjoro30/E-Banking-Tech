import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';
import axiosInstance from './axiosInstance';
import '../styles/user.css';
import { FaUser, FaEnvelope, FaIdCard, FaCreditCard, FaCalendarAlt } from 'react-icons/fa';

const User = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        accountNumber: '',
        // accountType: '',
        // createdAt: '',
        balance: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getToken();
                const res = await axiosInstance.get('/auth/dashboard', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUserData(res.data.user);
            } catch (error) {
                setError('Failed to fetch user data. Please log in again.');
                console.error(error);
                // setTimeout(() => navigate('/auth'), 2000);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <div className="user-overview loading">
                <div className="loading-spinner"></div>
                <p>Loading your account information...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="user-overview error">
                <p className="error-message">{error}</p>
            </div>
        );
    }

    return (
        <div className="user-overview">
            <div className="welcome-section">
                <h1>Welcome back, {userData.firstName}!</h1>
                <p className="subtitle">Here's your account overview</p>
            </div>

            <div className="dashboard-grid">
                {/* Account Summary Card */}
                <div className="dashboard-card summary-card">
                    <h2><FaUser className="card-icon" /> Account Summary</h2>
                    <div className="card-content">
                        <div className="info-row">
                            <span className="info-label">Full Name:</span>
                            <span className="info-value">{userData.firstName} {userData.lastName}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label"><FaEnvelope /> Email:</span>
                            <span className="info-value">{userData.email}</span>
                        </div>
                        {/* <div className="info-row">
                            <span className="info-label"><FaIdCard /> Account Type:</span>
                            <span className="info-value">{userData.accountType || 'Standard Checking'}</span>
                        </div> */}
                    </div>
                </div>

                {/* Account Details Card */}
                <div className="dashboard-card details-card">
                    <h2><FaCreditCard className="card-icon" /> Account Details</h2>
                    <div className="card-content">
                        <div className="info-row">
                            <span className="info-label">Account Number:</span>
                            <span className="info-value">{userData.accountNumber}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Current Balance:</span>
                            <span className="info-value">${userData.balance?.toFixed(2) || '0.00'}</span>
                        </div>
                        {/* <div className="info-row">
                            <span className="info-label"><FaCalendarAlt /> Member Since:</span>
                            <span className="info-value">{formatDate(userData.createdAt)}</span>
                        </div> */}
                    </div>
                </div>

                {/* Quick Actions Card */}
                <div className="dashboard-card actions-card">
                    <h2>Quick Actions</h2>
                    <div className="action-buttons">
                        <button className="action-button transfer">
                            Transfer Funds
                        </button>
                        <button className="action-button history">
                            View Transactions
                        </button>
                        <button className="action-button settings">
                            Account Settings
                        </button>
                    </div>
                </div>

                {/* Recent Activity Card */}
                <div className="dashboard-card activity-card">
                    <h2>Recent Activity</h2>
                    <div className="activity-list">
                        <p className="empty-activity">No recent transactions</p>
                        {/* This would be replaced with actual transaction data */}
                    </div>
                    <button className="view-all">View All Activity</button>
                </div>
            </div>
        </div>
    );
};

export default User;