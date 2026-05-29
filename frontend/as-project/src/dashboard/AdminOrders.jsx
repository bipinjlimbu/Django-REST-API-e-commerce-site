import React, { useState } from 'react';
import { Search } from 'lucide-react';

const AdminOrders = () => {
    const [search, setSearch] = useState('');
    const dummyOrders = [
        { id: "ASX-9081", customer: "Rohan Shrestha", total: "Rs. 8,500", status: "Delivered" },
        { id: "ASX-9082", customer: "Aayush Adhikari", total: "Rs. 12,200", status: "Processing" },
        { id: "ASX-9083", customer: "Sita Thapa", total: "Rs. 3,100", status: "Pending" },
    ];

    const filtered = dummyOrders.filter(o => o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-900">Order Dispatch Queue</h3>
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search order database..."
                        value={search}
                        onChange={(e) => setSearch.value}
                        className="pl-8 pr-3 py-1 text-xs font-semibold rounded-lg border border-gray-200 focus:outline-none focus:border-red-500 w-48"
                    />
                </div>
            </div>
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-[11px] font-black uppercase tracking-wider">
                        <th className="p-3 pl-4">ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Price Matrix</th>
                        <th className="p-3">Pipeline</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-700">
                    {filtered.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50/50">
                            <td className="p-3 pl-4 text-red-600 font-extrabold">{order.id}</td>
                            <td className="p-3 text-gray-900">{order.customer}</td>
                            <td className="p-3">{order.total}</td>
                            <td className="p-3"><span className="px-2 py-0.5 rounded-full border text-[10px]">{order.status}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminOrders;