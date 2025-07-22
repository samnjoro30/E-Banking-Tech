import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { io } from 'socket.io-client';
import Register from './components/Register';
import Login from './components/Login';
import ResetPassword from './components/ResetPassword';
import ForgotPassword from './components/ForgotPassword';
import VerifyOTP from './components/VerifyOtp';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
//import "./index.css";
// Other imports
const socket = io('https://e-banking-tech.onrender.com');

const App = () => {
    useEffect(() => {
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
                <Route path="/" element={<Home />}/>
                <Route path="/auth" element={<Auth />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={ <VerifyOTP />} />
                <Route path="/dashboard" element= { <Dashboard /> } />
            </Routes>    
        </Router>
    );
};

export default App;
