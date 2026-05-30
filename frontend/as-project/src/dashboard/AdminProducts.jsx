import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Link, FileText, ToggleLeft, ToggleRight, Calendar } from 'lucide-react';

const AdminProducts = () => {
    // 1. DATA STATE (Directly mirrors your Django Product Model parameters)
    const [products, setProducts] = useState([
        {
            id: 1,
            name: "Striker Pro Cleats v2",
            slug: "striker-pro-cleats-v2",
            category: { id: 1, name: "Footwear" }, // Foreign Key Representation
            description: "Elite performance football cleats built for acceleration.",
            price: 14500.00, // DecimalField
            stock: 18, // IntegerField
            is_active: true, // BooleanField
            created_at: "2026-05-15",
            updated_at: "2026-05-30"
        },
        {
            id: 2,
            name: "Vanguard Match Ball",
            slug: "vanguard-match-ball",
            category: { id: 2, name: "Equipment" },
            description: "FIFA quality certified thermo-bonded match ball.",
            price: 4200.00,
            stock: 4,
            is_active: true,
            created_at: "2026-05-20",
            updated_at: "2026-05-29"
        },
        {
            id: 3,
            name: "Apex Phantom Shin Guards",
            slug: "apex-phantom-shin-guards",
            category: null, // Test case where on_delete=models.SET_NULL occurred
            description: "Carbon fiber composite low-profile shin protection.",
            price: 2900.00,
            stock: 0,
            is_active: false,
            created_at: "2026-05-22",
            updated_at: "2026-05-22"
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    // 2. TOGGLE BOOSTEER HANDLER FOR `is_active` FIELD
    const handleToggleActive = (id) => {
        // Swap with your patch request later: axios.patch(`/api/products/${id}/`, { is_active: !current_status })
        setProducts(products.map(product => {
            if (product.id === id) {
                return { ...product, is_active: !product.is_active };
            }
            return product;
        }));
    };

    const handleDeleteProduct = (id) => {
        if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
            // Swap with: axios.delete(`/api/products/${id}/`)
            setProducts(products.filter(p => p.id !== id));
        }
    };

    // 3. SEARCH MECHANICS
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.category && p.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">

            {/* INVENTORY TRACKING COMMANDER BLOCK */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">ApexStriker Product Registry</h3>
                    <p className="text-[11px] font-medium text-gray-400">Manage records synced directly to your Django backend engine models.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-56">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search variant or slug..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                        />
                    </div>
                    <button className="flex items-center justify-center gap-1.5 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all w-full sm:w-auto">
                        <Plus size={14} /> Add Product
                    </button>
                </div>
            </div>

            {/* PRODUCT LEDGER MATRIX */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                                <th className="p-4 pl-6">Model Core Structure</th>
                                <th className="p-4">Classification</th>
                                <th className="p-4">Price Matrix</th>
                                <th className="p-4">Stock Pool</th>
                                <th className="p-4">Is Active</th>
                                <th className="p-4 pr-6 text-right">Model Control Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-700">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50/30 transition-colors">

                                        {/* Name, Slug, and Description Fields */}
                                        <td className="p-4 pl-6 max-w-xs">
                                            <div className="space-y-0.5">
                                                <p className="text-gray-900 font-extrabold tracking-tight truncate" title={p.name}>{p.name}</p>
                                                <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1 truncate">
                                                    <Link size={10} className="text-red-500/70" /> /{p.slug}
                                                </p>
                                                {p.description && (
                                                    <p className="text-[10px] text-gray-400 font-normal line-clamp-1 italic flex items-center gap-0.5 mt-1">
                                                        <FileText size={9} /> {p.description}
                                                    </p>
                                                )}
                                            </div>
                                        </td>

                                        {/* Category ForeignKey Column */}
                                        <td className="p-4">
                                            {p.category ? (
                                                <span className="inline-block text-gray-600 font-black uppercase text-[9px] tracking-wider bg-gray-100 px-2 py-0.5 rounded">
                                                    {p.category.name}
                                                </span>
                                            ) : (
                                                <span className="inline-block text-gray-400 font-bold uppercase text-[9px] tracking-wider bg-gray-50 border border-dashed px-2 py-0.5 rounded">
                                                    Uncategorized
                                                </span>
                                            )}
                                        </td>

                                        {/* Price (DecimalField representation) */}
                                        <td className="p-4 text-gray-900 font-black tracking-tight">
                                            Rs. {p.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>

                                        {/* Stock (IntegerField representation) */}
                                        <td className="p-4">
                                            <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase ${p.stock === 0
                                                ? 'bg-red-50 text-red-600'
                                                : p.stock <= 5
                                                    ? 'bg-amber-50 text-amber-700'
                                                    : 'bg-green-50 text-green-700'
                                                }`}>
                                                {p.stock === 0 ? "Out of Stock" : `${p.stock} Units`}
                                            </span>
                                        </td>

                                        {/* is_active (BooleanField control switch) */}
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleToggleActive(p.id)}
                                                className={`transition-colors duration-200 focus:outline-none ${p.is_active ? 'text-green-600' : 'text-gray-300'}`}
                                                title={p.is_active ? 'Deactivate Listing' : 'Activate Listing'}
                                            >
                                                {p.is_active ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                                            </button>
                                        </td>

                                        {/* Actions Group (Edit, Delete, Timestamps) */}
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        onClick={() => alert(`Modify Model Entry ID: ${p.id}`)}
                                                        title="Update fields"
                                                        className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition-all"
                                                    >
                                                        <Edit2 size={13} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(p.id)}
                                                        title="Destroy instances"
                                                        className="p-1.5 rounded-md border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition-all"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                                <div className="text-[9px] text-gray-400 font-medium flex items-center gap-0.5" title="Last Updated">
                                                    <Calendar size={10} /> Sync: {p.updated_at}
                                                </div>
                                            </div>
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/10">
                                        No Product model instances found matching inputs
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

export default AdminProducts;