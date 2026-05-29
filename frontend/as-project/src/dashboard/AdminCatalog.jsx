import React from 'react';
import { FolderPlus } from 'lucide-react';

const AdminCatalog = () => {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-900">Catalog Registry</h3>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider rounded-md">
                    <FolderPlus size={12} /> Add Entry
                </button>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
                Connect your Django backend catalog models directly here to build live CRUD adjustments for your inventory.
            </p>
            <div className="p-12 border-2 border-dashed border-gray-100 rounded-xl text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                No active overrides initialized
            </div>
        </div>
    );
};

export default AdminCatalog;