import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, isAuthenticated, removeToken } from '../utils/auth';
import axiosInstance from './axiosInstance';
//import '../styles/user.css';
import { FaUser, FaEnvelope, FaIdCard, FaCreditCard, FaCalendarAlt } from 'react-icons/fa';
import DashboardSectionWrapper from './dashbordwrapper';

const User = () => {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        accountNumber: '',
        balance: 500
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [balance, setBalance] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
          if (!isAuthenticated()) {
            navigate('/auth');
            return;
          }
          
          try {
            const res = await axiosInstance.get('/auth/dashboard');
            setUserData({
              firstName: res.data.firstName || '',
              lastName: res.data.lastName || '',
              email: res.data.email || '',
              accountNumber: res.data.accountNumber || '',
              balance: res.data.balance || 0,
            });
            console.log('data from backend', res);
          } catch (error) {
            if (error.response?.status === 401) {
              removeToken();
              setError('Session expired. Please log in again.');
              navigate('/auth');
            } else {
              setError('Failed to fetch user data. Please try again later.');
            }
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
        <DashboardSectionWrapper>
            
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
                            <span className="info-label">Account Balance:</span>
                            <span className="info-value">Ksh {balance.toFixed(2)}</span> 
                        </div>
                    </div>
                </div>
            </div>
          
        </DashboardSectionWrapper>
       
    );
};

export default User;