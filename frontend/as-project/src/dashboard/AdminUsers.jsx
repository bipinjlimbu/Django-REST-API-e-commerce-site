import React from 'react';

const AdminUsers = () => {
    const users = [
        { id: "U-101", name: "Rohan Shrestha", email: "rohan@gmail.com", role: "Striker Elite" },
        { id: "U-102", name: "Sita Thapa", email: "sita@outlook.com", role: "Standard User" },
    ];

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-900">Registered Striker Database</h3>
            </div>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[11px] font-black uppercase tracking-wider">
                        <th className="p-3 pl-4">Account UID</th>
                        <th className="p-3">Identity</th>
                        <th className="p-3">System Access</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-700">
                    {users.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50/50">
                            <td className="p-3 pl-4 text-gray-400">{u.id}</td>
                            <td className="p-3 text-gray-900 font-extrabold">{u.name} <span className="block text-[10px] text-gray-400 font-normal">{u.email}</span></td>
                            <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] font-black bg-gray-100">{u.role}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsers;