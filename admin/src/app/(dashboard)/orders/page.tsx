"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import AdminHeader from "../../../components/AdminHeader";
import TrackingDetail from "../../../components/TrackingDetail";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (ordersError) throw ordersError;

            // Fetch Profiles for names
            const userIds = ordersData.map(o => o.user_id).filter(id => id !== 'guest-user');
            const { data: profiles } = await supabase.from('profiles').select('id, name, email').in('id', userIds);

            const mappedOrders = ordersData.map((order: any) => {
                const profile = profiles?.find(p => p.id === order.user_id);
                return {
                    ...order,
                    customer: order.user_id === 'guest-user' ? 'Guest User' : (profile?.name || profile?.email || 'Unknown User'),
                    date: new Date(order.created_at).toLocaleDateString(),
                    displayDate: new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    amount: `₹${order.total_amount}`,
                };
            });
            setOrders(mappedOrders);
        } catch (err) {
            console.error("Error loading orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const channel = supabase.channel('admin-updates').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchData()).subscribe();
        return () => { supabase.removeChannel(channel); };
    }, []);

    const handleQuickStatusChange = async (orderId: string, newStatus: string) => {
        setStatusUpdating(orderId);
        const previousOrders = [...orders];

        // Optimistic UI update
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

        try {
            const updates: any = { status: newStatus };
            if (newStatus === 'Shipped') updates.shipped_at = new Date().toISOString();
            if (newStatus === 'Delivered') updates.delivered_at = new Date().toISOString();
            if (newStatus === 'Cancelled') updates.cancelled_at = new Date().toISOString();

            const { error: updateError } = await supabase.from('orders').update(updates).eq('id', orderId);
            if (updateError) throw updateError;

            await supabase.from('order_status_logs').insert([{
                order_id: orderId,
                status: newStatus,
                note: `Quick update to ${newStatus}`,
                updated_by: 'Admin'
            }]);

        } catch (error) {
            console.error("Update failed:", error);
            setOrders(previousOrders); // Revert on failure
            alert("Failed to update status. Check logs.");
        } finally {
            setStatusUpdating(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Shipped": return "bg-blue-100 text-blue-800 border-blue-200";
            case "Delivered": return "bg-green-100 text-green-800 border-green-200";
            case "Cancelled": return "bg-red-100 text-red-800 border-red-200";
            case "Processing": return "bg-purple-100 text-purple-800 border-purple-200";
            case "Out for Delivery": return "bg-orange-100 text-orange-800 border-orange-200";
            default: return "bg-slate-100 text-slate-800 border-slate-200";
        }
    };

    return (
        <>
            <AdminHeader title="Orders Management" />
            <main className="p-8 bg-slate-50 min-h-screen">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <span className="material-icons text-primary">list_alt</span>
                            All Orders
                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">{orders.length}</span>
                        </h2>
                        <button onClick={fetchData} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-primary">
                            <span className={`material-icons ${loading ? 'animate-spin' : ''}`}>refresh</span>
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 w-24 rounded"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 w-32 rounded"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 w-20 rounded"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 w-16 rounded"></div></td>
                                            <td className="px-6 py-4"><div className="h-6 bg-slate-100 w-24 rounded-full"></div></td>
                                            <td className="px-6 py-4"><div className="h-8 bg-slate-100 w-16 rounded mx-auto"></div></td>
                                        </tr>
                                    ))
                                ) : orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">#{order.id.slice(0, 8)}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900 group-hover:text-primary transition-colors">{order.customer}</td>
                                        <td className="px-6 py-4 text-slate-500">{order.displayDate}</td>
                                        <td className="px-6 py-4 font-bold text-slate-900">{order.amount}</td>
                                        <td className="px-6 py-4">
                                            <div className={`relative ${statusUpdating === order.id ? 'opacity-50 pointer-events-none' : ''}`}>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleQuickStatusChange(order.id, e.target.value)}
                                                    className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold border cursor-pointer outline-none focus:ring-2 focus:ring-primary/20 transition-all w-36 ${getStatusColor(order.status)}`}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Out for Delivery">Out for Delivery</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                                <span className="material-icons absolute right-2 top-1/2 -translate-y-1/2 text-[14px] pointer-events-none opacity-50">expand_more</span>
                                                {statusUpdating === order.id && <span className="absolute -right-6 top-1/2 -translate-y-1/2 material-icons animate-spin text-sm text-slate-400">refresh</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-slate-400 hover:text-primary hover:bg-slate-100 p-2 rounded-full transition-all active:scale-95"
                                                title="View Details"
                                            >
                                                <span className="material-icons">visibility</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            {selectedOrder && <TrackingDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
        </>
    );
}
