import React, { useState } from 'react';
import axios from 'axios';

const VerifyOTP = () => {
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
    });
    const [message, setMessage] = useState('');

    const { email, otp } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/verify-otp', formData);
            setMessage(res.data.message);
        } catch (err) {
            setMessage('Error verifying OTP');
        }
    };

    return (
        <div>
            <h2>Verify OTP</h2>
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
                <button type="submit">Verify OTP</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default VerifyOTP;
