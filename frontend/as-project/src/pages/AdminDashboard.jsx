import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Settings, ShieldAlert, ChevronRight, LogOut } from 'lucide-react';

// Import our standalone section modules
import AdminOverview from '../dashboard/AdminOverview';
import AdminOrders from '../dashboard/AdminOrders';
import AdminUsers from '../dashboard/AdminUsers';
import AdminCatalog from '../dashboard/AdminCatalog';
import AdminProducts from '../dashboard/AdminProducts';
import AdminCategories from '../dashboard/AdminCategories';
import AdminBrands from '../dashboard/AdminBrands';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('users');

    // Section Mapper dictionary
    const sections = {
        users: <AdminUsers />,
        products: <AdminProducts />,
        categories: <AdminCategories />,
        brands: <AdminBrands />,
        overview: <AdminOverview />,
        orders: <AdminOrders />,
        catalog: <AdminCatalog />
    };

    const menuItems = [
        { id: 'users', name: 'User Index', icon: Users },
        { id: 'products', name: 'Product Index', icon: Package },
        { id: 'categories', name: 'Category Index', icon: Settings },
        { id: 'brands', name: 'Brand Index', icon: LayoutDashboard },
        { id: 'overview', name: 'Overview Matrix', icon: LayoutDashboard },
        { id: 'orders', name: 'Orders Queue', icon: Package },
        { id: 'catalog', name: 'Catalog Edit', icon: Settings },
    ];

    return (
        <div className="min-h-[calc(100vh-16rem)] bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">

                {/* SIDEBAR NAVIGATION CONTROLLER */}
                <div className="w-full md:w-64 flex-shrink-0 space-y-4">
                    <div className="bg-gray-900 rounded-xl p-4 text-white flex items-center gap-3 shadow-md border-l-4 border-red-600">
                        <ShieldAlert className="text-red-500 flex-shrink-0" size={22} />
                        <div>
                            <h2 className="text-xs font-black uppercase tracking-widest text-white">ApexStriker</h2>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Root Control Board</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-2 space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${activeTab === item.id ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <span className="flex items-center gap-2"><Icon size={14} /> {item.name}</span>
                                    <ChevronRight size={12} className={activeTab === item.id ? 'text-white' : 'text-gray-400'} />
                                </button>
                            );
                        })}
                        <hr className="my-2 border-gray-100" />
                        <button
                            onClick={() => navigate('/profile')}
                            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider text-gray-500 hover:bg-gray-50 hover:text-red-600 transition-all"
                        >
                            <LogOut size={14} className="rotate-180" /> Exit Terminal
                        </button>
                    </div>
                </div>

                {/* MODULAR SECTION WORKSPACE */}
                <div className="flex-1 min-w-0">
                    {sections[activeTab] || <AdminUsers />}
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;