import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: '',
        first_name: '',
        last_name: '',
        phone_number: '',
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear field-specific error as user typing updates state
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
            // Sends payload directly to your Django registration API route
            await axios.post('http://127.0.0.1:8000/api/register/', formData);

            setSuccessMessage('User created successfully! You can now sign in.');
            setFormData({
                username: '',
                email: '',
                password: '',
                confirm_password: '',
                first_name: '',
                last_name: '',
                phone_number: '',
            });
        } catch (err) {
            // Grabs Django API HTTP_400_BAD_REQUEST error dictionary payloads
            if (err.response && err.response.data) {
                setErrors(err.response.data);
            } else {
                setErrors({ global: 'Something went wrong. Is your server running?' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-16rem)] items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
            <div className="w-full max-w-lg space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-gray-100">

                {/* Brand & Heading Header Block */}
                <div className="text-center">
                    <h2 className="text-2xl font-black text-red-600 tracking-wider uppercase font-sans">
                        Apex<span className="text-gray-900">Striker</span>
                    </h2>
                    <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 uppercase">
                        Create An Account
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                        Join the squad and gear up with premium equipment
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>

                    {/* Success Alert Box */}
                    {successMessage && (
                        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3.5 text-sm font-semibold text-green-800 border border-green-200">
                            <ShieldCheck size={18} className="text-green-600 flex-shrink-0" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* Fatal Global Server Error Alert Box */}
                    {errors.global && (
                        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3.5 text-sm font-semibold text-red-800 border border-red-200">
                            <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
                            <span>{errors.global}</span>
                        </div>
                    )}

                    {/* Grid Wrapper for First and Last Names */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                placeholder="John"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="mt-1.5 block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-gray-50/50 focus:bg-white text-sm transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                placeholder="Doe"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="mt-1.5 block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-gray-50/50 focus:bg-white text-sm transition-all"
                            />
                        </div>
                    </div>

                    {/* Username Input Field */}
                    <div>
                        <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase">Username *</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="striker_elite"
                            value={formData.username}
                            onChange={handleChange}
                            className={`mt-1.5 block w-full rounded-lg border px-3.5 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 text-sm transition-all ${errors.username
                                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50/30'
                                    : 'border-gray-300 focus:ring-red-600 focus:border-red-600 bg-gray-50/50 focus:bg-white'
                                }`}
                        />
                        {errors.username && <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1"><AlertCircle size={12} />{errors.username}</p>}
                    </div>

                    {/* Email Input Field */}
                    <div>
                        <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase">Email *</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className={`mt-1.5 block w-full rounded-lg border px-3.5 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 text-sm transition-all ${errors.email
                                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50/30'
                                    : 'border-gray-300 focus:ring-red-600 focus:border-red-600 bg-gray-50/50 focus:bg-white'
                                }`}
                        />
                        {errors.email && <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1"><AlertCircle size={12} />{errors.email}</p>}
                    </div>

                    {/* Phone Number Input Field */}
                    <div>
                        <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase">Phone Number</label>
                        <input
                            type="text"
                            name="phone_number"
                            placeholder="+1 (555) 000-0000"
                            value={formData.phone_number}
                            onChange={handleChange}
                            className="mt-1.5 block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-gray-50/50 focus:bg-white text-sm transition-all"
                        />
                    </div>

                    {/* Grid Wrapper for Password Elements */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase">Password *</label>
                            <input
                                type="password"
                                name="password"
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
                        <div>
                            <label className="block text-xs font-bold tracking-wider text-gray-700 uppercase">Confirm Password *</label>
                            <input
                                type="password"
                                name="confirm_password"
                                placeholder="••••••••"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                className={`mt-1.5 block w-full rounded-lg border px-3.5 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 text-sm transition-all ${errors.confirm_password
                                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50/30'
                                        : 'border-gray-300 focus:ring-red-600 focus:border-red-600 bg-gray-50/50 focus:bg-white'
                                    }`}
                            />
                            {errors.confirm_password && (
                                <p className="mt-1 text-xs font-medium text-red-600 flex items-center gap-1"><AlertCircle size={12} />{errors.confirm_password}</p>
                            )}
                        </div>
                    </div>

                    {/* Core Registration Action Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full justify-center items-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all uppercase tracking-wider"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                'Register'
                            )}
                        </button>
                    </div>
                </form>

                {/* Footer Switch Anchor Box */}
                <div className="text-center pt-2">
                    <p className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-red-600 hover:text-red-700 hover:underline transition-colors">
                            Sign In Instead
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Register;