// Sidebar.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/sidebar.css';
import { FaHome, FaListAlt, FaMoneyCheckAlt, FaFileInvoice, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [userProfile, setUserProfile] = useState({ username: '', accountNumber: '' });
    const navigate = useNavigate();

    // Fetch Menu Items and User Profile
    useEffect(() => {
        const fetchSidebarData = async () => {
            try {
                // Fetch menu items
                const menuResponse = await axios.get('/api/sidebar/menu'); // Replace with actual API endpoint
                setMenuItems(menuResponse.data);

                // Fetch user profile details
                const profileResponse = await axios.get('/api/user/profile'); // Replace with actual API endpoint
                setUserProfile(profileResponse.data);
            } catch (error) {
                console.error('Error fetching sidebar data:', error);
            }
        };

        fetchSidebarData();
    }, []);

    // Handle Logout
    // const handleLogout = async () => {
    //     try {
    //         await axios.post('/api/auth/logout'); // Replace with actual API endpoint
    //         navigate('/login'); // Redirect to login after logout
    //     } catch (error) {
    //         console.error('Error during logout:', error);
    //     }
    // };

    return (
        <div className="sidebar">
            {/* Logo and Bank Name */}
            <div className="logo-section">
                <h1 className="bank-logo">🏦</h1>
                <h2 className="bank-name">E-Banking</h2>
            </div>

            {/* User Profile */}
            <div className="user-profile">
                <h3>{userProfile.username}</h3>
                <p>Account: {userProfile.accountNumber}</p>
            </div>

            {/* Navigation Menu */}
            <nav className="nav-menu">
                <ul>
                    {menuItems.map((item) => (
                        <li key={item.id} onClick={() => navigate(item.path)}>
                            {item.icon === 'home' && <FaHome className="icon" />}
                            {item.icon === 'transactions' && <FaListAlt className="icon" />}
                            {item.icon === 'transfer' && <FaMoneyCheckAlt className="icon" />}
                            {item.icon === 'bills' && <FaFileInvoice className="icon" />}
                            {item.icon === 'profile' && <FaUser className="icon" />}
                            <span>{item.name}</span>
                        </li>
                    ))}
                    <li onClick={handleLogout} className="logout">
                        <FaSignOutAlt className="icon" /> Logout
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
