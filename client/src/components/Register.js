import React, { useState } from 'react';
import axios from 'axios';
import axiosInstance from './axiosInstance';
import zxcvbn from 'zxcvbn';  // For password strength checking
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';


const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
       // dob: '',
        email: '',
        //pin: '',
        gender: '',
        password: '',
        confirmPassword: ''
    });

    const [isUnder18, setIsUnder18] = useState(false);
    const [pin, setPin] = useState('');
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
    const { firstName, lastName, email, password, confirmPassword, dob, phoneNumber, gender} = formData;


    const onChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'pin') {
            setPin(value);
        } else {
            setFormData({ ...formData, [name]: value });
        }
        if (name === 'dob') {
            checkAge(value);
        } else if (name === 'password') {
            const complexity = checkPasswordComplexity(value);
            setPasswordComplexity(complexity);
            const strength = zxcvbn(value);
            setPasswordStrength(strength.score);
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
            const res = await axiosInstance.post('/auth/register', formData);
            if (res.status === 201 && res.data.message.includes("OTP sent")) {
                setOtpSent(true);  // Set otpSent true only on success
                setMessage('Registration successful! OTP sent to your email.');
                sessionStorage.setItem('email', formData.email);
                console.log("OTP email sent, form state updated.");
                navigate('/verify-otp'); 
            }
            
        } catch (err) {
            setMessage(err.response.data.message);
            console.error(err.response.data);
            // Handle registration error
        }
    };
    const checkAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        setIsUnder18(age < 18);
    };
    const verifyOtp = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post('/auth/verify-otp', { email, otp });
            // Assume the response contains the account number
            const accountNumber = res.data.accountNumber;

            setMessage(`OTP verified successfully! Your account number is ${accountNumber}`);
            setTimeout(() => {
                navigate('/'); // Redirect to login after successful OTP verification
            }, 3000); // Redirect after 3 seconds
        } catch (err) {
            setError(err.response?.data?.message || "Error verifying OTP");
            console.error(err.response?.data);
        }
    };

    const handleNext = () => setStep((prevStep) => prevStep + 1);
    const handlePrevious = () => setStep((prevStep) => prevStep - 1);

    return (
        <div>
            <h1>Register</h1>
            {!otpSent ? (
            <form onSubmit={onSubmit}>
            {step === 1 && (
                    <div>
                        <h2>Step 1: Personal Information</h2>
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={firstName}
                            onChange={onChange}
                            required
                        />
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={lastName}
                            onChange={onChange}
                            required
                        />
                        {/* <label>Date of Birth</label>
                        <input
                           type="date"
                           name="dob"
                           value={dob}
                           onChange={onChange}
                           required
                        />

                        {isUnder18 && (
                        <p style={{ color: 'blue' }}>
                           You are under 18. Would you like to open a Teens Savings Account?
                        </p>
                         )} */}
                        <label>Gender:</label>
                        <select
                           name="gender"
                           type="text"
                           value={formData.gender}
                           onChange={onChange}
                           required
                        >
                           <option value="">Select Gender</option>
                           <option value="Male">Male</option>
                           <option value="Female">Female</option>
                           <option value="Other">Other</option>
                        </select>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                        />

                        <label>Phone Number:</label>
                        <input
                           type="text"
                           name="phoneNumber"
                           placeholder="07XXXXXXXX or 01XXXXXXXX"
                           pattern="(07|01)\d{8}"
                           title="Please enter a valid 10-digit phone number starting with 07 or 01"
                           value={formData.phoneNumber}
                           onChange={onChange}
                           required
                        />
                        {formData.phoneNumber && !/^(07|01)\d{8}$/.test(formData.phoneNumber) && (
                           <p style={{ color: 'red', fontSize: 'smaller' }}>Please enter a valid 10-digit phone number starting with 07 or 01.</p>
                        )}
                        <button type="button" onClick={handleNext}>Next</button>
                    </div>
                )}
                {step === 2 && (
                    <div>
                        <h2>Step 2: Security Information</h2>
                        {/* <label>PIN (5 digits)</label>
                        <input
                            type="text"
                            name="pin"
                            value={pin}
                            onChange={onChange}
                            maxLength={5}
                            pattern="\d{5}"
                            required
                        /> */}
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                        />
                        {formData.password && formData.password.length < 8 && (
                          <p style={{ color: 'red', fontSize: 'smaller' }}>Password must be at least 8 characters long.</p>
                        )}
                        {formData.password && !/[A-Z]/.test(formData.password) && (
                           <p style={{ color: 'red' }}>Password must contain at least one uppercase letter.</p>
                        )}
                        {formData.password && !/[a-z]/.test(formData.password) && (
                           <p style={{ color: 'red', fontSize: 'smaller' }}>Password must contain at least one lowercase letter.</p>
                        )}
                        {formData.password && !/[0-9]/.test(formData.password) && (
                            <p style={{ color: 'red', fontSize: 'smaller' }}>Password must contain at least one number.</p>
                        )}
                        {formData.password && !/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) && (
                           <p style={{ color: 'red', fontSize: 'smaller' }}>Password must contain at least one special character.</p>
                        )}

                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={onChange}
                            required
                        />
                        {formData.password && formData.password !== formData.confirmPassword && (
                          <p style={{ color: 'red', fontSize: 'smaller' }}>The passwords don't match!</p>
                        )}

                        <button type="button" onClick={handlePrevious}>Previous</button>
                        <button type="button" onClick={handleNext}>Next</button>
                    </div>
                )}
                {step === 3 && (
                    <div>
                        <h2>Step 3: Confirm & Submit</h2>
                        <p>Review your information and submit.</p>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <button type="button" onClick={handlePrevious}>Previous</button>
                        <button type="submit">Register</button>
                    </div>
                )}

            </form>
            ) :(
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



 
