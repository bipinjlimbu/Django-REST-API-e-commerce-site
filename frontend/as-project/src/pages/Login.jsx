import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '', // This can accept either username or email now
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrors({});
        setIsLoading(true);

        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/login/',
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            setSuccessMessage('Login successful! Redirecting...');

            // Pass the verified user data and tokens into the global auth system
            login(response.data.user, response.data.tokens);

            setFormData({ username: '', password: '' });

            // Direct route transition to your dashboard
            setTimeout(() => {
                navigate('/');
            }, 1000);

        } catch (err) {
            if (err.response && err.response.data) {
                setErrors(err.response.data);
            } else {
                setErrors({ global: 'Unable to connect to authentication server.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-gray-100">

                {/* Brand & Heading Header Block */}
                <div className="text-center">
                    <h2 className="text-2xl font-black text-red-600 tracking-wider uppercase font-sans">
                        Apex<span className="text-gray-900">Striker</span>
                    </h2>
                    <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 uppercase">
                        Welcome Back
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Access your elite athletic dashboard
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* Success Alert Alert Box */}
                    {successMessage && (
                        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3.5 text-sm font-semibold text-green-800 border border-green-200">
                            <ShieldCheck size={18} className="text-green-600 flex-shrink-0" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* Fatal Error Alert Box */}
                    {(errors.error || errors.global) && (
                        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3.5 text-sm font-semibold text-red-800 border border-red-200">
                            <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
                            <span>{errors.error || errors.global}</span>
                        </div>
                    )}

                    {/* Username or Email Inputs Input Canvas */}
                    <div>
                        <label htmlFor="username-field" className="block text-xs font-bold tracking-wider text-gray-700 uppercase">
                            Username or Email
                        </label>
                        <input
                            id="username-field"
                            type="text"
                            name="username"
                            autoComplete="username"
                            placeholder="Enter your credential"
                            value={formData.username}
                            onChange={handleChange}
                            className={`mt-1.5 block w-full rounded-lg border px-3.5 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 text-sm transition-all ${errors.username
                                ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50/30'
                                : 'border-gray-300 focus:ring-red-600 focus:border-red-600 bg-gray-50/50 focus:bg-white'
                                }`}
                        />
                        {errors.username && <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1"><AlertCircle size={12} />{errors.username}</p>}
                    </div>

                    {/* Password Input Canvas */}
                    <div>
                        <label htmlFor="password-field" className="block text-xs font-bold tracking-wider text-gray-700 uppercase">
                            Password
                        </label>
                        <input
                            id="password-field"
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className={`mt-1.5 block w-full rounded-lg border px-3.5 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 text-sm transition-all ${errors.password
                                ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50/30'
                                : 'border-gray-300 focus:ring-red-600 focus:border-red-600 bg-gray-50/50 focus:bg-white'
                                }`}
                        />
                        {errors.password && <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1"><AlertCircle size={12} />{errors.password}</p>}
                    </div>

                    {/* Submission Core Action Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full justify-center items-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 transition-all uppercase tracking-wider"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </div>
                </form>

                {/* Footer Switch Anchor Context */}
                <div className="text-center pt-2">
                    <p className="text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-bold text-red-600 hover:text-red-700 hover:underline transition-colors">
                            Register Here
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Login;