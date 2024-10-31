import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { getToken, removeToken } from '../utils/auth';
import axios from 'axios';
import '../styles/user.css';

const User = () =>{
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        accountNumber: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getToken();
                const res = await axios.get('https://e-banking-tech.onrender.com/api/auth/dashboard',{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUserData(res.data.user);
            }catch(error){
                setError('Failed to fetch user data. Please log in again.', error);
                navigate('/login');
            }
        };
        fetchData();
    },[navigate]);
    return(
        <div className="user-dashboard">
            {error && <p className="error-message">{error}</p>}
            <h2>User Dashboard</h2>
            <div className="user-info">
                <p><strong>First Name:</strong> {userData.firstName}</p>
                <p><strong>Last Name:</strong> {userData.lastName}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Account Number:</strong> {userData.accountNumber}</p>
            </div>
        </div>

    );
}

export default User;
