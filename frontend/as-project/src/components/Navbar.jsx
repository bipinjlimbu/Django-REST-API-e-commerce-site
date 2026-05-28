import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        try {
            // Hit your Django blacklist view
            await axios.post(
                'http://127.0.0.1:8000/api/logout/',
                { refresh: refreshToken },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
        } catch (error) {
            console.error("Backend blacklist failed:", error);
        } finally {
            // Wipe local storage and context state regardless of backend response
            logout();
            setIsLoggingOut(false);
            navigate('/login', { replace: true });
        }
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Brand/Logo */}
                    <div className="flex items-center">
                        <Link to="/dashboard" className="text-xl font-bold text-blue-600 tracking-tight">
                            HackApp
                        </Link>
                    </div>

                    {/* User Actions Profile */}
                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-600">
                            Hi, <span className="font-semibold text-gray-900">{user?.username || 'User'}</span>
                        </div>

                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                            {isLoggingOut ? 'Signing out...' : 'Logout'}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;