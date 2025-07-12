import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/verify.css'; // Import your CSS file

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

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://e-banking-tech.onrender.com/api/auth/verify-otp', formData);
            setMessage(res.data.message);
            navigate('/auth');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error verifying OTP');
            console.log("the error", err.response || err.message)
        }
    };



    return (
        <div className="center-container">
            <div className="form-container">
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
                    <button type="th">Verify OTP</button>
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default VerifyOTP;
