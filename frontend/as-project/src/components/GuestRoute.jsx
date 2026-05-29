import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GuestRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-sm font-medium text-gray-500 animate-pulse">
                    Loading session...
                </div>
            </div>
        );
    }

    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
};

export default GuestRoute;