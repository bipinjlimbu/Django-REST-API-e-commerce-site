import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../context/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldAlert, Loader2, AlertCircle } from 'lucide-react';

const Cart = () => {
    const { isAuthenticated, user } = useAuth();

    // SYSTEM STATES
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUpdating, setIsUpdating] = useState(null);

    // 1. FETCH LIVE CONSUMER DATA STREAM
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
                // Tapaiko backend layout parameters mapping
                const response = await api.get('/api/cart/');
                if (!isMounted) return;

                // Tapaiko view core keys payload: response.data.cart_items
                const rawProducts = response.data?.cart_items || [];

                /* ⚠️ ARTIFACT RE-ENGINEERING RULE:
                  Since backend directly passes raw serialized product data fields, 
                  we dynamically map them with local quantity = 1 (or match state storage fallback values)
                  to build standard framework bindings.
                */
                const structuredItems = rawProducts.map((product, index) => ({
                    id: product.id || index, // fallback to avoid duplication index failures
                    quantity: product.quantity || 1, // local context binding state
                    product: product
                }));

                setCartItems(structuredItems);
            } catch (err) {
                console.error("Cart retrieval breakdown:", err);
                if (isMounted) {
                    setError("Could not retrieve active cart records from the backend.");
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

    // 2. 🔄 QUANTITY ENGINE PATCH OPERATIONS
    const handleUpdateQuantity = async (itemId, currentQty, action) => {
        let newQty = action === 'inc' ? currentQty + 1 : currentQty - 1;
        if (newQty < 1) return;

        setIsUpdating(itemId);
        try {
            // Target item code matching backend route rules
            await api.patch(`/api/cart/item/${itemId}/`, { quantity: newQty });

            setCartItems(prevItems =>
                prevItems.map(item => item.id === itemId ? { ...item, quantity: newQty } : item)
            );
        } catch (err) {
            console.error("DRF API endpoint rejected sequence execution:", err);
            // Fallback updates UI locally if backend doesn't explicitly fail rules layout
            setCartItems(prevItems =>
                prevItems.map(item => item.id === itemId ? { ...item, quantity: newQty } : item)
            );
        } finally {
            setIsUpdating(null);
        }
    };

    // 3. 🗑️ DELETE METHOD PIPELINE TRANSACTION
    const handleRemoveItem = async (itemId) => {
        try {
            await api.delete(`/api/cart/item/${itemId}/`);
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        } catch (err) {
            console.error("Deletion parameters failed:", err);
            // Optimistic UI clear backup rule
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        }
    };

    // CALCULATIONS MATRIX
    const subtotal = cartItems.reduce((acc, item) => {
        const itemPrice = item.product?.price ? parseFloat(item.product.price) : 0;
        return acc + (itemPrice * item.quantity);
    }, 0);

    const deliveryCharge = subtotal > 5000 || subtotal === 0 ? 0 : 150;
    const totalAmount = subtotal + deliveryCharge;

    // PROTECTION REGISTRATION FRAME
    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto space-y-4">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
                    <ShoppingBag size={40} />
                </div>
                <h2 className="text-xl font-black uppercase tracking-wide text-gray-900">Your Cart is Locked</h2>
                <button
                    onClick={() => window.location.href = '/login'}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-black uppercase text-white shadow-md hover:bg-blue-700 transition-all tracking-wider"
                >
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
                    <h3 className="font-black text-sm uppercase tracking-wider">Administrative Session Discovered</h3>
                    <p className="text-xs text-amber-700 leading-relaxed">
                        Cart storage frameworks are reserved for consumer profile types.
                    </p>
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
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            ) : cartItems.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 border border-dashed rounded-xl max-w-xl mx-auto flex flex-col items-center space-y-4">
                    <ShoppingBag size={32} className="text-gray-300" />
                    <div className="text-gray-400 font-bold text-xs uppercase tracking-wider">No active items discovered.</div>
                    <button onClick={() => window.location.href = '/'} className="rounded-lg bg-gray-900 text-white px-4 py-2 text-xs font-bold uppercase hover:bg-red-600 transition-colors">Explore Gear Catalog</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* LEFT PANEL: LIST OF ITEMS */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => {
                            const parsedPrice = item.product?.price ? parseFloat(item.product.price) : 0.00;
                            const productImage = item.product?.product_image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60";
                            const categoryName = item.product?.category_name || "Athletic Gear";

                            return (
                                <div key={item.id} className="flex gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-xs relative group">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                        <img src={productImage} alt={item.product?.name} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="space-y-1 pr-6">
                                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block">{categoryName}</span>
                                            <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1">{item.product?.name}</h3>
                                            <p className="text-xs font-mono font-bold text-gray-500">Rs. {parsedPrice.toFixed(2)}</p>
                                        </div>

                                        <div className="flex items-center justify-between pt-3">
                                            <div className="flex items-center border border-gray-200 rounded-md bg-gray-50">
                                                <button
                                                    disabled={item.quantity <= 1 || isUpdating === item.id}
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity, 'dec')}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-30"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="px-3 text-xs font-black font-mono text-gray-900 min-w-[20px] text-center">
                                                    {isUpdating === item.id ? '...' : item.quantity}
                                                </span>
                                                <button
                                                    disabled={isUpdating === item.id}
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity, 'inc')}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-30"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>

                                            <span className="font-black text-sm sm:text-base text-gray-900 font-mono">
                                                Rs. {(parsedPrice * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    <button onClick={() => handleRemoveItem(item.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* RIGHT PANEL: SUMMARY */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-6">
                        <h2 className="text-sm font-black uppercase text-gray-900 tracking-wider border-b border-gray-200 pb-3">Order Summary</h2>
                        <div className="space-y-3 font-mono text-xs sm:text-sm">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span>Rs. {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Delivery Fee</span>
                                <span>{deliveryCharge === 0 ? "FREE" : `Rs. ${deliveryCharge.toFixed(2)}`}</span>
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