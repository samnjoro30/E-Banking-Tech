import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../utils/auth'; // Token utility for authentication

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [editMode, setEditMode] = useState(null); 
    const [editUserData, setEditUserData] = useState({}); // User data in edit mode
    const [searchQuery, setSearchQuery] = useState(''); 
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [error, setError] = useState(''); // Error state

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const token = getToken();
                const res = await axios.get('https://e-banking-tech.onrender.com/api/admin/users', {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                setUsers(res.data);
                setError('');
            } catch (err) {
                setError('Failed to load users');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleEditUser = async (userId) => {
        const token = getToken();
        try {
            await axios.put(`https://e-banking-tech.onrender.com/api/admin/users/${userId}`, editUserData, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            alert('User updated successfully');
            setEditMode(null);
            // Update users locally for faster UI response
            setUsers(users.map(user => user._id === userId ? { ...user, ...editUserData } : user));
        } catch (err) {
            alert('Error updating user');
        }
    };

    const handleDeactivateUser = async (userId) => {
        if (!window.confirm('Are you sure you want to deactivate this user?')) return;
        
        const token = getToken();
        try {
            await axios.post(`https://e-banking-tech.onrender.com/api/admin/deactivate-user/${userId}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            alert('User deactivated successfully');
            
            setUsers(users.filter(user => user._id !== userId));
        } catch (err) {
            alert('Error deactivating user');
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredUsers = users.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <h2>User Management</h2>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ marginBottom: '20px', padding: '8px', width: '100%' }}
            />

            {isLoading ? (
                <p>Loading users...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user._id}>
                                <td>
                                    {editMode === user._id ? (
                                        <input
                                            type="text"
                                            value={editUserData.firstName || user.firstName}
                                            onChange={(e) => setEditUserData({ ...editUserData, firstName: e.target.value })}
                                        />
                                    ) : (
                                        user.firstName
                                    )}
                                </td>
                                <td>
                                    {editMode === user._id ? (
                                        <input
                                            type="text"
                                            value={editUserData.lastName || user.lastName}
                                            onChange={(e) => setEditUserData({ ...editUserData, lastName: e.target.value })}
                                        />
                                    ) : (
                                        user.lastName
                                    )}
                                </td>
                                <td>
                                    {editMode === user._id ? (
                                        <input
                                            type="text"
                                            value={editUserData.email || user.email}
                                            onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                                        />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td>
                                    {editMode === user._id ? (
                                        <>
                                            <button onClick={() => handleEditUser(user._id)}>Save</button>
                                            <button onClick={() => setEditMode(null)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => {
                                                setEditMode(user._id);
                                                setEditUserData(user);
                                            }}>
                                                Edit
                                            </button>
                                            <button onClick={() => handleDeactivateUser(user._id)}>Deactivate</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserManagement;
