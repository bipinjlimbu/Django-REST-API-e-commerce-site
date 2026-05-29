import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    // Show nothing or a clean spinner while checking localStorage on boot
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-sm font-medium text-gray-500">Loading application...</div>
            </div>
        );
    }

    // If not authenticated, force them to the login page
    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;