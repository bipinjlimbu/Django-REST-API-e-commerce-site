import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldAlert, Star } from 'lucide-react';

const Cart = () => {
    // Mathi ko Context hook dynamically verify garna use garna saknu hunchha 
    // Testing ko lagi standard consumer values optimize gariako chha
    const { isAuthenticated = true, user = { is_staff: false, email: "customer@apexstriker.com" } } = useAuth() || {};

    // 🎯 INTENTIONAL TESTING ECOSYSTEM DUMMY DATA MATRIX
    const [cartItems, setCartItems] = useState([
        {
            id: 101,
            quantity: 1,
            product: {
                id: 1,
                name: "Apex Striker Phantom Football Boots",
                price: "4500.00",
                product_image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
                category_name: "Footwear",
                rating: 4.8
            }
        },
        {
            id: 102,
            quantity: 2,
            product: {
                id: 4,
                name: "Alpha Compression Training Shorts",
                price: "1250.00",
                product_image: "https://images.unsplash.com/photo-1617083934555-ac7d4fee12ab?w=500&auto=format&fit=crop&q=60",
                category_name: "Apparel",
                rating: 4.5
            }
        },
        {
            id: 103,
            quantity: 1,
            product: {
                id: 7,
                name: "Apex Ergonomic Hydra-Flask 1L",
                price: "850.00",
                product_image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60",
                category_name: "Accessories",
                rating: 4.2
            }
        }
    ]);

    // 🔄 MUTATION LOGIC HANDLERS (LOCAL DUMMY MATRIX STATE COUPLING)
    const handleUpdateQuantity = (itemId, currentQty, action) => {
        let newQty = action === 'inc' ? currentQty + 1 : currentQty - 1;
        if (newQty < 1) return;

        setCartItems(prevItems =>
            prevItems.map(item => item.id === itemId ? { ...item, quantity: newQty } : item)
        );
    };

    // 🗑️ LOCAL STATE DESTROY ROW TRANSACTION 
    const handleRemoveItem = (itemId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    };

    // 📊 MATHEMATICAL CONTEXT MATRIX
    const subtotal = cartItems.reduce((acc, item) => {
        const itemPrice = item.product?.price ? parseFloat(item.product.price) : 0;
        return acc + (itemPrice * item.quantity);
    }, 0);

    // Rule: Free Delivery threshold matching over Rs. 5000 inside ApexStriker parameters
    const deliveryCharge = subtotal > 5000 || subtotal === 0 ? 0 : 150;
    const totalAmount = subtotal + deliveryCharge;

    // 🚨 REGISTRATION CHECK FRAME 1: Anonymous Route Redirect Block
    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center max-w-md mx-auto space-y-4">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-full">
                    <ShoppingBag size={40} />
                </div>
                <h2 className="text-xl font-black uppercase tracking-wide text-gray-900">Your Cart is Locked</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                    Please log into your active ApexStriker profile to compile personal purchase nodes and monitor ongoing catalog items.
                </p>
                <button
                    onClick={() => window.location.href = '/login'}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-black uppercase text-white shadow-md hover:bg-blue-700 transition-all tracking-wider"
                >
                    Login to Profile <ArrowRight size={16} />
                </button>
            </div>
        );
    }

    // 🚨 REGISTRATION CHECK FRAME 2: Admin Staff Guard
    if (user?.is_staff) {
        return (
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl max-w-2xl mx-auto flex gap-4 items-start text-amber-900 shadow-xs my-12">
                <ShieldAlert className="text-amber-600 shrink-0 mt-0.5" size={24} />
                <div className="space-y-2">
                    <h3 className="font-black text-sm uppercase tracking-wider">Administrative Session Discovered</h3>
                    <p className="text-xs text-amber-700 leading-relaxed">
                        Cart storage frameworks are reserved for consumer profile types. As an Admin/Staff member, please use your system controls or the primary store management dashboard panel to deploy custom inventory nodes.
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

            {cartItems.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 border border-dashed rounded-xl max-w-xl mx-auto flex flex-col items-center space-y-4">
                    <ShoppingBag size={32} className="text-gray-300" />
                    <div className="text-gray-400 font-bold text-xs uppercase tracking-wider">
                        No active purchase items discovered inside your ecosystem.
                    </div>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="rounded-lg bg-gray-900 text-white px-4 py-2 text-xs font-bold uppercase hover:bg-red-600 transition-colors"
                    >
                        Explore Gear Catalog
                    </button>
                </div>
            ) : (
                /* RESPONSIVE SPLIT-GRID VIEW INTERFACES */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* LEFT AREA: ITEMS MOCK STORAGE ENGINE LIST */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => {
                            const parsedPrice = item.product?.price ? parseFloat(item.product.price) : 0.00;

                            return (
                                <div key={item.id} className="flex gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-xs relative group">

                                    {/* Item Image block */}
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                        <img src={item.product?.product_image} alt={item.product?.name} className="w-full h-full object-cover" />
                                    </div>

                                    {/* Item Details block */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div className="space-y-1 pr-6">
                                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block">
                                                {item.product?.category_name}
                                            </span>
                                            <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1">
                                                {item.product?.name}
                                            </h3>
                                            <p className="text-xs font-mono font-bold text-gray-500">Rs. {parsedPrice.toFixed(2)}</p>
                                        </div>

                                        {/* Counters & Math Output row */}
                                        <div className="flex items-center justify-between pt-3">
                                            <div className="flex items-center border border-gray-200 rounded-md bg-gray-50">
                                                <button
                                                    disabled={item.quantity <= 1}
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity, 'dec')}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-30"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="px-3 text-xs font-black font-mono text-gray-900">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity, 'inc')}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 transition-colors"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>

                                            <span className="font-black text-sm sm:text-base text-gray-900 font-mono">
                                                Rs. {(parsedPrice * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Delete Button top floating right */}
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors"
                                        title="Delete Item"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* RIGHT AREA: BILLING SUMMARY */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-6">
                        <h2 className="text-sm font-black uppercase text-gray-900 tracking-wider border-b border-gray-200 pb-3">
                            Order Summary
                        </h2>

                        <div className="space-y-3 font-mono text-xs sm:text-sm">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span>Rs. {subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Delivery Fee</span>
                                <span>{deliveryCharge === 0 ? "FREE" : `Rs. ${deliveryCharge.toFixed(2)}`}</span>
                            </div>

                            {/* Free Delivery alert layout mapping */}
                            {subtotal < 5000 && subtotal > 0 && (
                                <p className="text-[10px] text-amber-600 font-sans font-medium italic">
                                    *Add Rs. {(5000 - subtotal).toFixed(2)} more to unlock FREE home delivery layout!
                                </p>
                            )}

                            <div className="border-t border-gray-200 pt-3 flex justify-between font-black text-sm sm:text-base text-gray-900">
                                <span>Total Amount</span>
                                <span>Rs. {totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => alert(`Processing checkout matrix for amount: Rs. ${totalAmount.toFixed(2)}`)}
                            className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-xs sm:text-sm font-black uppercase text-white shadow-md hover:bg-red-700 transition-all tracking-wider"
                        >
                            Proceed to Checkout <ArrowRight size={14} />
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
};

export default Cart;