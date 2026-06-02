import React, { useState, useEffect } from 'react';
// IMPORTING INTERCEPTED AXIOS BASE INSTANCE
import { api } from '../context/AuthContext';
import { Search, Plus, Edit2, Trash2, Link, Loader2, AlertCircle } from 'lucide-react';
import AdminAddProduct from './AdminAddProduct';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentStep, setCurrentStep] = useState('list'); // 'list' | 'add' | 'edit'
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toggleLoadingId, setToggleLoadingId] = useState(null); // Tracks row loading states during toggle operations

    // FETCH ALL PRODUCT INSTANCES FROM LIVE DJANGO REST DATABASE 
    const fetchLiveProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/product/');
            if (response.data && response.data.products) {
                setProducts(response.data.products);
            } else if (Array.isArray(response.data)) {
                setProducts(response.data);
            } else {
                setProducts([]);
            }
        } catch (err) {
            console.error("Critical fetching issue caught:", err);
            setError(err.response?.data?.detail || "Could not retrieve sync indexes from core API storage endpoints.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLiveProducts();
    }, []);

    // 1. DYNAMIC TOGGLE SWITCH ROUTINE (PATCH TRANSACTION ON THE WIRE)
    const handleToggleActive = async (id, currentStatus) => {
        setToggleLoadingId(id);
        try {
            // Passing the inverted binary flag back to network stream handlers
            const updatedStatus = !currentStatus;

            // Sending FormData or standard partial JSON structures depending on route settings
            await api.patch(`/api/product/${id}/`, {
                is_active: updatedStatus
            });

            // Updating client DOM data architecture states node on matching criteria matrix
            setProducts(prev =>
                prev.map(p => p.id === id ? { ...p, is_active: updatedStatus } : p)
            );
        } catch (err) {
            console.error("Failed patch operation tracking state flags:", err);
            alert("Could not patch status code switch flag configuration on backend database records.");
        } finally {
            setToggleLoadingId(null);
        }
    };

    // COMPLETE RETRACTIVE PURGE DELETION
    const handleDeleteProduct = async (id) => {
        if (window.confirm("Are you sure you want to completely purge this retail item entry from ApexStriker datastore?")) {
            try {
                await api.delete(`/api/product/${id}/`);
                setProducts(prev => prev.filter(p => p.id !== id));
                alert("Product entry cleared out successfully.");
            } catch (err) {
                console.error("Purging action was dropped by server:", err);
                alert(err.response?.data?.detail || "Delete operation dropped.");
            }
        }
    };

    // CLIENT SIDE SEARCH CALCULATIONS
    const filteredProducts = products.filter(p => {
        const name = p?.name?.toLowerCase() || '';
        const slug = p?.slug?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return name.includes(search) || slug.includes(search);
    });

    if (currentStep === 'add') {
        return (
            <AdminAddProduct
                onBack={() => setCurrentStep('list')}
                onProductAdded={(newProductInstance) => {
                    setProducts(prev => [newProductInstance, ...prev]);
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
                                            <div className="flex items-center gap-3">

                                                {/* DYNAMIC PRODUCT IMAGE SLOT INSTEAD OF ICON LOGOS */}
                                                <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-sm">
                                                    {prod.product_image ? (
                                                        <img
                                                            src={prod.product_image}
                                                            alt={prod.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                // Handle placeholder text fallback maps if url stream snaps
                                                                e.target.onerror = null;
                                                                e.target.src = "https://placehold.co/100x100?text=No+Image";
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="text-[9px] text-gray-300 font-black uppercase">NULL</span>
                                                    )}
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm tracking-tight text-gray-900 font-extrabold">
                                                            {prod.name}
                                                        </span>

                                                        {/* ACTIVE / DRAFT STATE METRIC BADGES CONTROL INTERFACES */}
                                                        <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider ${prod.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                            {prod.is_active ? 'Live' : 'Draft'}
                                                        </span>
                                                    </div>
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
                                            ${typeof prod.price === 'number' ? prod.price.toFixed(2) : parseFloat(prod.price || 0).toFixed(2)}
                                        </td>
                                        <td className="p-4 font-medium text-gray-500">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${parseInt(prod.stock || 0) > 0 ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                                {prod.stock} Units
                                            </span>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-3">

                                                {/* INTERACTIVE SMOOTH TOGGLE SWITCH CONTAINER TRACK SLOT */}
                                                <div className="flex items-center gap-1.5 border-r border-gray-100 pr-3">
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider hidden sm:inline">Active</span>
                                                    <button
                                                        type="button"
                                                        disabled={toggleLoadingId === prod.id}
                                                        onClick={() => handleToggleActive(prod.id, prod.is_active)}
                                                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${prod.is_active ? 'bg-red-600' : 'bg-gray-200'} ${toggleLoadingId === prod.id ? 'opacity-40 cursor-wait' : ''}`}
                                                    >
                                                        <span
                                                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${prod.is_active ? 'translate-x-4' : 'translate-x-0'}`}
                                                        />
                                                    </button>
                                                </div>

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