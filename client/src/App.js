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
import ProtectedRoute from './components/ProtectedRoute';
import Auth from './pages/Auth';
import AdminDashboard from './pages/admin';  // Import the admin dashboard
import AuditLogs from './components/AuditLogs';  // Import audit logs component
import Reports from './components/Reports';  // Import reports component
import UserManagement from './components/UserManagement';  // Import user management component

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
                <Route 
                    path="/verify-otp"
                    element={
                            <VerifyOTP />
                       } 
                />
                <Route 
                    path="/dashboard"
                    element= {
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />
            
            <Route 
                    path="/admin" 
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/audit-logs" 
                    element={
                        <ProtectedRoute>
                            <AuditLogs />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/reports" 
                    element={
                        <ProtectedRoute>
                            <Reports />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/user-management" 
                    element={
                        <ProtectedRoute>
                            <UserManagement />
                        </ProtectedRoute>
                    } 
                />
            </Routes>    
        </Router>
    );
};

export default App;
