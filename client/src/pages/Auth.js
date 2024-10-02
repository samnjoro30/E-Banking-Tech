import React, { useState } from 'react';
import Register from '../components/Register';
import Login from '../components/Login';
import '../styles/Auth.css';  // Link to the CSS file

const Auth = () => {
    const [isLoginActive, setIsLoginActive] = useState(true);

    const toggleAuthMode = () => {
        setIsLoginActive(!isLoginActive);
        // Toggle diagonal animation
        const container = document.querySelector('.container');
        container.classList.toggle('diagonal-hide');
    };

    return (
        <div className="container">
            {/* Left Panel (Welcome/Login Form) */}
            <div className={`panel panel-left ${isLoginActive ? 'panel-visible' : ''}`}>
                <div className="panel-content">
                    {isLoginActive ? (
                        <div>
                            <h1>E-BANKING TECH</h1>
                            <h1>Welcome Back!</h1>
                            <p>Login to manage your account and enjoy seamless banking services.</p>
                            <Login />
                        </div>
                    ) : (
                        <div className="welcome-text">
                            <h1>Welcome to E-Banking</h1>
                            <p>Manage your finances seamlessly.</p>
                            <p>Features:</p>
                            <ul>
                                <li>Secure Transactions</li>
                                <li>24/7 Account Access</li>
                                <li>Instant Fund Transfers</li>
                                <li>Comprehensive Financial Insights</li>
                            </ul>
                        </div>
                    )}
                    <button className="switch-btn" onClick={toggleAuthMode}>
                        {isLoginActive ? 'Don\'t have an account? Register' : 'Already have an account? Login'}
                    </button>
                </div>
            </div>

            {/* Right Panel (Register Form/More Info) */}
            <div className={`panel panel-right ${isLoginActive ? '' : 'panel-visible'}`}>
                <div className="panel-content">
                    {!isLoginActive ? (
                        <div>
                            <h1>E-Banking Tech</h1>
                            <Register />
                        </div>
                    ) : (
                        <div>
                            <h1>Discover E-Banking Tech</h1>
                            <p>Join our e-banking platform to experience seamless banking solutions.</p>
                            <p>Features:</p>
                            <ul>
                                <li>Easy Registration</li>
                                <li>Secure Account Management</li>
                                <li>Instant Notifications</li>
                                <li>Customer Support</li>
                            </ul>
                        </div>
                    )}
                </div>
                <button className="switch-btn" onClick={toggleAuthMode}>
                    {isLoginActive ? 'Don\'t have an account? Register' : 'Already have an account? Login'}
                </button>
            </div>
        </div>
    );
};

export default Auth;
