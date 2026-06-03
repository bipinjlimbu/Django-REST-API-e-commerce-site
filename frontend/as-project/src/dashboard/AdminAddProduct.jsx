import React, { useState, useEffect } from 'react';
// IMPORTING THE INTERCEPTED AXIOS INSTANCE
import { api } from '../context/AuthContext';
import { ArrowLeft, PlusCircle, Loader2, AlertCircle, Image as ImageIcon, X } from 'lucide-react';

const AdminAddProduct = ({ onBack, onProductAdded }) => {
    // 1. STATE CONFIGURATION TO TRACK FORM COMPONENT MATRIX
    const [formData, setFormData] = useState({
        category: '',
        brand: '', // INITIALIZED BRAND ID
        name: '',
        slug: '',
        description: '',
        price: '',
        stock: '0',
        is_active: true
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]); // BRAND ARRAY STATE
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [brandsLoading, setBrandsLoading] = useState(true); // BRAND LOADING STATE

    // BACK-END VALIDATION OBJECT CAPTURE STATE
    const [fieldErrors, setFieldErrors] = useState({});
    const [generalError, setGeneralError] = useState(null);

    // 2. FETCH TAXONOMY & BRAND DEFINITIONS FOR DROPDOWNS
    useEffect(() => {
        const fetchDropdownData = async () => {
            // Fetch Categories
            try {
                const response = await api.get('/api/category/');
                setCategories(response.data.categories || response.data || []);
            } catch (err) {
                console.error("Failed fetching categories:", err);
            } finally {
                setCategoriesLoading(false);
            }

            // FETCH BRANDS DIRECTLY FROM API
            try {
                const response = await api.get('/api/brand/'); // Match your Django URL endpoint
                // Match regular response wrapper or list array structure
                setBrands(response.data.brands || response.data || []);
            } catch (err) {
                console.error("Failed fetching brands:", err);
            } finally {
                setBrandsLoading(false);
            }
        };

        fetchDropdownData();
    }, []);

    // 3. GENERATE UNIQUE CLEAN SLUG IN REALTIME
    const handleNameChange = (e) => {
        const nameVal = e.target.value;
        const slugVal = nameVal
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Strips irregular punctuation markers
            .replace(/\s+/g, '-')         // Blank whitespace blocks map to clean hyphens
            .replace(/-+/g, '-');         // Deduplicate running dashes

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
    };

    // 5. ENCODE MULTIPART STREAM FOR DJANGO REST OVER THE WIRE
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
        if (formData.brand) dataPayload.append('brand', formData.brand); // SENT BRAND FIELD TO BACKEND

        if (imageFile) {
            dataPayload.append('product_image', imageFile);
        }

        try {
            const response = await api.post('/api/product/', dataPayload);
            alert(response.data.message || 'Product initialization complete.');

            if (onProductAdded) {
                onProductAdded(response.data.product);
            }
        } catch (err) {
            const responseData = err.response?.data;
            if (responseData && responseData.errors) {
                setFieldErrors(responseData.errors);
            } else {
                setGeneralError(responseData?.detail || 'Payload submission rejected.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">Add Product Entry</h3>
                        <p className="text-[11px] font-medium text-gray-400">Initialize a new retail product node into inventory mappings.</p>
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

                {/* IMAGE INPUT FRAME */}
                <div className="space-y-1.5">
                    <label className="text-gray-500 uppercase tracking-wide text-[10px] font-black">Catalog Media Resource *</label>
                    <div className="flex items-center gap-4">
                        {imagePreview ? (
                            <div className="relative w-24 h-24 border border-gray-200 rounded-xl overflow-hidden shadow-inner group">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
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
                            <p>Accepts PNG, JPG, or WEBP representations.</p>
                            {fieldErrors.product_image && (
                                <p className="text-red-600 font-extrabold uppercase text-[10px] tracking-wide mt-1">{fieldErrors.product_image}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Row 1: Name and Slug */}
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

                {/* Row 2: Category, Brand, Price, Stock Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Category Dropdown */}
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
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {categoriesLoading && <p className="text-[10px] text-gray-400 font-medium">Syncing...</p>}
                        {fieldErrors.category && <p className="text-[10px] font-bold text-red-600">{fieldErrors.category}</p>}
                    </div>

                    {/* Brand Dynamic API Dropdown */}
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
                                <option key={brnd.id} value={brnd.id}>
                                    {brnd.name}
                                </option>
                            ))}
                        </select>
                        {brandsLoading && <p className="text-[10px] text-gray-400 font-medium">Syncing...</p>}
                        {fieldErrors.brand && <p className="text-[10px] font-bold text-red-600">{fieldErrors.brand}</p>}
                    </div>

                    {/* Price Input */}
                    <div className="space-y-1.5">
                        <label className="text-gray-500 uppercase tracking-wide text-[10px] font-black">Price (USD) *</label>
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

                    {/* Stock Input */}
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

                {/* Row 3: Description Details */}
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

                {/* Availability Flag Checkbox */}
                <div className="flex items-center gap-2 pt-2">
                    <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                    />
                    <label htmlFor="is_active" className="text-xs font-black uppercase text-gray-900 selection:bg-transparent">
                        Expose Item Node (Set Active immediately to public catalogs)
                    </label>
                </div>

                <hr className="border-gray-100 pt-2" />

                {/* Submissions Action Block */}
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
                                <Loader2 size={12} className="animate-spin" /> Committing data...
                            </>
                        ) : (
                            <>
                                <PlusCircle size={12} /> Push Product Entry
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminAddProduct;