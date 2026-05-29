import React, { useState } from 'react';

import { useAuth } from '../context/AuthContext';

import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import {
    User, Mail, Phone, Package, ShieldCheck,
    Edit3, LogOut, Trash2, X, Check, Loader2, AlertTriangle
} from 'lucide-react';

const Profile = () => {

    const { user, logout, login } = useAuth();

    const navigate = useNavigate();

    // UI and Interaction states

    const [isEditing, setIsEditing] = useState(false);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const [errors, setErrors] = useState({});

    const [successMessage, setSuccessMessage] = useState('');

    // Form data tracking matching your registration payload structure

    const [formData, setFormData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        username: user?.username || '',
        email: user?.email || '',
        phone_number: user?.phone_number || '',
        profile_image: null,
    });

    const [profilePreview, setProfilePreview] = useState(
        user?.profile_image || ''
    );

    const handleChange = (e) => {

        const { name, value, files } = e.target;

        if (name === 'profile_image') {

            const file = files[0];

            setFormData({
                ...formData,
                profile_image: file
            });

            if (file) {
                setProfilePreview(URL.createObjectURL(file));
            }

            return;
        }

        setFormData({
            ...formData,
            [name]: value
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    // 1. Core Profile Update (Django PUT/PATCH integration placeholder)

    const handleUpdateProfile = async (e) => {

        e.preventDefault();

        setIsLoading(true);

        setErrors({});

        setSuccessMessage('');

        const accessToken = localStorage.getItem('access_token');

        try {

            const payload = new FormData();

            payload.append('first_name', formData.first_name);
            payload.append('last_name', formData.last_name);
            payload.append('username', formData.username);
            payload.append('email', formData.email);
            payload.append('phone_number', formData.phone_number);

            if (formData.profile_image) {
                payload.append('profile_image', formData.profile_image);
            }

            const response = await axios.put(
                `http://127.0.0.1:8000/api/profile/${user.id}/`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            // Re-sync local global auth state context with backend payload response

            if (response.data.user) {
                login(response.data.user, response.data.tokens || null);
            }

            setSuccessMessage('Profile records updated successfully.');

            setIsEditing(false);

        } catch (err) {

            if (err.response && err.response.data) {
                setErrors(err.response.data);
            } else {
                setErrors({ global: 'Failed to update user parameters.' });
            }

        } finally {
            setIsLoading(false);
        }

    };

    // 2. Core Explicit Logout Controller Action

    const handleLogoutClick = async () => {

        setIsLoggingOut(true);

        const accessToken = localStorage.getItem('access_token');

        const refreshToken = localStorage.getItem('refresh_token');

        try {

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

            console.error("Blacklist failure during account dispatch context:", error);

        } finally {

            logout();

            setIsLoggingOut(false);

            navigate('/', { replace: true });

        }

    };

    // 3. Destructive Profile Termination Action

    const handleDeleteAccount = async () => {

        setIsLoading(true);

        const accessToken = localStorage.getItem('access_token');

        try {

            await axios.delete(
                `http://127.0.0.1:8000/api/profile/${user.id}/`,
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                }
            );

            logout();

            navigate('/', { replace: true });

        } catch (err) {

            setErrors({
                global: 'Failed to complete transaction safely.'
            });

            setShowDeleteConfirm(false);

        } finally {

            setIsLoading(false);

        }

    };

    const initialStats = [
        { name: 'Active Orders', count: '0', icon: Package },
        { name: 'Completed Deliveries', count: '0', icon: ShieldCheck },
    ];

    return (

        <div className="min-h-[calc(100vh-16rem)] py-10 px-4 sm:px-6 lg:px-8 bg-gray-50/50">

            <div className="max-w-4xl mx-auto space-y-6">

                {/* Status Feedback Notice Areas */}

                {successMessage && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-sm font-semibold text-green-800 border border-green-200 shadow-sm">
                        <ShieldCheck size={18} className="text-green-600 flex-shrink-0" />
                        <span>{successMessage}</span>
                    </div>
                )}

                {errors.global && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-800 border border-red-200 shadow-sm">
                        <AlertTriangle size={18} className="text-red-600 flex-shrink-0" />
                        <span>{errors.global}</span>
                    </div>
                )}

                {/* Profile Information Top Deck Header Banner */}

                <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">

                    <div className="absolute top-0 left-0 w-2 h-full bg-red-600"></div>

                    <div className="flex flex-col sm:flex-row items-center gap-6">

                        <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 border-4 border-white shadow-md overflow-hidden">

                            {profilePreview ? (
                                <img
                                    src={profilePreview}
                                    alt={user?.username}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-2xl font-black uppercase text-white tracking-widest">
                                    {user?.username
                                        ? user.username.substring(0, 2)
                                        : 'AS'}
                                </span>
                            )}

                        </div>

                        <div className="text-center sm:text-left space-y-1">

                            <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-bold text-red-600 uppercase tracking-wide">
                                Elite Striker Member
                            </div>

                            <h2 className="text-2xl font-extrabold text-gray-900 uppercase tracking-tight">
                                {user?.first_name || user?.last_name
                                    ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                                    : 'Apex Member'}
                            </h2>

                            <p className="text-sm font-medium text-gray-500">
                                @{formData.username || 'username'}
                            </p>

                        </div>

                    </div>

                    {/* Fast Navigation Control Deck Blocks */}

                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-center">

                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:text-red-600 hover:border-red-600 transition-all w-full sm:w-auto"
                            >
                                <Edit3 size={14} /> Edit Data
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setErrors({});
                                }}
                                className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all w-full sm:w-auto"
                            >
                                <X size={14} /> Cancel
                            </button>
                        )}

                        <button
                            onClick={handleLogoutClick}
                            disabled={isLoggingOut}
                            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider text-white bg-gray-900 rounded-lg shadow-md hover:bg-red-600 transition-all disabled:bg-gray-400 w-full sm:w-auto"
                        >

                            {isLoggingOut
                                ? <Loader2 size={14} className="animate-spin" />
                                : <LogOut size={14} />
                            }

                            <span>Logout</span>

                        </button>

                    </div>

                </div>

                {/* Main Action Workspaces Form Split */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Interactive Info/Edit Form Block */}

                    <form
                        onSubmit={handleUpdateProfile}
                        className="md:col-span-2 space-y-6"
                    >

                        <div className="rounded-2xl bg-white p-6 shadow-xl border border-gray-100 space-y-5">

                            <h3 className="text-base font-black uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3 flex justify-between items-center">

                                <span>Personal Account Credentials</span>

                                {isEditing && (
                                    <span className="text-xs text-red-500 font-bold normal-case animate-pulse">
                                        Editing Mode Active
                                    </span>
                                )}

                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                {/* First Name */}

                                <div className="space-y-1.5">

                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                        <User size={12} /> First Name
                                    </label>

                                    <input
                                        type="text"
                                        name="first_name"
                                        disabled={!isEditing || isLoading}
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        className={`w-full text-sm font-semibold rounded-lg px-3.5 py-2 border transition-all ${isEditing
                                            ? 'border-gray-300 focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white text-gray-900'
                                            : 'border-transparent bg-gray-50 text-gray-700 cursor-not-allowed'
                                            }`}
                                    />

                                </div>

                                {/* Last Name */}

                                <div className="space-y-1.5">

                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                        <User size={12} /> Last Name
                                    </label>

                                    <input
                                        type="text"
                                        name="last_name"
                                        disabled={!isEditing || isLoading}
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        className={`w-full text-sm font-semibold rounded-lg px-3.5 py-2 border transition-all ${isEditing
                                            ? 'border-gray-300 focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white text-gray-900'
                                            : 'border-transparent bg-gray-50 text-gray-700 cursor-not-allowed'
                                            }`}
                                    />

                                </div>

                                {/* Username */}

                                <div className="space-y-1.5 sm:col-span-2">

                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                        <User size={12} /> Username
                                    </label>

                                    <input
                                        type="text"
                                        name="username"
                                        disabled={!isEditing || isLoading}
                                        value={formData.username}
                                        onChange={handleChange}
                                        className={`w-full text-sm font-semibold rounded-lg px-3.5 py-2 border transition-all ${isEditing
                                            ? 'border-gray-300 focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white text-gray-900'
                                            : 'border-transparent bg-gray-50 text-gray-700 cursor-not-allowed'
                                            }`}
                                    />

                                    {errors.username && (
                                        <p className="text-xs font-semibold text-red-600 mt-1">
                                            {errors.username}
                                        </p>
                                    )}

                                </div>

                                {/* Email */}

                                <div className="space-y-1.5 sm:col-span-2">

                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                        <Mail size={12} /> Email Address
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        disabled={!isEditing || isLoading}
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full text-sm font-semibold rounded-lg px-3.5 py-2 border transition-all ${isEditing
                                            ? 'border-gray-300 focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white text-gray-900'
                                            : 'border-transparent bg-gray-50 text-gray-700 cursor-not-allowed'
                                            }`}
                                    />

                                    {errors.email && (
                                        <p className="text-xs font-semibold text-red-600 mt-1">
                                            {errors.email}
                                        </p>
                                    )}

                                </div>

                                {/* Phone */}

                                <div className="space-y-1.5 sm:col-span-2">

                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                        <Phone size={12} /> Contact Mobile Number
                                    </label>

                                    <input
                                        type="text"
                                        name="phone_number"
                                        disabled={!isEditing || isLoading}
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        className={`w-full text-sm font-semibold rounded-lg px-3.5 py-2 border transition-all ${isEditing
                                            ? 'border-gray-300 focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white text-gray-900'
                                            : 'border-transparent bg-gray-50 text-gray-700 cursor-not-allowed'
                                            }`}
                                    />

                                </div>

                                {/* Profile Image */}

                                <div className="space-y-1.5 sm:col-span-2">

                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                        <User size={12} /> Profile Picture
                                    </label>

                                    <input
                                        type="file"
                                        name="profile_image"
                                        accept="image/*"
                                        disabled={!isEditing || isLoading}
                                        onChange={handleChange}
                                        className={`w-full text-sm font-semibold rounded-lg px-3 py-2 border transition-all file:mr-3 file:px-3 file:py-1 file:border-0 file:bg-red-600 file:text-white file:text-xs file:font-bold file:rounded-md hover:file:bg-red-700 ${isEditing
                                            ? 'border-gray-300 bg-white text-gray-900'
                                            : 'border-transparent bg-gray-50 text-gray-700 cursor-not-allowed'
                                            }`}
                                    />

                                </div>

                            </div>

                            {/* Save modifications block section element conditional */}

                            {isEditing && (
                                <div className="pt-2 flex justify-end">

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex items-center gap-2 justify-center px-5 py-2.5 bg-red-600 text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-red-700 shadow-md transition-all disabled:bg-gray-400"
                                    >

                                        {isLoading
                                            ? <Loader2 size={14} className="animate-spin" />
                                            : <Check size={14} />
                                        }

                                        Save Changes

                                    </button>

                                </div>
                            )}

                        </div>

                    </form>

                    {/* Side Sidebar Metric Widgets */}

                    <div className="space-y-6">

                        <div className="rounded-2xl bg-white p-6 shadow-xl border border-gray-100 space-y-4">

                            <h3 className="text-base font-black uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-3">
                                Order Activity
                            </h3>

                            <div className="grid grid-cols-1 gap-3">

                                {initialStats.map((stat, idx) => {

                                    const IconComponent = stat.icon;

                                    return (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-xl"
                                        >

                                            <div className="flex items-center gap-2 text-gray-600">
                                                <IconComponent size={16} className="text-red-600" />
                                                <span className="text-xs font-bold uppercase tracking-wide">
                                                    {stat.name}
                                                </span>
                                            </div>

                                            <span className="text-lg font-black text-gray-900">
                                                {stat.count}
                                            </span>

                                        </div>
                                    );

                                })}

                            </div>

                        </div>

                        {/* Dangerous Destructive Settings Block */}

                        <div className="rounded-2xl bg-red-50/50 p-5 border border-red-100 shadow-sm space-y-3">

                            <h4 className="text-xs font-black uppercase tracking-wider text-red-600 flex items-center gap-1">
                                <AlertTriangle size={14} /> Danger Zone
                            </h4>

                            <p className="text-xs text-gray-500 leading-relaxed">
                                Deleting an account removes transaction logs,
                                shipping addresses, and saved credentials immediately.
                            </p>

                            {!showDeleteConfirm ? (

                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="flex w-full items-center justify-center gap-1 px-3 py-2 text-xs font-bold text-red-600 bg-red-100 rounded-lg hover:bg-red-200 hover:text-red-700 transition-all border border-red-200"
                                >
                                    <Trash2 size={13} /> Terminate Account
                                </button>

                            ) : (

                                <div className="space-y-2 pt-1 border-t border-red-200/50 animate-fadeIn">

                                    <p className="text-xs font-bold text-red-700 text-center">
                                        Are you absolute sure?
                                    </p>

                                    <div className="grid grid-cols-2 gap-2">

                                        <button
                                            type="button"
                                            onClick={handleDeleteAccount}
                                            disabled={isLoading}
                                            className="px-2 py-1.5 bg-red-600 text-white rounded-md text-xs font-bold hover:bg-red-700 transition-colors flex items-center justify-center"
                                        >

                                            {isLoading
                                                ? <Loader2 size={12} className="animate-spin" />
                                                : 'Yes, Delete'
                                            }

                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="px-2 py-1.5 bg-gray-200 text-gray-700 rounded-md text-xs font-bold hover:bg-gray-300 transition-colors"
                                        >
                                            Nevermind
                                        </button>

                                    </div>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

};

export default Profile;