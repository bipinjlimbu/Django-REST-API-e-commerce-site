import React, { useState } from 'react';
import { Search, UserCheck, UserX, Shield, Trash2, Mail } from 'lucide-react';

const AdminUsers = () => {
    // 1. DUMMY DATA MATRIX (Ready for Django REST API Integration)
    const [users, setUsers] = useState([
        { id: 1, name: "Rohan Shrestha", email: "rohan@gmail.com", role: "admin", status: "active", dateJoined: "2026-01-15" },
        { id: 2, name: "Aayush Adhikari", email: "aayush@gmail.com", role: "customer", status: "active", dateJoined: "2026-03-22" },
        { id: 3, name: "Sita Thapa", email: "sita@outlook.com", role: "customer", status: "suspended", dateJoined: "2026-04-05" },
        { id: 4, name: "Niranjan Joshi", email: "niranjan@gmail.com", role: "customer", status: "active", dateJoined: "2026-05-10" },
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    // 2. HANDLERS (Local State updates - swap with axios/fetch calls later)
    const handleToggleStatus = (id) => {
        setUsers(users.map(user => {
            if (user.id === id) {
                return { ...user, status: user.status === 'active' ? 'suspended' : 'active' };
            }
            return user;
        }));
    };

    const handleDeleteUser = (id) => {
        if (window.confirm("Are you sure you want to remove this user profile from ApexStriker?")) {
            setUsers(users.filter(user => user.id !== id));
        }
    };

    // 3. REACTIVE FILTER FILTERING
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">

            {/* SEARCH CONTROL BAR */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">User Base Management</h3>
                    <p className="text-[11px] font-medium text-gray-400">View access tiers, toggle authorization states, and regulate registrations.</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by identity or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                    />
                </div>
            </div>

            {/* USERS DATA TABLE */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                                <th className="p-4 pl-6">Striker Identity</th>
                                <th className="p-4">Access Level</th>
                                <th className="p-4">Status Matrix</th>
                                <th className="p-4">Registration</th>
                                <th className="p-4 pr-6 text-right">System Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-700">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/30 transition-colors">

                                        {/* Identity Column */}
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full font-black text-center flex items-center justify-center border uppercase text-[11px] ${user.role === 'admin' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-900 text-white border-transparent'}`}>
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-gray-900 font-extrabold tracking-tight">{user.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                                                        <Mail size={10} /> {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Role Column */}
                                        <td className="p-4 vertical-align-middle">
                                            {user.role === 'admin' ? (
                                                <span className="inline-flex items-center gap-1 text-red-600 font-black uppercase text-[9px] tracking-wider bg-red-50 px-2 py-0.5 rounded border border-red-100">
                                                    <Shield size={10} /> ROOT ADMIN
                                                </span>
                                            ) : (
                                                <span className="text-gray-500 font-extrabold uppercase text-[9px] tracking-wider bg-gray-100 px-2 py-0.5 rounded">
                                                    STRIKER CUSTOMER
                                                </span>
                                            )}
                                        </td>

                                        {/* Status Column */}
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${user.status === 'active'
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : 'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>

                                        {/* Date Registered Column */}
                                        <td className="p-4 font-medium text-gray-400 text-[11px]">
                                            {user.dateJoined}
                                        </td>

                                        {/* Actions Group Column */}
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-1.5">

                                                {/* Suspension Toggle */}
                                                <button
                                                    onClick={() => handleToggleStatus(user.id)}
                                                    title={user.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                                                    className={`p-1.5 rounded-md border transition-all ${user.status === 'active'
                                                        ? 'border-gray-200 text-gray-500 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50/50'
                                                        : 'border-amber-200 text-amber-600 hover:text-green-600 hover:border-green-200 hover:bg-green-50/50'
                                                        }`}
                                                >
                                                    {user.status === 'active' ? <UserX size={14} /> : <UserCheck size={14} />}
                                                </button>

                                                {/* Hard Deletion (Disabled for fallback protection on core admins) */}
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    disabled={user.role === 'admin'}
                                                    title={user.role === 'admin' ? 'Protected Root Account' : 'Delete User Account'}
                                                    className="p-1.5 rounded-md border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400 disabled:hover:border-gray-200"
                                                >
                                                    <Trash2 size={14} />
                                                </button>

                                            </div>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/10">
                                        No registered profiles match selection parameters
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