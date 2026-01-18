import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  if (!isAuthenticated() & (location.pathname !== '/verify-otp')) {
    return <Navigate to="/auth" />;
  }

  return children;
};

export default ProtectedRoute;
