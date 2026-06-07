import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
// IMPORTING THE INTERCEPTED AXIOS INSTANCE
import { api } from '../context/AuthContext';
import { ShoppingCart, Star, Heart, ArrowRight, Flame, Loader2, AlertCircle, Edit, LogIn, EyeOff } from 'lucide-react';

const Home = () => {
    // EXTRACT REAL-TIME USER OBJECT MATRIX FROM STATE MANAGERS
    const { isAuthenticated, user } = useAuth();

    // System Catalog Data Hooks
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // FETCH REAL-TIME DYNAMIC PRODUCTS FROM DJANGO BACKEND
    useEffect(() => {
        let isMounted = true;

        const fetchCatalogProducts = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await api.get('/api/product/');
                if (!isMounted) return;

                const extractedProducts = response.data?.products || response.data?.results || response.data || [];
                setProducts(Array.isArray(extractedProducts) ? extractedProducts : []);
            } catch (err) {
                console.error("Failed to query core store catalog stream:", err);
                if (isMounted) {
                    setError("Could not load latest products from the ApexStriker service framework.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchCatalogProducts();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleAddToCart = (productId) => {
        api.post(`/api/add-to-cart/${productId}/`)
            .then(response => {
                alert(response.data.message || "Product added to cart successfully!");
            })
            .catch(error => {
                console.error("Failed to add product to cart:", error);
                alert(error.response?.data?.message || "Could not add product to cart. Please try again.");
            });
    };

    const handleAdminRouteRedirect = (productId) => {
        window.location.href = `/dashboard/admin`;
    };

    const handleLoginRedirect = () => {
        window.location.href = '/login';
    };

    // 🎯 SECURITY FILTER MATRIX: Only show hidden nodes if user is authenticated AND staff
    const visibleProducts = products.filter(product => {
        if (product.is_active === false) {
            return isAuthenticated && user?.is_staff;
        }
        return true;
    });

    return (
        <div className="space-y-12">

            {/* 🎯 HERO BANNER SECTION */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-900 text-white shadow-xl">
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
                <div className="relative max-w-2xl px-6 py-16 sm:py-24 lg:px-12 z-10 flex flex-col items-start space-y-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-600 text-white uppercase tracking-wider animate-pulse">
                        <Flame size={12} /> Mid-Season Sale Up to 40% Off
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight uppercase font-sans">
                        Strike First.<br />
                        <span className="text-red-500">Own The Game.</span>
                    </h1>
                    <p className="text-base sm:text-lg text-gray-300 max-w-md font-light leading-relaxed">
                        Equip yourself with premium athletic weapons engineered to push past constraints and optimize elite physical outputs.
                    </p>
                    <button className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white shadow transition-all hover:bg-red-700 hover:gap-3 group">
                        Explore Collection <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                    </button>
                </div>
            </div>

            {/* 🏷️ PRODUCT CATALOG GRID SECTION */}
            <div>
                <div className="flex items-end justify-between mb-6 border-b border-gray-200 pb-4">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 tracking-wide uppercase">Featured Gear</h2>
                        <p className="text-sm text-gray-500 mt-1">High-performance tools curated for modern athletes</p>
                    </div>
                    <span className="text-xs font-bold text-red-600 tracking-wider uppercase cursor-pointer hover:underline">
                        View All Items
                    </span>
                </div>

                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20 space-y-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                        <Loader2 size={24} className="animate-spin text-red-600" />
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Streaming live product nodes...</p>
                    </div>
                )}

                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2 max-w-xl mx-auto">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                {!isLoading && !error && visibleProducts.length === 0 && (
                    <div className="text-center py-16 bg-gray-50 border border-dashed rounded-xl text-gray-400 font-bold text-xs uppercase tracking-wider">
                        No active catalog products discovered inside the ecosystem.
                    </div>
                )}

                {/* SECURE CONDITIONAL RENDERING GRID MATRIX */}
                {!isLoading && !error && visibleProducts.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {visibleProducts.map((product) => {
                            const catalogImage = product.product_image || product.image || "https://images.unsplash.com/photo-1617083934555-ac7d4fee12ab?w=500&auto=format&fit=crop&q=60";
                            const categoryName = product.category && typeof product.category === 'object'
                                ? product.category.name
                                : (product.category_name || product.category || "Gear");

                            const parsedPrice = product.price ? parseFloat(product.price) : 0.00;
                            const isOutOfStock = !product.stock || parseInt(product.stock) === 0;

                            return (
                                <div
                                    key={product.id}
                                    className={`group flex flex-col bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative ${product.is_active === false ? 'border-amber-300 bg-amber-50/20' : 'border-gray-200'
                                        }`}
                                >

                                    {/* Product Status Badges */}
                                    {isOutOfStock ? (
                                        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded text-white shadow-sm bg-gray-500">
                                            Out of Stock
                                        </span>
                                    ) : product.is_active === false ? (
                                        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded text-white shadow-sm bg-amber-600 flex items-center gap-1">
                                            <EyeOff size={10} /> Hidden Node (Admin Only)
                                        </span>
                                    ) : (
                                        (product.tag || product.brand_name) && (
                                            <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded text-white shadow-sm bg-gray-900">
                                                {product.tag || (typeof product.brand === 'object' ? product.brand.name : product.brand_name)}
                                            </span>
                                        )
                                    )}

                                    {/* Wishlist Button Overlay */}
                                    <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-xs text-gray-400 hover:text-red-600 shadow-sm border border-gray-100 transition-colors">
                                        <Heart size={16} />
                                    </button>

                                    {/* Image Canvas Box */}
                                    <div className="aspect-square w-full bg-gray-50 overflow-hidden relative">
                                        <img
                                            src={catalogImage}
                                            alt={product.name}
                                            className={`h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ${product.is_active === false ? 'opacity-75 grayscale-25' : ''
                                                }`}
                                            onError={(e) => {
                                                e.target.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60";
                                            }}
                                        />
                                    </div>

                                    {/* Core Text Info Metadata Block */}
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div className="space-y-1">
                                            <span className="text-[11px] font-bold text-red-500 uppercase tracking-widest">
                                                {categoryName}
                                            </span>
                                            <h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-red-600 transition-colors">
                                                {product.name}
                                            </h3>

                                            {/* Rating metrics row */}
                                            <div className="flex items-center gap-1 text-amber-500 text-xs pt-1">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={12}
                                                            className={i < Math.floor(product.rating || 5) ? "fill-amber-500 text-amber-500" : "text-gray-300"}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="font-bold text-gray-700 ml-1">{product.rating || "5.0"}</span>
                                                <span className="text-gray-400">({product.reviews || "24"})</span>
                                            </div>
                                        </div>

                                        {/* Purchase Action / Context Dependent Controls Row */}
                                        <div className="flex items-center justify-between pt-5 mt-4 border-t border-gray-100">
                                            <span className="text-xl font-black text-gray-900 font-mono">
                                                Rs. {parsedPrice.toFixed(2)}
                                            </span>

                                            {/* 🎯 CONDITIONAL TRANSACTION INTERFACE ROUTING */}
                                            {!isAuthenticated ? (
                                                /* CASE 1: UN-AUTHENTICATED CONSUMER TARGETS */
                                                <button
                                                    onClick={handleLoginRedirect}
                                                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-3 py-2 text-xs font-black uppercase text-white shadow transition-all tracking-wider"
                                                >
                                                    <LogIn size={13} /> Login
                                                </button>
                                            ) : user?.is_staff ? (
                                                /* CASE 2: ADMINISTRATIVE ACCOUNT MATRIX IDENTIFIED */
                                                <button
                                                    onClick={() => handleAdminRouteRedirect(product.id)}
                                                    className="flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 px-3 py-2 text-xs font-black uppercase text-white shadow transition-all tracking-wider"
                                                >
                                                    <Edit size={13} /> Edit in Dashboard
                                                </button>
                                            ) : (
                                                /* CASE 3: AUTHENTICATED RETAIL END CUSTOMERS */
                                                <button
                                                    onClick={() => handleAddToCart(product.id)}
                                                    disabled={isOutOfStock}
                                                    className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-xs font-bold text-white shadow hover:bg-red-600 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                                                >
                                                    <ShoppingCart size={14} /> Add to Cart
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

        </div>
    );
};

export default Home;