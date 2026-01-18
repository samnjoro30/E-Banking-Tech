import React, { useState, useEffect } from 'react';
import axiosInstance from '../../components/axiosInstance';
import { resolve } from 'path/posix';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get('admin/users');
        const userData = Array.isArray(res.data) ? res.data : [];
        setUsers(userData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Registers Users</h1>
      <div>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Phone Number </th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <th>{user.email}</th>
                <th>{user.firstName}</th>
                <th>{user.lastName}</th>
                <th>{user.phoneNumber}</th>
                <th>{user.gender}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
