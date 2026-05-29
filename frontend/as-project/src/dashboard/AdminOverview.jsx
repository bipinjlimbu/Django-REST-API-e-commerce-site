import React from 'react';
import { TrendingUp, Package, Users, UserCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AdminOverview = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
                        <h3 className="text-xl font-black text-gray-900">Rs. 248,500</h3>
                        <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5"><ArrowUpRight size={12} /> +12.5%</span>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg text-red-600"><TrendingUp size={20} /></div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Orders</p>
                        <h3 className="text-xl font-black text-gray-900">42</h3>
                        <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5"><ArrowUpRight size={12} /> +8.2%</span>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg text-red-600"><Package size={20} /></div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Strikers</p>
                        <h3 className="text-xl font-black text-gray-900">1,240</h3>
                        <span className="text-[10px] text-red-500 font-bold flex items-center gap-0.5"><ArrowDownRight size={12} /> -1.4%</span>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg text-red-600"><Users size={20} /></div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center space-y-2">
                <div className="inline-flex p-3 bg-green-50 rounded-full text-green-600 mb-2">
                    <UserCheck size={24} />
                </div>
                <p className="text-sm font-bold text-gray-800">All system channels nominal.</p>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">Django operational REST engine heartbeat stable. Swap structural sections in the navigation panel to configure resources.</p>
            </div>
        </div>
    );
};

export default AdminOverview;