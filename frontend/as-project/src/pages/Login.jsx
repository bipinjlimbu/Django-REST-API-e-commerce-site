import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md">
                <div>
                    <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
                        Sign In
                    </h2>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {successMessage && (
                        <div className="rounded-md bg-green-50 p-3 text-center text-sm font-medium text-green-800">
                            {successMessage}
                        </div>
                    )}

                    {(errors.error || errors.global) && (
                        <div className="rounded-md bg-red-50 p-3 text-center text-sm font-medium text-red-800">
                            {errors.error || errors.global}
                        </div>
                    )}

                    <div>
                        <label htmlFor="username-field" className="block text-sm font-medium text-gray-700">
                            Username or Email
                        </label>
                        <input
                            id="username-field"
                            type="text"
                            name="username"
                            autoComplete="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 text-sm ${errors.username ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                                }`}
                        />
                        {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username}</p>}
                    </div>

                    <div>
                        <label htmlFor="password-field" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password-field"
                            type="password"
                            name="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`mt-1 block w-full rounded-md border px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 text-sm ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                                }`}
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;