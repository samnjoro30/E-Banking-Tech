import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Auth from './pages/Auth';
// Other imports

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/auth" element={<Auth />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route 
                    path="/dashboard"
                    element= {
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />
                {/* Other routes */}
            </Routes>
        </Router>
    );
};

export default App;
