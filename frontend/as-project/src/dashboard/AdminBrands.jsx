import React, { useState, useEffect } from 'react';
// IMPORTING INTERCEPTED AXIOS BASE INSTANCE FROM YOUR SYSTEM
import { api } from '../context/AuthContext';
import { Search, Plus, Trash2, Tag, Loader2, AlertCircle, Calendar, Upload } from 'lucide-react';

const AdminBrands = () => {
    const [brands, setBrands] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // FORM STATE CORES
    const [name, setName] = useState('');
    const [brandLogo, setBrandLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState('');

    // OPERATION UI STATUS CORES
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [apiErrors, setApiErrors] = useState({}); // Stores backend errors validation object
    const [globalError, setGlobalError] = useState(null);

    // 1. FETCH LIVE BRAND ARRAYS FROM DJANGO REST ENDPOINT
    const fetchLiveBrands = async () => {
        setIsLoading(true);
        setGlobalError(null);
        try {
            const response = await api.get('/api/brand/');
            if (response.data && response.data.brands) {
                setBrands(response.data.brands);
            } else if (Array.isArray(response.data)) {
                setBrands(response.data);
            } else {
                setBrands([]);
            }
        } catch (err) {
            console.error("Sync matrix collapsed:", err);
            setGlobalError(err.response?.data?.detail || "Could not retrieve brand records from storage node.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLiveBrands();
    }, []);

    // 2. AUTOMATIC RUNTIME SLUG ROUTINE
    const generateSlug = (text) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    };

    // 3. FILE CAPTURE HANDLER WITH LOCAL BLOB PREVIEW PRE-RENDERING
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBrandLogo(file);
            setLogoPreview(URL.createObjectURL(file)); // Generate dynamic sandbox stream URL
            // Flush file field errors if present
            if (apiErrors.brand_logo) {
                setApiErrors(prev => ({ ...prev, brand_logo: null }));
            }
        }
    };

    // 4. MULTIPART FORM DATA TRANSMISSION METHOD ON POST SUBMISSIONS
    const handleAddBrand = async (e) => {
        e.preventDefault();
        setApiErrors({});

        if (!name.trim()) return;

        setIsSubmitting(true);
        try {
            // Since request contains FILES metadata, FormData generation protocol is required
            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('slug', generateSlug(name));
            if (brandLogo) {
                formData.append('brand_logo', brandLogo);
            }

            // Hitting backend endpoint with exact headers configured over instances
            const response = await api.post('/api/brand/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const freshBrand = response.data?.brand || response.data;
            setBrands(prev => [freshBrand, ...prev]);

            // RESET FIELDS
            setName('');
            setBrandLogo(null);
            setLogoPreview('');
            alert("Brand core node initialized securely.");
        } catch (err) {
            console.error("Target submission dropped by endpoint:", err);
            // Catching 'errors' dictionary wrapper rendered explicitly inside your Django view
            if (err.response?.data?.errors) {
                setApiErrors(err.response.data.errors);
            } else {
                alert(err.response?.data?.detail || "Payload transfer error triggered inside API execution framework.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // 5. PURGE BRAND ASSET REMOTELY
    const handleDeleteBrand = async (id) => {
        if (window.confirm("Completely wipe this brand entity? Dependent retail product mappings could be affected.")) {
            try {
                await api.delete(`/api/brand/${id}/`);
                setBrands(prev => prev.filter(b => b.id !== id));
            } catch (err) {
                console.error("Retractive delete action failed:", err);
                alert(err.response?.data?.detail || "Delete cycle stopped due to systemic integrity barriers.");
            }
        }
    };

    // SEARCH VECTOR PROCESSING MAPPINGS
    const filteredBrands = brands.filter(b => {
        const brandName = b?.name?.toLowerCase() || '';
        const brandSlug = b?.slug?.toLowerCase() || '';
        const query = searchTerm.toLowerCase();
        return brandName.includes(query) || brandSlug.includes(query);
    });

    return (
        <div className="space-y-6">
            {/* Header Control Panel */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">ApexStriker Brand Core Registry</h3>
                    <p className="text-[11px] font-medium text-gray-400">Manage real-time corporate entities, asset images, and URL filters.</p>
                </div>
                <div className="relative w-full sm:w-56">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search system brands..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                    />
                </div>
            </div>

            {/* Layout Grid Assembly */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* DYNAMIC ASSET FORM CONTROLLER CONTAINER */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-gray-900">Deploy Brand Node</h4>
                        <p className="text-[10px] font-medium text-gray-400">Transmit multi-part media arrays to backend endpoints.</p>
                    </div>

                    <form onSubmit={handleAddBrand} className="space-y-4">
                        {/* Brand Name Input block */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Brand Label Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Puma Premium Alpha"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (apiErrors.name) setApiErrors(prev => ({ ...prev, name: null }));
                                }}
                                className={`w-full px-3 py-2 text-xs font-bold text-gray-800 rounded-lg border focus:outline-none focus:ring-1 ${apiErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-red-600 focus:border-red-600'} shadow-sm bg-gray-50/30`}
                            />
                            {apiErrors.name && (
                                <p className="text-[10px] font-bold text-red-600 uppercase tracking-tight">{apiErrors.name}</p>
                            )}
                        </div>

                        {/* Slug preview module */}
                        {name && (
                            <div className="bg-gray-50/60 p-2 rounded-md border border-gray-100 font-mono text-[10px] text-gray-400 block break-all">
                                <span className="font-bold text-gray-500">Auto Slug Preview:</span> {generateSlug(name)}
                                {apiErrors.slug && (
                                    <p className="text-[10px] font-bold text-red-600 uppercase tracking-tight mt-1">{apiErrors.slug}</p>
                                )}
                            </div>
                        )}

                        {/* Logo File input system wrapper */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Brand Corporate Logo</label>
                            <div className="flex items-center gap-3">
                                <label className={`flex flex-col items-center justify-center w-24 h-20 border-2 border-dashed rounded-lg cursor-pointer transition-all hover:bg-gray-50/50 ${apiErrors.brand_logo ? 'border-red-400' : 'border-gray-200'}`}>
                                    <div className="flex flex-col items-center justify-center p-2 text-center">
                                        <Upload size={14} className="text-gray-400 mb-1" />
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Upload</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>

                                {/* Dynamic asset preview engine slot */}
                                {logoPreview && (
                                    <div className="w-20 h-20 rounded-lg border border-gray-100 bg-gray-50 overflow-hidden flex items-center justify-center shadow-inner relative group">
                                        <img src={logoPreview} alt="Dynamic Preview stream" className="w-full h-full object-contain" />
                                    </div>
                                )}
                            </div>
                            {apiErrors.brand_logo && (
                                <p className="text-[10px] font-bold text-red-600 uppercase tracking-tight mt-1">{apiErrors.brand_logo}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-black uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-300 rounded-lg shadow-md transition-all"
                        >
                            {isSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                            Save Brand Data
                        </button>
                    </form>
                </div>

                {/* DYNAMIC REGISTRY DATABASE FEED TABLE */}
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
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="4" className="p-12 text-center text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/10">
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 size={16} className="animate-spin text-red-600" />
                                                <span>Querying remote brand databases...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : globalError ? (
                                    <tr>
                                        <td colSpan="4" className="p-12 text-center text-xs font-bold text-red-600 uppercase tracking-widest bg-gray-50/10">
                                            <div className="flex items-center justify-center gap-2">
                                                <AlertCircle size={14} />
                                                <span>{globalError}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredBrands.length > 0 ? (
                                    filteredBrands.map((brand) => (
                                        <tr key={brand.id} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="p-4 pl-6">
                                                <div className="flex items-center gap-3">

                                                    {/* LIVE BACKEND ASSET LOGO PREVIEW CELL */}
                                                    <div className="w-8 h-8 rounded-md bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center shadow-sm">
                                                        {brand.brand_logo ? (
                                                            <img
                                                                src={brand.brand_logo}
                                                                alt={brand.name}
                                                                className="w-full h-full object-contain p-0.5"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = "https://placehold.co/80x80?text=Logo";
                                                                }}
                                                            />
                                                        ) : (
                                                            <Tag size={12} className="text-gray-300" />
                                                        )}
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
                                                        {brand.created_at ? new Date(brand.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Live'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 pr-6 text-right">
                                                <button
                                                    onClick={() => handleDeleteBrand(brand.id)}
                                                    title="Purge Brand Object"
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
                                            No brand nodes found in system catalog.
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