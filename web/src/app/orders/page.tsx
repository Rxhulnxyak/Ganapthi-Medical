"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import BottomNav from "../../components/BottomNav";

interface OrderItem {
    id: string;
    medicine_id: string;
    quantity: number;
    price: number;
    medicines?: { name: string; image_url?: string };
}

interface Order {
    id: string;
    created_at: string;
    status: string;
    total_amount: number;
    order_items: OrderItem[];
}

export default function MyOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = '/login';
                return;
            }

            // Fetch orders with limited items to improve performance
            const { data, error } = await supabase
                .from('orders')
                .select('*, order_items(id, quantity, price, medicines(name, image_url))')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

        // Realtime Subscription for seamless updates
        const channel = supabase
            .channel('my-orders-list')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
                fetchOrders(); // Refresh on update
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const activeOrders = orders.filter(o => ['Pending', 'Order Placed', 'Processing', 'Shipped', 'Out for Delivery'].includes(o.status));
    const pastOrders = orders.filter(o => ['Delivered', 'Cancelled'].includes(o.status));
    const currentList = activeTab === 'active' ? activeOrders : pastOrders;

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Header */}
            <header className="fixed top-0 inset-x-0 bg-white z-50 px-4 pt-4 pb-2 shadow-sm border-b border-slate-100">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
                    <div className="bg-slate-100 p-2 rounded-full">
                        <span className="material-icons text-slate-500">search</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'active'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Active Orders ({activeOrders.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('past')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'past'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Past Orders
                    </button>
                </div>
            </header>

            <main className="pt-36 px-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {loading ? (
                    // Skeleton Loader
                    [1, 2, 3].map((i) => (
                        <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex justify-between mb-4">
                                <div className="h-4 bg-slate-100 rounded w-24 animate-pulse"></div>
                                <div className="h-6 bg-slate-100 rounded-full w-20 animate-pulse"></div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <div className="w-12 h-12 bg-slate-100 rounded-lg animate-pulse"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                                        <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : currentList.length === 0 ? (
                    <div className="text-center py-20 flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                            <span className="material-icons text-5xl text-slate-300">
                                {activeTab === 'active' ? 'local_shipping' : 'history'}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">No {activeTab} orders</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
                            {activeTab === 'active'
                                ? "You don't have any orders in progress currently."
                                : "Your past order history will appear here."}
                        </p>
                        {activeTab === 'active' && (
                            <Link href="/" className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold text-sm shadow-lg shadow-slate-200 hover:scale-105 transition-transform">
                                Start Shopping
                            </Link>
                        )}
                    </div>
                ) : (
                    currentList.map((order) => (
                        <Link href={`/orders/${order.id}`} key={order.id} className="block group">
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 group-active:scale-[0.98] transition-transform hover:shadow-md">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm ${order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                                                order.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                                                    'bg-blue-100 text-blue-600'
                                            }`}>
                                            <span className="material-icons">
                                                {order.status === 'Delivered' ? 'check' :
                                                    order.status === 'Cancelled' ? 'close' :
                                                        order.status === 'Shipped' ? 'local_shipping' :
                                                            'inventory_2'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{order.status}</p>
                                            <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900">₹{order.total_amount}</p>
                                        <p className="text-[10px] text-slate-400">Order #{order.id.slice(0, 6)}</p>
                                    </div>
                                </div>

                                <div className="space-y-3 bg-slate-50/50 p-3 rounded-xl border border-slate-50">
                                    {order.order_items?.slice(0, 2).map((item) => (
                                        <div key={item.id} className="flex gap-3 items-center">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-slate-700 line-clamp-1">{item.medicines?.name || 'Medicine'}</p>
                                                <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {order.order_items?.length > 2 && (
                                        <p className="text-xs font-bold text-slate-500 pl-1">+ {order.order_items.length - 2} more items</p>
                                    )}
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <button className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">View Details</button>
                                    <button className="flex items-center gap-1 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-sm hover:shadow group-hover:bg-primary transition-colors">
                                        Track Order
                                        <span className="material-icons text-[14px]">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </main>
            <BottomNav />
        </div>
    );
}
