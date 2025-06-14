import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, isAuthenticated, removeToken } from '../utils/auth';
import axiosInstance from './axiosInstance';
import '../styles/user.css';
import { FaUser, FaEnvelope, FaIdCard, FaCreditCard, FaCalendarAlt } from 'react-icons/fa';

const User = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        accountNumber: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/auth');
            return;
        }
        const fetchData = async () => {
            
            try {
                const res = await axiosInstance.get('/auth/dashboard');

                const data = res.data;
                console.log("Fetched dashboard data:", data);
                setUserData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    accountNumber: data.accountNumber || '',
                    balance: data.balance || 0,
                });
            } catch (error) {
                setError('Failed to fetch user data. Please log in again.');
                console.error(error);
                console.log("data error", error)
                // setTimeout(() => navigate('/auth'), 2000);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [navigate]);


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
            <div className="user-info-container">
                <div className="user-info">
                    <p><span style={{ color: 'black' }}>Email:</span> <span style={{ color: '#007bff' }}>{userData.email}</span></p>
                    <p><span style={{ color: 'black' }}>Account Number:</span> <span style={{ color: '#28a745' }}>{userData.accountNumber}</span></p>
                    <p><span style={{ color: 'black' }}>Balance:</span> <span style={{ color: '#dc3545' }}>Ksh{userData.balance}</span></p>
                </div>
            </div>
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
                    </div>
                </div>

                
            </div>
        </div>
    );
};

export default User;