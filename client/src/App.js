import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { io } from 'socket.io-client';
import Register from './auth/Register';
import Login from './auth/Login';
import Home from './pages/Home';
import Dashboard from './dashboard/Dashboard';
import Auth from './auth/Auth';

const socket = io('https://e-banking-tech.onrender.com', {
  withCredentials: true,
});

const App = () => {
  useEffect(() => {
    //fetchCsrfToken().catch(console.error);
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
