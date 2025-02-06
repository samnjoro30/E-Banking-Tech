import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import axiosInstance from './axiosInstance';
import '../styles/notification.css';

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        // Fetch notifications (you can replace the URL with your API endpoint)
        const fetchNotifications = async () => {
            try {
                const res = await axiosInstance.get('/notifications');
                setNotifications(res.data);
            } catch (error) {
                console.error('Failed to fetch notifications', error);
            }
        };

        fetchNotifications();
    }, []);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <div className="notification-container">
            <FontAwesomeIcon 
                icon={faBell} 
                className="notification-icon" 
                onClick={toggleDropdown} 
            />
            {showDropdown && (
                <div className="notification-dropdown">
                    <h3>Notifications</h3>
                    {notifications.length > 0 ? (
                        <ul>
                            {notifications.map((notification, index) => (
                                <li key={index}>
                                    {notification.message}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No new notifications</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Notification;
