import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Link, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import AdminAddProduct from './AdminAddProduct';

const AdminProducts = () => {
    // 1. DUMMY DATA ARRAYS STACK FOR DESIGN LAYOUT TESTING
    const [products, setProducts] = useState([
        {
            id: 1,
            name: "StrikeForce Premium Cleats v1",
            slug: "strikeforce-premium-cleats-v1",
            price: 129.99,
            stock: 45,
            is_active: true
        },
        {
            id: 2,
            name: "Apex Striker Training Jersey",
            slug: "apex-striker-training-jersey",
            price: 49.50,
            stock: 120,
            is_active: true
        },
        {
            id: 3,
            name: "Pro Performance Shin Guards",
            slug: "pro-performance-shin-guards",
            price: 24.99,
            stock: 0, // Out of stock logic visualization testing
            is_active: false // Draft mode visual testing
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentStep, setCurrentStep] = useState('list'); // 'list' | 'add' | 'edit'
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Instantly loaded to skip wait wheels
    const [error, setError] = useState(null);

    // 2. PURGE/DELETE PRODUCT IN LOCAL DUMMY STATE
    const handleDeleteProduct = async (id) => {
        if (window.confirm("Are you sure you want to completely purge this retail item entry?")) {
            // Instantly filters the local array mapping
            setProducts(prev => prev.filter(p => p.id !== id));
        }
    };

    // 3. SEARCH FILTER CALCULATIONS
    const filteredProducts = products.filter(p => {
        const name = p?.name?.toLowerCase() || '';
        const slug = p?.slug?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return name.includes(search) || slug.includes(search);
    });

    // STEP CONTROLLER: ROUTE TO ADD SCREEN
    if (currentStep === 'add') {
        return (
            <AdminAddProduct
                onBack={() => setCurrentStep('list')}
                onProductAdded={(newProductInstance) => {
                    // Generate pseudo random ID for testing state updates safely
                    const mockPayload = {
                        ...newProductInstance,
                        id: Date.now(),
                        price: parseFloat(newProductInstance.price || 0),
                        stock: parseInt(newProductInstance.stock || 0, 10)
                    };
                    setProducts(prev => [mockPayload, ...prev]);
                    setCurrentStep('list');
                }}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Control Panel */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">ApexStriker Catalog Ledger</h3>
                    <p className="text-[11px] font-medium text-gray-400">Initialize, mutate, and manage retail product nodes and inventory mapping states.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-56">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search active catalog items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                        />
                    </div>
                    <button
                        onClick={() => setCurrentStep('add')}
                        className="flex items-center justify-center gap-1.5 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all w-full sm:w-auto"
                    >
                        <Plus size={14} /> Add Product
                    </button>
                </div>
            </div>

            {/* Data Table Container */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                                <th className="p-4 pl-6">Product Core Node</th>
                                <th className="p-4">Slug Handle</th>
                                <th className="p-4">Financial Unit</th>
                                <th className="p-4">Stock Value</th>
                                <th className="p-4 pr-6 text-right">Model Control Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/10">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 size={16} className="animate-spin text-red-600" />
                                            <span>Syncing inventory nodes...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-xs font-bold text-red-600 uppercase tracking-widest bg-gray-50/10">
                                        <div className="flex items-center justify-center gap-2">
                                            <AlertCircle size={14} />
                                            <span>{error}</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map((prod) => (
                                    <tr key={prod.id} className="hover:bg-gray-50/30 transition-colors">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-md bg-red-50 border border-red-100 text-red-600 flex items-center justify-center">
                                                    <ShoppingBag size={13} />
                                                </div>
                                                <div>
                                                    <span className="text-sm tracking-tight text-gray-900 font-extrabold block">
                                                        {prod.name}
                                                    </span>
                                                    {!prod.is_active && (
                                                        <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-black uppercase tracking-wide">
                                                            Draft Mode
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono text-[11px] text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Link size={10} className="text-gray-400" />
                                                <span>{prod.slug}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-900 font-black">
                                            ${typeof prod.price === 'number' ? prod.price.toFixed(2) : prod.price}
                                        </td>
                                        <td className="p-4 font-medium text-gray-500">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${prod.stock > 0 ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                                {prod.stock} Units
                                            </span>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => {
                                                        setSelectedProductId(prod.id);
                                                        setCurrentStep('edit');
                                                    }}
                                                    title="Modify Properties"
                                                    className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition-all"
                                                >
                                                    <Edit2 size={13} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(prod.id)}
                                                    title="Purge Node Entry"
                                                    className="p-1.5 rounded-md border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition-all"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/10">
                                        No active product records matched your search query.
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