import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../context/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldAlert, Loader2, AlertCircle } from 'lucide-react';

const Cart = () => {
    const { isAuthenticated, user } = useAuth();

    // 1. STATE CONFIGURATION
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(null);

    // 2. FETCH DATA FROM YOUR ENDPOINT
    useEffect(() => {
        if (!isAuthenticated || user?.is_staff) {
            setIsLoading(false);
            return;
        }

        let isMounted = true;
        const fetchLiveCart = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await api.get('/api/cart/');
                if (!isMounted) return;

                const extractedItems = response.data?.cart_items || response.data || [];
                setCartItems(Array.isArray(extractedItems) ? extractedItems : []);
            } catch (err) {
                console.error("Cart data streaming bottleneck:", err);
                if (isMounted) {
                    setError("Could not stream latest basket items from the server channel.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchLiveCart();

        return () => {
            isMounted = false;
        };
    }, [isAuthenticated, user]);

    // 3. 🔄 PATCH QUANTITY API MUTATION HANDLER
    const handleUpdateQuantity = async (itemId, currentQty, action) => {
        let newQty = action === 'inc' ? currentQty + 1 : currentQty - 1;
        if (newQty < 1) return;

        setIsUpdating(itemId);
        try {
            await api.patch(`/api/cart/item/${itemId}/`, { quantity: newQty });

            setCartItems(prevItems =>
                prevItems.map(item => item.id === itemId ? { ...item, quantity: newQty } : item)
            );
        } catch (err) {
            console.error("DRF channel rejected patch routine execution:", err);
            alert("Could not update item quantity on server matrix.");
        } finally {
            setIsUpdating(null);
        }
    };

    // 4. 🗑️ DELETE METHOD OPERATION ROUTINE
    const handleRemoveItem = async (itemId) => {
        try {
            await api.delete(`/api/cart/item/${itemId}/`);
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        } catch (err) {
            console.error("Deletion failed:", err);
            alert("Failed to drop selected item.");
        }
    };

    // 5. MATH ENGINE METRICS (Fixed parsing path here too)
    const subtotal = cartItems.reduce((acc, item) => {
        // Pointing to item.product.product.price based on your log structure
        const productDetails = item.product?.product || item.product;
        const itemPrice = productDetails?.price ? parseFloat(productDetails.price) : 0;
        return acc + (itemPrice * item.quantity);
    }, 0);

    const deliveryCharge = subtotal > 5000 || subtotal === 0 ? 0 : 150;
    const totalAmount = subtotal + deliveryCharge;

    // PROTECTION GATES
    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto space-y-4">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-full"><ShoppingBag size={40} /></div>
                <h2 className="text-xl font-black uppercase tracking-wide text-gray-900">Your Cart is Locked</h2>
                <button onClick={() => window.location.href = '/login'} className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-black uppercase text-white shadow-md hover:bg-blue-700 transition-all tracking-wider">
                    Login to Profile <ArrowRight size={16} />
                </button>
            </div>
        );
    }

    if (user?.is_staff) {
        return (
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl max-w-2xl mx-auto flex gap-4 items-start text-amber-900 shadow-xs my-12">
                <ShieldAlert className="text-amber-600 shrink-0 mt-0.5" size={24} />
                <div className="space-y-2">
                    <h3 className="font-black text-sm uppercase tracking-wider">Administrative Session Active</h3>
                    <p className="text-xs text-amber-700 leading-relaxed">Cart engines are restricted to customer profiles.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-black uppercase text-gray-900 tracking-wider mb-8 border-b border-gray-200 pb-4">
                Shopping Cart Matrix
            </h1>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3 bg-white border border-gray-100 rounded-xl shadow-xs">
                    <Loader2 size={24} className="animate-spin text-red-600" />
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Streaming records...</p>
                </div>
            ) : error ? (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center gap-2 max-w-xl mx-auto">
                    <AlertCircle size={16} /><span>{error}</span>
                </div>
            ) : cartItems.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 border border-dashed rounded-xl max-w-xl mx-auto flex flex-col items-center space-y-4">
                    <ShoppingBag size={32} className="text-gray-300" />
                    <div className="text-gray-400 font-bold text-xs uppercase tracking-wider">No active gear discovered inside your ecosystem.</div>
                    <button onClick={() => window.location.href = '/'} className="rounded-lg bg-gray-900 text-white px-4 py-2 text-xs font-bold uppercase hover:bg-red-600 transition-colors">Explore Gear Catalog</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* LEFT CONTAINER AREA: MAPPED ITEMS */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => {
                            // SAFE NESTING RESOLVER FOR YOUR SPECIFIC BACKEND response
                            // Extracts item.product.product if it exists, otherwise falls back to item.product
                            const productDetails = item.product?.product || item.product;

                            const parsedPrice = productDetails?.price ? parseFloat(productDetails.price) : 0.00;
                            const productImage = productDetails?.product_image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60";
                            const productName = productDetails?.name || "Premium Asset";
                            const categoryName = productDetails?.category?.name || "Athletic Apparel";
                            const brandName = productDetails?.brand?.name;
                            const itemQuantity = item.quantity || 1;

                            return (
                                <div key={item.id} className="flex gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-xs relative group">

                                    {/* Image Block */}
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                        <img src={productImage} alt={productName} className="w-full h-full object-cover" />
                                    </div>

                                    {/* Product Meta Specifications Data Area */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="space-y-0.5 pr-6">
                                            <div className="flex gap-2 items-center text-[10px] font-bold uppercase tracking-widest">
                                                <span className="text-red-500">{categoryName}</span>
                                                {brandName && (
                                                    <>
                                                        <span className="text-gray-300">•</span>
                                                        <span className="text-gray-400">{brandName}</span>
                                                    </>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1">{productName}</h3>
                                            <p className="text-xs font-mono font-bold text-gray-500">Rs. {parsedPrice.toFixed(2)}</p>
                                        </div>

                                        {/* Operations Core Counters Layer */}
                                        <div className="flex items-center justify-between pt-3">
                                            <div className="flex items-center border border-gray-200 rounded-md bg-gray-50">
                                                <button
                                                    disabled={itemQuantity <= 1 || isUpdating === item.id}
                                                    onClick={() => handleUpdateQuantity(item.id, itemQuantity, 'dec')}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-30"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="px-3 text-xs font-black font-mono text-gray-900 min-w-[20px] text-center">
                                                    {isUpdating === item.id ? '...' : itemQuantity}
                                                </span>
                                                <button
                                                    disabled={isUpdating === item.id}
                                                    onClick={() => handleUpdateQuantity(item.id, itemQuantity, 'inc')}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-30"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>

                                            <span className="font-black text-sm sm:text-base text-gray-900 font-mono">
                                                Rs. {(parsedPrice * itemQuantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Erasure Anchor Command Trigger */}
                                    <button onClick={() => handleRemoveItem(item.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors" title="Delete record node">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* RIGHT CONTAINER AREA: INVOICING CARD METRICS */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-6">
                        <h2 className="text-sm font-black uppercase text-gray-900 tracking-wider border-b border-gray-200 pb-3">Order Summary</h2>
                        <div className="space-y-3 font-mono text-xs sm:text-sm">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span>Rs. {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Delivery Fee</span>
                                <span> Free </span>
                            </div>
                            <div className="border-t border-gray-200 pt-3 flex justify-between font-black text-sm sm:text-base text-gray-900">
                                <span>Total Amount</span>
                                <span>Rs. {totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                        <button className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-xs sm:text-sm font-black uppercase text-white shadow-md hover:bg-red-700 transition-all tracking-wider">
                            Proceed to Checkout <ArrowRight size={14} />
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
};

export default Cart;