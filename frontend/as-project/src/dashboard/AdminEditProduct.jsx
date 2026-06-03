import React, { useState, useEffect } from 'react';
// IMPORTING THE INTERCEPTED AXIOS INSTANCE
import { api } from '../context/AuthContext';
import { ArrowLeft, Loader2, AlertCircle, Image as ImageIcon, X, Save } from 'lucide-react';

const AdminEditProduct = ({ productId, onBack, onProductUpdated }) => {
    // 1. STATE CONFIGURATION TO TRACK FORM COMPONENT MATRIX
    const [formData, setFormData] = useState({
        category: '',
        brand: '',
        name: '',
        slug: '',
        description: '',
        price: '',
        stock: '0',
        is_active: true
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [existingImageUrl, setExistingImageUrl] = useState(null);

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // BACK-END VALIDATION OBJECT CAPTURE STATE
    const [fieldErrors, setFieldErrors] = useState({});
    const [generalError, setGeneralError] = useState(null);

    // 2. PARALLEL NETWORK PROMISE STREAM DISPATCH WITH DATA DOCKING MATRIX
    useEffect(() => {
        let isMounted = true;

        const fetchAllNecessaryData = async () => {
            setIsPageLoading(true);
            setGeneralError(null);

            try {
                // Execute lookup lookups for categories, brands and target product in parallel
                const [catRes, brandRes, productRes] = await Promise.all([
                    api.get('/api/category/').catch(err => { console.error("Cat stream error:", err); return { data: [] }; }),
                    api.get('/api/brand/').catch(err => { console.error("Brand stream error:", err); return { data: [] }; }),
                    api.get(`/api/product/${productId}/`)
                ]);

                if (!isMounted) return;

                // Normalize Categories
                const rawCats = catRes.data?.categories || catRes.data?.results || catRes.data || [];
                setCategories(Array.isArray(rawCats) ? rawCats : []);

                // Normalize Brands
                const rawBrands = brandRes.data?.brands || brandRes.data?.results || brandRes.data || [];
                setBrands(Array.isArray(rawBrands) ? rawBrands : []);

                // Map Product Target Payload Directly Into Forms Controlled Inputs Matrix
                if (productRes && productRes.data) {
                    // FALLBACK FOR NESTED DJANGO PACKETS RESPONSE
                    // checking if target contains wrapped properties key like productRes.data.product
                    const product = productRes.data.product || productRes.data;
                    console.log("ApexStriker Extracted Real Dataset Payload:", product);

                    // Explicit property re-mapping wrapper (Resolves Number to String select element blockage)
                    const normalizedFormData = {
                        category: product.category && typeof product.category === 'object'
                            ? String(product.category.id || '')
                            : (product.category ? String(product.category) : ''),
                        brand: product.brand && typeof product.brand === 'object'
                            ? String(product.brand.id || '')
                            : (product.brand ? String(product.brand) : ''),
                        name: String(product.name || ''),
                        slug: String(product.slug || ''),
                        description: String(product.description || ''),
                        price: product.price !== undefined && product.price !== null ? String(product.price) : '',
                        stock: product.stock !== undefined && product.stock !== null ? String(product.stock) : '0',
                        is_active: product.is_active !== undefined ? !!product.is_active : true
                    };

                    console.log("Injecting Into State Node directly:", normalizedFormData);
                    setFormData(normalizedFormData);

                    // Media Resource Binding
                    if (product.product_image) {
                        setExistingImageUrl(product.product_image);
                    } else if (product.image) {
                        setExistingImageUrl(product.image);
                    }
                }
            } catch (err) {
                console.error("Critical trace caught loading layout structures:", err);
                setGeneralError("Could not populate fields from single item tracker endpoint data stream.");
            } finally {
                if (isMounted) {
                    setIsPageLoading(false);
                }
            }
        };

        if (productId) {
            fetchAllNecessaryData();
        }

        return () => {
            isMounted = false;
        };
    }, [productId]);

    // 3. GENERATE UNIQUE CLEAN SLUG IN REALTIME ON MANUAL OVERRIDES
    const handleNameChange = (e) => {
        const nameVal = e.target.value;
        const slugVal = nameVal
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

        setFormData(prev => ({
            ...prev,
            name: nameVal,
            slug: slugVal
        }));

        if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: null }));
        if (fieldErrors.slug) setFieldErrors(prev => ({ ...prev, slug: null }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // 4. MULTI-MEDIA FILE HANDLERS
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            if (fieldErrors.product_image) {
                setFieldErrors(prev => ({ ...prev, product_image: null }));
            }
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
        setExistingImageUrl(null);
    };

    // 5. ENCODE MULTIPART STREAM FOR PUT/PATCH ACTIONS ACROSS THE NETWORK
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFieldErrors({});
        setGeneralError(null);

        const dataPayload = new FormData();
        dataPayload.append('name', formData.name);
        dataPayload.append('slug', formData.slug);
        dataPayload.append('description', formData.description);
        dataPayload.append('price', formData.price);
        dataPayload.append('stock', formData.stock);
        dataPayload.append('is_active', formData.is_active ? '1' : '0');

        if (formData.category) dataPayload.append('category', formData.category);
        if (formData.brand) dataPayload.append('brand', formData.brand);

        if (imageFile) {
            dataPayload.append('product_image', imageFile);
        }

        try {
            const response = await api.put(`/api/product/${productId}/`, dataPayload);
            alert('Product catalog mutation state synchronization completed successfully.');

            if (onProductUpdated) {
                onProductUpdated(response.data.product || response.data);
            }
        } catch (err) {
            const responseData = err.response?.data;
            if (responseData && responseData.errors) {
                setFieldErrors(responseData.errors);
            } else if (responseData && typeof responseData === 'object') {
                setFieldErrors(responseData);
            } else {
                setGeneralError(responseData?.detail || 'Payload mutations rejected by core router endpoints.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isPageLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-24 space-y-3 bg-white border border-gray-100 rounded-xl shadow-sm max-w-3xl mx-auto">
                <Loader2 size={24} className="animate-spin text-red-600" />
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Pulling database entity specs...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            {/* Control Sub-Bar */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onBack}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-gray-50 transition-all"
                    >
                        <ArrowLeft size={14} />
                    </button>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">Modify Product Matrix Node</h3>
                        <p className="text-[11px] font-medium text-gray-400">Mutate properties, configuration layers, or retail statuses of existing components.</p>
                    </div>
                </div>
            </div>

            {/* Main Form Block */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5 text-xs font-bold text-gray-700">

                {generalError && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg flex items-center gap-2">
                        <AlertCircle size={14} />
                        <span>{generalError}</span>
                    </div>
                )}

                {/* IMAGE INPUT FRAME WITH LIVE PREVIEWS */}
                <div className="space-y-1.5">
                    <label className="text-gray-500 uppercase tracking-wide text-[10px] font-black">Catalog Media Resource</label>
                    <div className="flex items-center gap-4">
                        {imagePreview || existingImageUrl ? (
                            <div className="relative w-24 h-24 border border-gray-200 rounded-xl overflow-hidden shadow-inner group">
                                <img
                                    src={imagePreview || existingImageUrl}
                                    alt="Preview Asset Frame"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Prevents broken relative links if cloud static url structure lacks domain markers
                                        console.log("Image source loading block caught:", e);
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-md hover:bg-red-600 transition-colors"
                                >
                                    <X size={10} />
                                </button>
                            </div>
                        ) : (
                            <label className={`w-24 h-24 border border-dashed rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${fieldErrors.product_image ? 'border-red-500 bg-red-50/20 text-red-600' : 'border-gray-200 hover:border-red-400 bg-gray-50/50 text-gray-400 hover:text-red-600'}`}>
                                <ImageIcon size={16} />
                                <span className="text-[9px] font-black uppercase tracking-wider">Upload</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        )}
                        <div className="text-[11px] font-medium text-gray-400 space-y-0.5">
                            <p className="text-gray-700 font-bold">Primary Hero Showcase Asset</p>
                            <p>Modifying this field swaps properties on cloud object buckets instantly.</p>
                            {fieldErrors.product_image && (
                                <p className="text-red-600 font-extrabold uppercase text-[10px] tracking-wide mt-1">{fieldErrors.product_image}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Row 1: Name and Slug Handles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-gray-500 uppercase tracking-wide text-[10px] font-black">Product Title *</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="e.g., StrikeForce Premium Cleats"
                            value={formData.name}
                            onChange={handleNameChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 font-semibold text-gray-900 ${fieldErrors.name ? 'border-red-400 focus:ring-red-400' : 'border-gray-200'}`}
                        />
                        {fieldErrors.name && <p className="text-[10px] font-bold text-red-600">{fieldErrors.name}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-gray-500 uppercase tracking-wide text-[10px] font-black">Slug Handle *</label>
                        <input
                            type="text"
                            name="slug"
                            placeholder="strikeforce-premium-cleats"
                            value={formData.slug}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 font-mono text-[11px] font-medium text-gray-600 ${fieldErrors.slug ? 'border-red-400 focus:ring-red-400' : 'border-gray-200'}`}
                        />
                        {fieldErrors.slug && <p className="text-[10px] font-bold text-red-600">{fieldErrors.slug}</p>}
                    </div>
                </div>

                {/* Row 2: Category, Brand, Price, Stock Configurations */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Category Selection Dropdown */}
                    <div className="space-y-1.5">
                        <label className="text-gray-500 uppercase tracking-wide text-[10px] font-black">Category *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 font-semibold text-gray-900 ${fieldErrors.category ? 'border-red-400 focus:ring-red-400' : 'border-gray-200'}`}
                        >
                            <option value="">-- Category --</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={String(cat.id)}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {fieldErrors.category && <p className="text-[10px] font-bold text-red-600">{fieldErrors.category}</p>}
                    </div>

                    {/* Brand Selection Dropdown */}
                    <div className="space-y-1.5">
                        <label className="text-gray-500 uppercase tracking-wide text-[10px] font-black">Brand *</label>
                        <select
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 font-semibold text-gray-900 ${fieldErrors.brand ? 'border-red-400 focus:ring-red-400' : 'border-gray-200'}`}
                        >
                            <option value="">-- Brand --</option>
                            {brands.map((brnd) => (
                                <option key={brnd.id} value={String(brnd.id)}>
                                    {brnd.name}
                                </option>
                            ))}
                        </select>
                        {fieldErrors.brand && <p className="text-[10px] font-bold text-red-600">{fieldErrors.brand}</p>}
                    </div>

                    {/* Price Input Field */}
                    <div className="space-y-1.5">
                        <label className="text-gray-500 uppercase tracking-wide text-[10px] font-black">Price (Rs) *</label>
                        <input
                            type="number"
                            step="0.01"
                            name="price"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 font-semibold text-gray-900 ${fieldErrors.price ? 'border-red-400 focus:ring-red-400' : 'border-gray-200'}`}
                        />
                        {fieldErrors.price && <p className="text-[10px] font-bold text-red-600">{fieldErrors.price}</p>}
                    </div>

                    {/* Stock Input Field */}
                    <div className="space-y-1.5">
                        <label className="text-gray-500 uppercase tracking-wide text-[10px] font-black">Stock Units</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 font-semibold text-gray-900 ${fieldErrors.stock ? 'border-red-400 focus:ring-red-400' : 'border-gray-200'}`}
                        />
                        {fieldErrors.stock && <p className="text-[10px] font-bold text-red-600">{fieldErrors.stock}</p>}
                    </div>
                </div>

                {/* Row 3: Catalog Description */}
                <div className="space-y-1.5">
                    <label className="text-gray-500 uppercase tracking-wide text-[10px] font-black">Catalog Description Details</label>
                    <textarea
                        name="description"
                        rows={4}
                        placeholder="Write down specifications and catalog properties for ApexStriker..."
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 font-medium text-gray-800"
                    />
                </div>

                {/* Availability Live State Flag Toggle */}
                <div className="flex items-center gap-2 pt-2">
                    <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                    />
                    <label htmlFor="is_active" className="text-xs font-black uppercase text-gray-900 selection:bg-transparent cursor-pointer select-none">
                        Expose Item Node (Set Active immediately to public catalogs)
                    </label>
                </div>

                <hr className="border-gray-100 pt-2" />

                {/* Bottom Control Forms Submissions Action Block */}
                <div className="flex items-center justify-end gap-2">
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-all uppercase tracking-wider text-[10px] font-black"
                    >
                        Discard
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-1.5 px-5 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all uppercase tracking-wider text-[10px] font-black disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={12} className="animate-spin" /> Committing changes...
                            </>
                        ) : (
                            <>
                                <Save size={12} /> Save Mutations
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminEditProduct;