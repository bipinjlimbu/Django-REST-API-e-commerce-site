import React, { useState } from 'react';
import { Search, Plus, Trash2, Tag, Calendar } from 'lucide-react';

const AdminBrands = () => {
    // 1. ISOLATED DUMMY DATA MATRIX ARRAY STACK
    const [brands, setBrands] = useState([
        {
            id: 1,
            name: "StrikeForce Active",
            slug: "strikeforce-active",
            created_at: "2026-05-12T14:22:00.000Z"
        },
        {
            id: 2,
            name: "Apex Velocity Labs",
            slug: "apex-velocity-labs",
            created_at: "2026-05-28T09:15:30.000Z"
        },
        {
            id: 3,
            name: "Titanium Gear Co.",
            slug: "titanium-gear-co",
            created_at: "2026-06-01T11:45:10.000Z"
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [newBrandName, setNewBrandName] = useState('');

    // 2. RUNTIME AUTOMATED SLUG TRANSFORM ROUTINE
    const generateSlug = (text) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    };

    // 3. PUSH ENTRY TO CLIENT LOCAL STORAGE ARRAY 
    const handleAddBrand = (e) => {
        e.preventDefault();
        if (!newBrandName.trim()) return;

        const mockPayload = {
            id: Date.now(), // Unique identity timestamp integer
            name: newBrandName.trim(),
            slug: generateSlug(newBrandName),
            created_at: new Date().toISOString()
        };

        setBrands(prev => [mockPayload, ...prev]);
        setNewBrandName('');
    };

    // 4. RETRACTIVE CLIENT PURGE
    const handleDeleteBrand = (id) => {
        if (window.confirm("Are you sure you want to completely purge this dummy brand asset?")) {
            setBrands(prev => prev.filter(b => b.id !== id));
        }
    };

    // CLIENT SIDE IN-MEMORY FILTER PROCESSOR
    const filteredBrands = brands.filter(b => {
        const name = b?.name?.toLowerCase() || '';
        const slug = b?.slug?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return name.includes(search) || slug.includes(search);
    });

    return (
        <div className="space-y-6">
            {/* Header Control Panel */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">ApexStriker Brand Core Registry</h3>
                    <p className="text-[11px] font-medium text-gray-400">Mock simulation dashboard: Trace, filter, and append client side brand dataset variables.</p>
                </div>
                <div className="relative w-full sm:w-56">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search mockup brands..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                    />
                </div>
            </div>

            {/* Grid Split Management Shell */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* COLUMN 1: CLIENT GENERATION FORM */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-gray-900">Deploy Mock Node</h4>
                        <p className="text-[10px] font-medium text-gray-400">Append state structure directly into the transient memory layer.</p>
                    </div>

                    <form onSubmit={handleAddBrand} className="space-y-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Brand Label Name</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Adidas Football"
                                value={newBrandName}
                                onChange={(e) => setNewBrandName(e.target.value)}
                                className="w-full px-3 py-2 text-xs font-bold text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 shadow-sm bg-gray-50/30"
                            />
                        </div>

                        {newBrandName && (
                            <div className="bg-gray-50/60 p-2 rounded-md border border-gray-100 font-mono text-[10px] text-gray-400 block break-all">
                                <span className="font-bold text-gray-500">Auto Slug Preview:</span> {generateSlug(newBrandName)}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-black uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md transition-all"
                        >
                            <Plus size={13} /> Inject Brand Node
                        </button>
                    </form>
                </div>

                {/* COLUMN 2 & 3: REGISTRY MOCKUP LIST TABLE */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden lg:col-span-2">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                                    <th className="p-4 pl-6">Core Entity Identification</th>
                                    <th className="p-4">Slug Key</th>
                                    <th className="p-4">Timestamp Node</th>
                                    <th className="p-4 pr-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-700">
                                {filteredBrands.length > 0 ? (
                                    filteredBrands.map((brand) => (
                                        <tr key={brand.id} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="p-4 pl-6">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-md bg-gray-50 border border-gray-100 text-gray-400 flex items-center justify-center shadow-sm">
                                                        <Tag size={12} />
                                                    </div>
                                                    <span className="text-sm tracking-tight text-gray-900 font-extrabold">
                                                        {brand.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 font-mono text-[11px] text-gray-400">
                                                {brand.slug}
                                            </td>
                                            <td className="p-4 text-gray-500 font-medium">
                                                <div className="flex items-center gap-1 text-[11px]">
                                                    <Calendar size={11} className="text-gray-300" />
                                                    <span>
                                                        {new Date(brand.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 pr-6 text-right">
                                                <button
                                                    onClick={() => handleDeleteBrand(brand.id)}
                                                    title="Purge Mock Item"
                                                    className="p-1.5 rounded-md border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition-all inline-flex items-center justify-center"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-12 text-center text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/10">
                                            No mockup variables matched search vectors.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminBrands;