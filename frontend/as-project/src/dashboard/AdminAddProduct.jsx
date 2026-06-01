import React, { useState, useEffect } from 'react';
// IMPORTING THE INTERCEPTED AXIOS INSTANCE
import { api } from '../context/AuthContext';
import { ArrowLeft, PlusCircle, Loader2, AlertCircle, Image as ImageIcon, X } from 'lucide-react';

const AdminAddProduct = ({ onBack, onProductAdded }) => {
    // 1. FORM STATE FIELDS INCLUDING IMAGE REFERENCE
    const [formData, setFormData] = useState({
        category: '',
        name: '',
        slug: '',
        description: '',
        price: '',
        stock: '0',
        is_active: true
    });

    const [imageFile, setImageFile] = useState(null); // Actual binary file for Django storage
    const [imagePreview, setImagePreview] = useState(null); // Local blob URL for UI preview

    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [error, setError] = useState(null);

    // DUMMY FALLBACK CATEGORIES IN CASE ENDPOINT FALLS BACK DURING DISCOVERY
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/api/category/');
                setCategories(response.data.categories || response.data || []);
            } catch (err) {
                console.error("Failed fetching categories, loading fallback presets:", err);
                setCategories([
                    { id: 1, name: "Footwear / Cleats" },
                    { id: 2, name: "Apparel & Jerseys" },
                    { id: 3, name: "Equipment & Gear" }
                ]);
            } finally {
                setCategoriesLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // 2. AUTO-GENERATE SLUG FROM PRODUCT NAME
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
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // 3. IMAGE FILE PROCESSING LOADER
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file)); // Generate browser visual memory address
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        if (imagePreview) URL.revokeObjectURL(imagePreview); // Clean memory garbage strings
        setImagePreview(null);
    };

    // 4. SUBMIT PROTOCOL OVER MULTIPART/FORM-DATA
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // ENCODE MULTIPART STREAM PIPELINE INSTEAD OF STANDARD RAW JSON
        const dataPayload = new FormData();

        // Append text node items
        dataPayload.append('name', formData.name);
        dataPayload.append('slug', formData.slug);
        dataPayload.append('description', formData.description);
        dataPayload.append('price', parseFloat(formData.price));
        dataPayload.append('stock', parseInt(formData.stock, 10));
        dataPayload.append('is_active', formData.is_active);

        if (formData.category !== '') {
            dataPayload.append('category', parseInt(formData.category, 10));
        }

        // Attach actual multi-media binary pointer if exists
        if (imageFile) {
            dataPayload.append('image', imageFile); // 'image' field matches Django model ImageField key
        }

        try {
            // Content-Type validation is automatically handled by browsers when sending FormData
            const response = await api.post('/api/products/', dataPayload);

            alert('Product initialization complete. Added successfully.');
            if (onProductAdded) {
                onProductAdded(response.data.product || response.data);
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Payload submission rejected by model constraint validators.');
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
                {error && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg flex items-center gap-2">
                        <AlertCircle size={14} />
                        <span>{error}</span>
                    </div>
                )}

                {/* IMAGE UPLOAD SLOT SCHEMATICS CONTAINER */}
                <div className="space-y-1.5">
                    <label className="text-gray-500 uppercase tracking-wide text-[10px] font-black">Catalog Media Resource</label>

                    <div className="flex items-center gap-4">
                        {imagePreview ? (
                            <div className="relative w-24 h-24 border border-gray-200 rounded-xl overflow-hidden shadow-inner group">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-md hover:bg-red-600 transition-colors"
                                    title="Remove asset"
                                >
                                    <X size={10} />
                                </button>
                            </div>
                        ) : (
                            <label className="w-24 h-24 border border-dashed border-gray-200 hover:border-red-400 bg-gray-50/50 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all text-gray-400 hover:text-red-600">
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
                            <p>Dimensions normalized to 1:1 Aspect ratio inside layout pipelines.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="text-gray-500 uppercase tracking-wide text-[10px] font-black">Product Title *</label>
                        <input
                            type="text"
                            required
                            name="name"
                            placeholder="e.g., StrikeForce Premium Cleats"
                            value={formData.name}
                            onChange={handleNameChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 font-semibold text-gray-900"
                        />
                    </div>

                    {/* Slug */}
                    <div className="space-y-1.5">
                        <label className="text-gray-500 uppercase tracking-wide text-[10px] font-black">Slug Handle (Unique Url Lookup) *</label>
                        <input
                            type="text"
                            required
                            name="slug"
                            placeholder="strikeforce-premium-cleats"
                            value={formData.slug}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 font-mono text-[11px] font-medium text-gray-600"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Category Selection Dropdown */}
                    <div className="space-y-1.5">
                        <label className="text-gray-500 uppercase tracking-wide text-[10px] font-black">Taxonomy Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 font-semibold text-gray-900"
                        >
                            <option value="">-- No Category (SET_NULL) --</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {categoriesLoading && <p className="text-[10px] text-gray-400 font-medium">Syncing live taxonomy lists...</p>}
                    </div>

                    {/* Price */}
                    <div className="space-y-1.5">
                        <label className="text-gray-500 uppercase tracking-wide text-[10px] font-black">Retail Price (USD) *</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0.00"
                            required
                            name="price"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 font-semibold text-gray-900"
                        />
                    </div>

                    {/* Stock */}
                    <div className="space-y-1.5">
                        <label className="text-gray-500 uppercase tracking-wide text-[10px] font-black">Stock Ledger Units *</label>
                        <input
                            type="number"
                            min="0"
                            required
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 font-semibold text-gray-900"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                    <label className="text-gray-500 uppercase tracking-wide text-[10px] font-black">Catalog Description Details</label>
                    <textarea
                        name="description"
                        rows={4}
                        placeholder="Write down the specifications, properties, features and marketing blocks for ApexStriker item entry..."
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