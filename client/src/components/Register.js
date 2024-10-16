import React, { useState } from 'react';
import axios from 'axios';
import zxcvbn from 'zxcvbn';  // For password strength checking
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [otp, setOtp] = useState(''); // For storing the OTP input
    const [otpSent, setOtpSent] = useState(false); 
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordComplexity, setPasswordComplexity] = useState({
        hasLowercase: false,
        hasUppercase: false,
        hasNumber: false,
        hasSpecialChar: false
    });
     
    
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { firstName, lastName, email, password, confirmPassword} = formData;


    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'password') {
            const complexity = checkPasswordComplexity(value);
            setPasswordComplexity(complexity);

            const strength = zxcvbn(value);
            setPasswordStrength(strength.score);  // Update strength score
        }
    };
    const checkPasswordComplexity = (password) => {
        return {
            hasLowercase: /[a-z]/.test(password),
            hasUppercase: /[A-Z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };
    };
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match", error);
            return;
        }
        try {
            const res = await axios.post('https://e-banking-tech.onrender.com/api/auth/register', formData);
            setOtpSent(true); // OTP has been sent
            setMessage('Registration successful! OTP sent to your email.', message);
            console.log(res.data);
            
            // Handle successful registration (e.g., redirect to OTP verification page)
            const response = await axios.post('https://e-banking-tech.onrender.com/api/generate-card', {
                cardHolder: `${formData.firstName} ${formData.lastName}`});


            const cardDetails = response.data;
            console.log(cardDetails);
        } catch (err) {
            setMessage(err.response.data.message);
            console.error(err.response.data);
            // Handle registration error
        }
    };
    const verifyOtp = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://e-banking-tech.onrender.com/api/auth/verify-otp', { email, otp });
            // Assume the response contains the account number
            const accountNumber = res.data.accountNumber;

            setMessage(`OTP verified successfully! Your account number is ${accountNumber}`);
            setTimeout(() => {
                navigate('/login'); // Redirect to login after successful OTP verification
            }, 3000); // Redirect after 3 seconds
        } catch (err) {
            setError(err.response?.data?.message || "Error verifying OTP");
            console.error(err.response?.data);
        }
    };
    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={onSubmit}>
                <div>
                    <label>First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={firstName}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <label>Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={lastName}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <p>Password Strength: {['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength]}</p>
                </div>
                {/* Display error message if passwords don't match */}
                {error && <p style={{ color: 'red' }}>{error}</p>}


                <button type="submit">Register</button>
            </form>
            {/* OTP Input Field */}
            {otpSent && (
                <form onSubmit={verifyOtp}>
                    <div>
                        <label>Enter OTP</label>
                        <input
                            type="text"
                            name="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Verify OTP</button>
                </form>
            )}

            {/* Success message */}
            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;         



 
