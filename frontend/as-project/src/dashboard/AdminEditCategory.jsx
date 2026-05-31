import React, { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { ArrowLeft, Edit2, Folder, Link as LinkIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const AdminEditCategory = ({ categoryId, onBack, onCategoryUpdated }) => {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const fetchCategoryDetails = async () => {
            try {
                const response = await api.get(`/api/category/${categoryId}/`);
                // Adjust mapping depending on whether your detail view returns raw fields or nested inside a object
                const catData = response.data.category || response.data;
                setFormData({
                    name: catData.name || '',
                    slug: catData.slug || '',
                });
            } catch (err) {
                setErrors({ global: 'Failed to retrieve classification details from backend.' });
            } finally {
                setIsFetching(false);
            }
        };

        if (categoryId) {
            fetchCategoryDetails();
        }
    }, [categoryId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedData = { ...formData, [name]: value };

        if (name === 'name') {
            const generatedSlug = value
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');

            updatedData.slug = generatedSlug;
        }

        setFormData(updatedData);

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
        if (errors.global) {
            setErrors({ ...errors, global: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrors({});
        setIsLoading(true);

        try {
            const response = await api.put(`/api/category/${categoryId}/`, formData);

            setSuccessMessage(response.data.message || 'Category settings altered successfully!');

            if (onCategoryUpdated && response.data.category) {
                onCategoryUpdated(response.data.category);
            } else if (onCategoryUpdated) {
                // Fallback context patch update if backend returns just raw updated payload
                onCategoryUpdated({ id: categoryId, ...formData });
            }

        } catch (err) {
            if (err.response && err.response.data) {
                if (err.response.data.errors) {
                    setErrors(err.response.data.errors);
                } else {
                    setErrors(err.response.data);
                }
            } else {
                setErrors({ global: 'Transaction failure encountered during system patch operational sequence.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="max-w-xl mx-auto p-12 text-center text-xs font-bold text-gray-400 uppercase tracking-widest bg-white border border-gray-100 rounded-xl shadow-sm">
                <div className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin text-red-600" />
                    <span>Synchronizing node attributes...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-gray-500 hover:text-red-600 transition-colors"
                >
                    <ArrowLeft size={14} /> Cancel Changes
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 h-1.5 w-full bg-red-600"></div>

                <div className="p-5 border-b border-gray-50 bg-gray-50/50">
                    <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">Modify Category Properties</h3>
                    <p className="text-[11px] font-medium text-gray-400">Authenticated PUT state alteration targeting database node index: {categoryId}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {successMessage && (
                        <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-green-800 text-xs font-semibold flex items-start gap-2.5">
                            <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {errors.global && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-800 text-xs font-semibold flex items-start gap-2.5">
                            <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                            <span>{errors.global}</span>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
                            <Folder size={12} className="text-gray-500" /> Category Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="e.g., Football Cleats"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={`w-full px-3 py-2 text-xs font-bold rounded-lg border focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:text-gray-400 ${errors.name
                                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50/30'
                                    : 'border-gray-300 focus:ring-red-600 focus:border-red-600 bg-gray-50/50 focus:bg-white'
                                }`}
                        />
                        {errors.name && (
                            <p className="text-[10px] text-red-600 font-bold flex items-center gap-1 mt-1">
                                <AlertCircle size={12} /> {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
                            <LinkIcon size={12} className="text-gray-500" /> Slug Handle (Unique) *
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-gray-400 select-none">
                                /category/
                            </span>
                            <input
                                type="text"
                                name="slug"
                                placeholder="football-cleats"
                                value={formData.slug}
                                onChange={handleChange}
                                disabled={isLoading}
                                className={`w-full pl-[68px] pr-3 py-2 text-xs font-mono font-bold rounded-lg border focus:outline-none focus:ring-1 disabled:bg-gray-50 ${errors.slug
                                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500 text-red-700 bg-red-50/30'
                                        : 'border-gray-300 focus:ring-red-600 focus:border-red-600 text-red-600 bg-gray-50/30 focus:bg-white'
                                    }`}
                            />
                        </div>
                        {errors.slug && (
                            <p className="text-[10px] text-red-600 font-bold flex items-center gap-1 mt-1">
                                <AlertCircle size={12} /> {errors.slug}
                            </p>
                        )}
                    </div>

                    <div className="pt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-black uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 rounded-lg shadow-md transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    <span>Applying Patches...</span>
                                </>
                            ) : (
                                <>
                                    <Edit2 size={13} />
                                    <span>Update Classification</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminEditCategory;