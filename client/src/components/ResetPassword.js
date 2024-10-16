import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const { email, otp, newPassword, confirmNewPassword } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            setError("Passwords do not match");
            return;
        }
        try {
            const res = await axios.post('http://localhost:5000/api/auth/reset-password', { email, otp, newPassword });
            setMessage(res.data.message);
            setError('');
        } catch (err) {
            setMessage('');
            setError('Error resetting password');
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                />
                <input
                    type="text"
                    placeholder="Enter OTP"
                    name="otp"
                    value={otp}
                    onChange={onChange}
                    required
                />
                <input
                    type="password"
                    placeholder="Enter new password"
                    name="newPassword"
                    value={newPassword}
                    onChange={onChange}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm new password"
                    name="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={onChange}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    );
};

export default ResetPassword;
