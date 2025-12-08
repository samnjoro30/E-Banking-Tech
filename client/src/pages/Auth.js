import React, { useState } from 'react';
import Register from '../auth/Register';
import Login from '../auth/Login';
import '../styles/Auth.css';

const Auth = () => {
    const [isLoginActive, setIsLoginActive] = useState(true);

    const toggleAuthMode = () => {
        setIsLoginActive(!isLoginActive);
    };

    return (
        <div className="container">
            <div className={`panel ${isLoginActive ? 'panel-left' : 'panel-right'}`}>
                {/* Info Panel */}
                <div className="panel-info">
                    {isLoginActive ? (
                        <>
                            <h1>Welcome to E-payment Platform</h1>
                            <p>Manage your finances seamlessly.</p>
                            <ul>
                                <li>Secure Transactions</li>
                                <li>24/7 Account Access</li>
                                <li>Instant Fund Transfers</li>
                                <li>Financial Insights</li>
                            </ul>
                            <button className="switch-btn" onClick={toggleAuthMode}>
                                Don't have an account? Register
                            </button>
                        </>
                    ) : (
                        <>
                            <h1>Discover E-Payment Platform</h1>
                            <ul>
                                <li>Easy Registration</li>
                                <li>Secure Account Management</li>
                                <li>Instant Notifications</li>
                                <li>Customer Support</li>
                            </ul>
                            <button className="switch-btn" onClick={toggleAuthMode}>
                                Already have an account? Login
                            </button>
                        </>
                    )}
                </div>

                {/* Main Auth Content */}
                <div className="panel-content">
                    {isLoginActive ? (
                        <>
                            <h1>E-Payment platform</h1>
                            <h2>Welcome Back!</h2>
                            <p>Login to manage your account and enjoy seamless banking services.</p>
                            <Login />
                        </>
                    ) : (
                        <>
                            <h1>E-Payment Platform</h1>
                            <Register />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Auth;