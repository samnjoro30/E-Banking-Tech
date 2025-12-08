import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import '../styles/login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { email, password } = formData;

    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Handle login form submission
    const onSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const res = await axiosInstance.post('/auth/login', { email, password }
            );

            const data = res.data.message;

            setMessage(data || 'Login successful! Redirecting...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            console.error(err.response?.data);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        placeholder="sam@gmail.com"
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                    />
                    <button type="button" onClick={togglePasswordVisibility}>
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">Login</button>
            </form>

            {/* Success message */}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            <p style={{ textAlign: 'center' }}>
                <a href="/forgot-password">You forgot your password?</a>
            </p>

        </div>
    );
};

export default Login;

