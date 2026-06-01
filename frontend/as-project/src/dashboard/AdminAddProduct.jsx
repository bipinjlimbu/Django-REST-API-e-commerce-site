import React, { useState, useEffect } from 'react';
// IMPORTING THE INTERCEPTED AXIOS INSTANCE
import { api } from '../context/AuthContext';
import { ArrowLeft, PlusCircle, Loader2, AlertCircle } from 'lucide-react';

const AdminAddProduct = ({ onBack, onProductAdded }) => {
    // 1. FORM STATE MATCHING YOUR DJANGO MODEL FIELDS
    const [formData, setFormData] = useState({
        category: '',
        name: '',
        slug: '',
        description: '',
        price: '',
        stock: '0',
        is_active: true
    });

    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. FETCH ACTIVE CATEGORIES FOR THE LOOKUP DROPDOWN
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/api/category/');
                setCategories(response.data.categories || response.data || []);
            } catch (err) {
                console.error("Failed fetching categories for lookup:", err);
            } finally {
                setCategoriesLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // 3. AUTO-GENERATE SLUG FROM PRODUCT NAME
    const handleNameChange = (e) => {
        const nameVal = e.target.value;
        const slugVal = nameVal
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-')         // Replace spaces with dashes
            .replace(/-+/g, '-');         // Remove duplicate dashes

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

    // 4. SUBMIT PROTOCOL OVER THE WIRE
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Sanitize Payload constraints for Django REST format
        const payload = {
            ...formData,
            category: formData.category === '' ? null : parseInt(formData.category, 10),
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock, 10)
        };

        try {
            // Adjust this path if your product list view path varies
            const response = await api.post('/api/products/', payload);

            alert('Product initialization complete. Added successfully.');
            if (onProductAdded) {
                // Passes back the freshly serialized instance from your database
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