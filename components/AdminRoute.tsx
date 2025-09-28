

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated || user?.role !== 'admin') {
        // Redirect them to the home page if they are not authenticated or not an admin
        return <Navigate to="/" replace />;
    }

    return children;
};