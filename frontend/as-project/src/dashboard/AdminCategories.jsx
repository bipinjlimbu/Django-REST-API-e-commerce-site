import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Link, Folder, Calendar } from 'lucide-react';
import AdminAddCategory from './AdminAddCategory'; // Imports your form component directly

const AdminCategories = () => {
    // 1. DATA STATE (Directly mirrors your updated flat Category model)
    const [categories, setCategories] = useState([
        { id: 1, name: "Footwear", slug: "footwear", created_at: "2026-01-10" },
        { id: 2, name: "Football Cleats", slug: "football-cleats", created_at: "2026-01-12" },
        { id: 3, name: "Apparel", slug: "apparel", created_at: "2026-02-05" },
        { id: 4, name: "Compression Wear", slug: "compression-wear", created_at: "2026-02-20" },
        { id: 5, name: "Equipment", slug: "equipment", created_at: "2026-03-01" },
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    // VIEW STATE ROUTING SWITCH: 'list' displays the table, 'add' displays the form
    const [currentStep, setCurrentStep] = useState('list');

    // 2. HANDLERS (Local state mutations - ready to point to your Django endpoints)
    const handleDeleteCategory = (id) => {
        if (window.confirm("Are you sure you want to delete this category? Any linked products will have their category field set to null (models.SET_NULL).")) {
            // Swap with: axios.delete(`/api/categories/${id}/`)
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    // 3. SEARCH FILTER MECHANICS
    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ==========================================
    // SUB-STEP INTERCEPT RENDERING
    // ==========================================
    if (currentStep === 'add') {
        return (
            <AdminAddCategory
                onBack={() => setCurrentStep('list')}
                onCategoryAdded={(newCategoryInstance) => {
                    // Prepend newly initialized API model instance into active list buffer state
                    setCategories([newCategoryInstance, ...categories]);
                    setCurrentStep('list');
                }}
            />
        );
    }

    return (
        <div className="space-y-6">

            {/* CONTROL HEADBAR ACTIONS */}
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
                    {/* TRIGGER SUB-VIEW STEP ROUTING TO FORM */}
                    <button
                        onClick={() => setCurrentStep('add')}
                        className="flex items-center justify-center gap-1.5 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all w-full sm:w-auto"
                    >
                        <Plus size={14} /> Add Category
                    </button>
                </div>
            </div>

            {/* DATABASE RECORD TABLE */}
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
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-gray-50/30 transition-colors">

                                        {/* Name field layout with simplified icon mapping */}
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

                                        {/* Slug Column mapping unique URL tokens */}
                                        <td className="p-4 font-mono text-[11px] text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Link size={10} className="text-gray-400" />
                                                <span>{cat.slug}</span>
                                            </div>
                                        </td>

                                        {/* Created At Timestamp Column */}
                                        <td className="p-4 font-medium text-gray-400 text-[11px]">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={11} className="text-gray-300" />
                                                <span>{cat.created_at}</span>
                                            </div>
                                        </td>

                                        {/* Control Triggers */}
                                        <td className="p-4 pr-6 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => alert(`Modify category entry properties for ID: ${cat.id}`)}
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