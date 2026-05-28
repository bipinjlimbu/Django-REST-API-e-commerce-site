import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Star, Heart, ArrowRight, Flame } from 'lucide-react';

// Premium dummy products data structure for ApexStriker
const DUMMY_PRODUCTS = [
    {
        id: 1,
        name: "Striker Pro Carbon Tennis Racket",
        category: "Tennis",
        price: 219.99,
        rating: 4.8,
        reviews: 124,
        image: "https://images.unsplash.com/photo-1617083934555-ac7d4fee12ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        tag: "Best Seller",
        isHot: true
    },
    {
        id: 2,
        name: "Apex Kinetic Running Shoes",
        category: "Footwear",
        price: 145.00,
        rating: 4.6,
        reviews: 89,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        tag: "New",
        isHot: false
    },
    {
        id: 3,
        name: "Vortex Aero Basketball",
        category: "Basketball",
        price: 59.99,
        rating: 4.9,
        reviews: 210,
        image: "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        tag: "Top Rated",
        isHot: true
    },
    {
        id: 4,
        name: "Apex Precision Dumbbell Set (20kg)",
        category: "Fitness",
        price: 89.50,
        rating: 4.5,
        reviews: 45,
        image: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        tag: "10% OFF",
        isHot: false
    },
    {
        id: 5,
        name: "Striker Elite Hydration Flask",
        category: "Accessories",
        price: 34.99,
        rating: 4.7,
        reviews: 67,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        tag: "Trending",
        isHot: false
    },
    {
        id: 6,
        name: "Viper Breathable Training Hoodie",
        category: "Apparel",
        price: 75.00,
        rating: 4.4,
        reviews: 53,
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
        tag: "New Arrival",
        isHot: false
    }
];

const Home = () => {
    const { isAuthenticated } = useAuth();

    const handleAddToCart = (productId) => {
        console.log(`Product ${productId} added to cart!`);
        // Cart Context handler implementation goes here
    };

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

            {/* 🏷️ PRODUCT CATALOG GRID GRID SECTION */}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {DUMMY_PRODUCTS.map((product) => (
                        <div key={product.id} className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">

                            {/* Product Badge Ribbon */}
                            {product.tag && (
                                <span className={`absolute top-3 left-3 z-10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded text-white shadow-sm ${product.isHot ? 'bg-red-600' : 'bg-gray-900'
                                    }`}>
                                    {product.tag}
                                </span>
                            )}

                            {/* Wishlist Button Overlay */}
                            <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-xs text-gray-400 hover:text-red-600 shadow-sm border border-gray-100 transition-colors">
                                <Heart size={16} />
                            </button>

                            {/* Image Canvas Box */}
                            <div className="aspect-square w-full bg-gray-100 overflow-hidden relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Core Text Info Metadata Block */}
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div className="space-y-1">
                                    <span className="text-[11px] font-bold text-red-500 uppercase tracking-widest">{product.category}</span>
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
                                                    className={i < Math.floor(product.rating) ? "fill-amber-500" : "text-gray-300"}
                                                />
                                            ))}
                                        </div>
                                        <span className="font-bold text-gray-700 ml-1">{product.rating}</span>
                                        <span className="text-gray-400">({product.reviews})</span>
                                    </div>
                                </div>

                                {/* Purchase Action Row */}
                                <div className="flex items-center justify-between pt-5 mt-4 border-t border-gray-100">
                                    <span className="text-xl font-black text-gray-900 font-mono">
                                        ${product.price.toFixed(2)}
                                    </span>

                                    <button
                                        onClick={() => handleAddToCart(product.id)}
                                        className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-xs font-bold text-white shadow hover:bg-red-600 transition-colors"
                                    >
                                        <ShoppingCart size={14} /> Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default Home;