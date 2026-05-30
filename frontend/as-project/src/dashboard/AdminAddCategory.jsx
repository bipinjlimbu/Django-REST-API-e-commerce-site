import React, { useState } from 'react';
import { ArrowLeft, Plus, Folder, Link, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const AdminAddCategory = ({ onBack, onCategoryAdded }) => {
    // 1. STATE MANAGEMENT
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // 2. AUTOMATIC SLUG GENERATOR UTILITY
    const handleNameChange = (e) => {
        const val = e.target.value;
        setName(val);

        // Converts "Football Cleats!" -> "football-cleats"
        const generatedSlug = val
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with a single hyphen
            .replace(/^-+|-+$/g, ''); // Trim leading/trailing hyphens

        setSlug(generatedSlug);
    };

    // 3. BACKEND DJANGO REST POST INTEGRATION
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset feedback states
        setIsSubmitting(true);
        setApiError(null);
        setSuccessMessage(null);

        // Validation fallback
        if (!name.trim() || !slug.trim()) {
            setApiError("Category name and unique slug handle fields are required.");
            setIsSubmitting(false);
            return;
        }

        const payload = {
            name: name.trim(),
            slug: slug.trim()
        };

        try {
            const response = await fetch('/api/category/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // If your Django project uses Token/JWT authentication, pass it here:
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    // If using session auth with CSRF protection, pass the token:
                    // 'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                // Parse typical Django REST framework field validation error matrices
                if (data.name) throw new Error(`Name Field: ${data.name[0]}`);
                if (data.slug) throw new Error(`Slug Field: ${data.slug[0]}`);
                throw new Error(data.detail || "Failed to commit record instance.");
            }

            // SUCCESS PIPELINE
            setSuccessMessage(`Taxonomy node "${data.name}" successfully registered inside core db models.`);
            setName('');
            setSlug('');

            // Optional: Trigger dashboard-level data re-fetch if parent handler callback exists
            if (onCategoryAdded) onCategoryAdded(data);

        } catch (error) {
            setApiError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">

            {/* BACK BUTTON TERMINAL HEADER */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-gray-500 hover:text-red-600 transition-colors"
                >
                    <ArrowLeft size={14} /> Back to Classifications
                </button>
            </div>

            {/* FORM CONTAINER CARD */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 left-0 h-1.5 w-full bg-red-600"></div>

                <div className="p-5 border-b border-gray-50 bg-gray-50/50">
                    <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">Initialize New Category Node</h3>
                    <p className="text-[11px] font-medium text-gray-400">This form triggers a structural POST transaction directly into your Django database model registry.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {/* FEEDBACK STATUS ALERTS */}
                    {apiError && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-800 text-xs font-semibold flex items-start gap-2.5">
                            <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                            <span>{apiError}</span>
                        </div>
                    )}

                    {successMessage && (
                        <div className="p-3 bg-green-50 border border-green-100 rounded-lg text-green-800 text-xs font-semibold flex items-start gap-2.5">
                            <CheckCircle2 size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* CATEGORY NAME INPUT */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
                            <Folder size={12} className="text-gray-500" /> Category Name
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g., Football Cleats"
                            value={name}
                            onChange={handleNameChange}
                            disabled={isSubmitting}
                            className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 disabled:bg-gray-50 disabled:text-gray-400"
                        />
                    </div>

                    {/* DYNAMIC SLUG FIELD INPUT */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1">
                            <Link size={12} className="text-gray-500" /> Slug Handle (Unique)
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-gray-400 select-none">
                                /category/
                            </span>
                            <input
                                type="text"
                                required
                                placeholder="football-cleats"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                disabled={isSubmitting}
                                className="w-full pl-[68px] pr-3 py-2 text-xs font-mono font-bold rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 text-red-600 bg-gray-50/30 disabled:bg-gray-50"
                            />
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium">Auto-generated URL identifier sequence. Custom modifications are lowercase validated.</p>
                    </div>

                    {/* ACTIONS SUBMIT BUTTON */}
                    <div className="pt-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-black uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 rounded-lg shadow-md transition-all"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    <span>Syncing Pipeline...</span>
                                </>
                            ) : (
                                <>
                                    <Plus size={14} />
                                    <span>Save Model Instance</span>
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AdminAddCategory;