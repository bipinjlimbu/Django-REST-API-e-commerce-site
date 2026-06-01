import React, { useState, useEffect } from 'react';
// IMPORTING THE INTERCEPTED AXIOS INSTANCE
import { api } from '../context/AuthContext';
import { Search, UserCheck, UserX, Shield, Trash2, Mail, Phone, Loader2, AlertCircle } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // FETCH REGISTERED USERS MATCHING YOUR EXACT ENDPOINT STRATEGY
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Pointing directly to your clean endpoint path
                const response = await api.get('/api/users');

                // Unpacks Response({'users': serialized_users})
                setUsers(response.data.users || []);
            } catch (err) {
                setError(err.response?.data?.detail || 'Failed to sync user matrix from Django database pipeline.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // LOCAL HANDLERS (Handles layout mutations purely on state level)
    const handleToggleStatus = async (id) => {
        try {
            // Fires PATCH request directly to your profile detail endpoint
            await api.patch(`/api/profile/${id}/`);

            // Inverts the local state toggle instantly upon a successful 200 OK response
            setUsers(prevUsers => prevUsers.map(user => {
                if (user.id === id) {
                    return { ...user, is_active: !user.is_active };
                }
                return user;
            }));
        } catch (err) {
            alert(err.response?.data?.detail || 'Failed to modify account authorization status.');
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm("Are you sure you want to remove this user profile from ApexStriker local memory?")) {
            try {
                await api.delete(`/api/profile/${id}/`);
                setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
            } catch (err) {
                alert(err.response?.data?.detail || 'Failed to delete user profile.');
            }
        }
    };

    // SEARCH MATRIX ENGINE
    const filteredUsers = users.filter(user => {
        const firstName = user?.first_name?.toLowerCase() || '';
        const lastName = user?.last_name?.toLowerCase() || '';
        const username = user?.username?.toLowerCase() || '';
        const email = user?.email?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        return (
            firstName.includes(search) ||
            lastName.includes(search) ||
            username.includes(search) ||
            email.includes(search)
        );
    });

    return (
        <div className="space-y-6">

            {/* CONTROL PANEL BAR */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">User Base Management</h3>
                    <p className="text-[11px] font-medium text-gray-400">View access tiers, toggle authorization states, and regulate registrations.</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, username, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                    />
                </div>
            </div>

            {/* MAIN DATA GRID */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                                <th className="p-4 pl-6">Striker Identity</th>
                                <th className="p-4">Access Level</th>
                                <th className="p-4">Contact Metrics</th>
                                <th className="p-4">Status Matrix</th>
                                <th className="p-4 pr-6 text-right">System Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/10">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 size={16} className="animate-spin text-red-600" />
                                            <span>Reading serial data structures...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-xs font-bold text-red-600 uppercase tracking-widest bg-gray-50/10">
                                        <div className="flex items-center justify-center gap-1.5 text-red-600">
                                            <AlertCircle size={14} />
                                            <span>{error}</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => {
                                    // Assemble visual display values cleanly
                                    const hasValidName = user.first_name || user.last_name;
                                    const computedFullName = hasValidName ? `${user.first_name} ${user.last_name}`.trim() : 'No Profile Name';
                                    const isUserActive = user.status === 'active' || user.is_active || user.is_active === undefined;

                                    return (
                                        <tr key={user.id || user.username} className="hover:bg-gray-50/30 transition-colors">

                                            {/* Identity Data (Image Profile Avatar fallback handling included) */}
                                            <td className="p-4 pl-6">
                                                <div className="flex items-center gap-3">
                                                    {user.profile_picture ? (
                                                        <img
                                                            src={user.profile_picture}
                                                            alt={user.username}
                                                            className="w-8 h-8 rounded-full object-cover border border-gray-100"
                                                            onError={(e) => { e.target.style.display = 'none'; }} // safe fallback if media file fails path checks
                                                        />
                                                    ) : (
                                                        <div className={`w-8 h-8 rounded-full font-black text-center flex items-center justify-center border uppercase text-[11px] ${user.is_staff || user.is_superuser ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-900 text-white border-transparent'}`}>
                                                            {user.first_name ? user.first_name.charAt(0) : user.username?.charAt(0) || '?'}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-gray-900 font-extrabold tracking-tight">{computedFullName}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium mt-0.5">@{user.username || 'unknown'}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Tier Authorization Data */}
                                            <td className="p-4 vertical-align-middle">
                                                {user.is_staff || user.is_superuser || user.role === 'admin' ? (
                                                    <span className="inline-flex items-center gap-1 text-red-600 font-black uppercase text-[9px] tracking-wider bg-red-50 px-2 py-0.5 rounded border border-red-100">
                                                        <Shield size={10} /> ROOT ADMIN
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500 font-extrabold uppercase text-[9px] tracking-wider bg-gray-100 px-2 py-0.5 rounded">
                                                        STRIKER CUSTOMER
                                                    </span>
                                                )}
                                            </td>

                                            {/* Dynamic Contact Fields */}
                                            <td className="p-4 space-y-0.5">
                                                <p className="text-[11px] text-gray-600 flex items-center gap-1">
                                                    <Mail size={11} className="text-gray-400" /> {user.email || 'N/A'}
                                                </p>
                                                {user.phone_number && (
                                                    <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                                        <Phone size={10} className="text-gray-300" /> {user.phone_number}
                                                    </p>
                                                )}
                                            </td>

                                            {/* Access Control Flags */}
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${isUserActive
                                                    ? 'bg-green-50 text-green-700 border-green-200'
                                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                                    }`}>
                                                    {isUserActive ? 'active' : 'suspended'}
                                                </span>
                                            </td>

                                            {/* Mutation Execution Nodes */}
                                            <td className="p-4 pr-6 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => handleToggleStatus(user.id)}
                                                        disabled={user.is_superuser || user.is_staff}
                                                        title={isUserActive ? 'Suspend Account' : 'Activate Account'}
                                                        className={`p-1.5 rounded-md border ${isUserActive ? 'border-green-200 text-green-600 hover:bg-green-50/50 hover:border-green-300' : 'border-amber-200 text-amber-600 hover:bg-amber-50/50 hover:border-amber-300'} transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 disabled:hover:border-gray-200`}
                                                    >
                                                        {isUserActive ? <UserX size={14} /> : <UserCheck size={14} />}
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        disabled={user.is_superuser || user.is_staff}
                                                        title={user.is_superuser ? 'Protected System Account' : 'Purge Node Record'}
                                                        className="p-1.5 rounded-md border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 disabled:hover:border-gray-200"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/10">
                                        No serialized user footprints found inside backend context.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;