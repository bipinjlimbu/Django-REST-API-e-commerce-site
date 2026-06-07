import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../context/AuthContext'; // Tapaiko Axios instance wrapper 
import { ShoppingCart, LogOut, Search, LogIn, UserPlus, Loader2 } from 'lucide-react';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    // CART ENGINE COUNT TRACKING STATE
    const [cartCount, setCartCount] = useState(0);

    // LIVE STREAM CART ITEM COUNT FOR LOGGED IN CONSUMERS
    useEffect(() => {
        // SECURITY FILTER: Customers बाहेक अरुलाई API Hit गर्न नदिने
        if (!isAuthenticated || user?.is_staff) {
            setCartCount(0);
            return;
        }

        const syncNavbarCartCount = () => {
            api.get('/api/cart/')
                .then(response => {
                    const items = response.data?.cart_items || response.data || [];
                    const totalQuantity = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
                    setCartCount(totalQuantity);
                })
                .catch(err => {
                    console.error("Cart stream tracking bypass on Navbar node:", err);
                    setCartCount(0);
                });
        };

        syncNavbarCartCount();

        window.addEventListener('cartUpdated', syncNavbarCartCount);
        return () => window.removeEventListener('cartUpdated', syncNavbarCartCount);

    }, [isAuthenticated, user]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 gap-4">

                    {/* Brand Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-black text-red-600 tracking-wider font-sans uppercase">
                            Apex<span className="text-gray-900">Striker</span>
                        </Link>
                    </div>

                    {/* Central E-commerce Search Bar */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search premium gear..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                            />
                            <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-red-600 transition-colors">
                                <Search size={18} />
                            </button>
                        </div>
                    </form>

                    {/* Navigation Actions Profile */}
                    <div className="flex items-center space-x-4">

                        {/* 🎯 CUSTOMER CART GATEWAY PROTECTION */}
                        {isAuthenticated && !user?.is_staff && (
                            <>
                                <Link to="/cart" className="relative p-2 text-gray-600 hover:text-red-600 transition-colors">
                                    <ShoppingCart size={22} />
                                    {cartCount > 0 && (
                                        <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 py-0.5 text-[10px] font-black leading-none text-white bg-red-600 rounded-full border border-white transform translate-x-1 -translate-y-1 font-mono shadow-xs animate-in fade-in zoom-in duration-200">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                                <div className="h-6 w-px bg-gray-200"></div>
                            </>
                        )}

                        {/* Conditional Rendering Authentication States */}
                        {isAuthenticated ? (
                            /* LOGGED IN VIEW */
                            <div className="flex items-center space-x-4">
                                {user?.is_staff && (
                                    <span className="text-[10px] font-black bg-gray-900 text-white px-2 py-1 rounded tracking-wider uppercase">
                                        Admin Panel
                                    </span>
                                )}
                                <Link
                                    to="/profile"
                                    className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 ring-2 ring-transparent hover:ring-red-600 transition-all overflow-hidden focus:outline-none"
                                    title="View Profile"
                                >
                                    {user?.profile_picture ? (
                                        <img
                                            src={user.profile_picture}
                                            alt={user?.username}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xs font-bold uppercase tracking-wider text-white">
                                            {user?.username ? user.username.substring(0, 2) : 'AS'}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        ) : (
                            /* LOGGED OUT VIEW */
                            <div className="flex items-center space-x-2">
                                <Link
                                    to="/login"
                                    className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                                >
                                    <LogIn size={16} />
                                    <span>Login</span>
                                </Link>

                                <Link
                                    to="/register"
                                    className="flex items-center space-x-1 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 shadow-sm transition-colors"
                                >
                                    <UserPlus size={16} />
                                    <span>Register</span>
                                </Link>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;