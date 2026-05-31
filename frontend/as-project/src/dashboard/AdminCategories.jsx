import React, { useState, useEffect } from 'react';
// IMPORT YOUR CUSTOM AXIOS INSTANCE INSTEAD OF RAW AXIOS
import { api } from '../context/AuthContext';
import { Search, Plus, Edit2, Trash2, Link, Folder, Calendar, Loader2 } from 'lucide-react';
import AdminAddCategory from './AdminAddCategory';
import AdminEditCategory from './AdminEditCategory'; // Imported Edit Component

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentStep, setCurrentStep] = useState('list'); // 'list' | 'add' | 'edit'
    const [selectedCategoryId, setSelectedCategoryId] = useState(null); // Track targeted entity ID
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // USE THE INTERCEPTOR INSTANCE. NO MANUAL HEADERS NEEDED!
                const response = await api.get('/api/category/');
                setCategories(response.data.categories || []);
            } catch (err) {
                // Checking for explicit server message, fallback to generic
                setError(err.response?.data?.detail || 'Failed to load categories from the server.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleDeleteCategory = async (id) => {
        if (window.confirm("Are you sure you want to delete this category? Any linked products will have their category field set to null (models.SET_NULL).")) {
            try {
                // CLEAN DELETE CALL WITH THE WRAPPED INSTANCE
                await api.delete(`/api/category/${id}/`);
                setCategories(prev => prev.filter(c => c.id !== id));
            } catch (err) {
                alert(err.response?.data?.detail || 'Failed to delete the category. Please try again.');
            }
        }
    };

    const filteredCategories = categories.filter(c => {
        const name = c?.name?.toLowerCase() || '';
        const slug = c?.slug?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();
        return name.includes(search) || slug.includes(search);
    });

    // STEP CONTROLLER: ADD NEW NODE
    if (currentStep === 'add') {
        return (
            <AdminAddCategory
                onBack={() => setCurrentStep('list')}
                onCategoryAdded={(newCategoryInstance) => {
                    setCategories(prev => [newCategoryInstance, ...prev]);
                    setCurrentStep('list');
                }}
            />
        );
    }

    // STEP CONTROLLER: PATCH EDIT EXISTING NODE
    if (currentStep === 'edit') {
        return (
            <AdminEditCategory
                categoryId={selectedCategoryId}
                onBack={() => {
                    setCurrentStep('list');
                    setSelectedCategoryId(null);
                }}
                onCategoryUpdated={(updatedCategoryInstance) => {
                    // Instantly sync state mutations down to our local catalog map
                    setCategories(prev =>
                        prev.map(c => c.id === updatedCategoryInstance.id ? updatedCategoryInstance : c)
                    );
                    setCurrentStep('list');
                    setSelectedCategoryId(null);
                }}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Control Panel */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">ApexStriker Taxonomies</h3>
                    <p className="text-[11px] font-medium text-gray-400">Configure base product catalog groups and lookup handles.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-56">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search classifications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                        />
                    </div>
                    <button
                        onClick={() => setCurrentStep('add')}
                        className="flex items-center justify-center gap-1.5 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all w-full sm:w-auto"
                    >
                        <Plus size={14} /> Add Category
                    </button>
                </div>
            </div>

            {/* Data Table Container */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                                <th className="p-4 pl-6">Category Classification</th>
                                <th className="p-4">Slug Identifier</th>
                                <th className="p-4">Date Initialized</th>
                                <th className="p-4 pr-6 text-right">Model Control Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/10">
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 size={16} className="animate-spin text-red-600" />
                                            <span>Loading system models...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-xs font-bold text-red-600 uppercase tracking-widest bg-gray-50/10">
                                        {error}
                                    </td>
                                </tr>
                            ) : filteredCategories.length > 0 ? (
                                filteredCategories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-gray-50/30 transition-colors">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-md bg-red-50 border border-red-100 text-red-600 flex items-center justify-center">
                                                    <Folder size={13} />
                                                </div>
                                                <div>
                                                    <span className="text-sm tracking-tight text-gray-900 font-extrabold">
                                                        {cat.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono text-[11px] text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Link size={10} className="text-gray-400" />
                                                <span>{cat.slug}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium text-gray-400 text-[11px]">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={11} className="text-gray-300" />
                                                <span>{cat.created_at ? new Date(cat.created_at).toLocaleDateString() : 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => {
                                                        setSelectedCategoryId(cat.id);
                                                        setCurrentStep('edit');
                                                    }}
                                                    title="Modify Properties"
                                                    className="p-1.5 rounded-md border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50/50 transition-all"
                                                >
                                                    <Edit2 size={13} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(cat.id)}
                                                    title="Purge Category Node"
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
                                    <td colSpan="4" className="p-12 text-center text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50/10">
                                        No taxonomy listings match your filter criteria
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

export default AdminCategories;