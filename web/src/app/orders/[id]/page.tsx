"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import BottomNav from "../../../components/BottomNav";

export default function OrderTrackingPage() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [driver, setDriver] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [driverLocation, setDriverLocation] = useState({ lat: 17.3850, lng: 78.4867 });

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                // Parallel fetching for speed
                const [orderRes, logsRes] = await Promise.all([
                    supabase.from('orders').select('*, order_items(*, medicines(*))').eq('id', id).single(),
                    supabase.from('order_status_logs').select('*').eq('order_id', id).order('created_at', { ascending: false })
                ]);

                if (orderRes.error) throw orderRes.error;
                setOrder(orderRes.data);
                if (logsRes.data) setLogs(logsRes.data);

                if (orderRes.data.driver_id) {
                    const { data: driverRes } = await supabase.from('drivers').select('*').eq('id', orderRes.data.driver_id).single();
                    if (driverRes) setDriver(driverRes);
                }
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        const channel = supabase.channel(`order-track-${id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `id=eq.${id}` }, (payload) => setOrder(payload.new))
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'order_status_logs', filter: `order_id=eq.${id}` }, (payload) => setLogs(prev => [payload.new, ...prev]))
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [id]);

    useEffect(() => {
        if (order?.status === 'Out for Delivery') {
            const interval = setInterval(() => {
                setDriverLocation(prev => ({
                    lat: prev.lat + (Math.random() - 0.5) * 0.0005,
                    lng: prev.lng + (Math.random() - 0.5) * 0.0005
                }));
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [order?.status]);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <div className="h-14 bg-white shadow-sm w-full animate-pulse"></div>
            <div className="mt-4 mx-4 h-64 bg-slate-200 rounded-2xl animate-pulse"></div>
            <div className="mt-6 mx-4 space-y-4">
                <div className="h-20 bg-white rounded-2xl animate-pulse"></div>
                <div className="h-40 bg-white rounded-2xl animate-pulse"></div>
            </div>
        </div>
    );

    if (!order) return <div className="p-8 text-center mt-20">Order not found.</div>;

    const steps = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentStepIndex = steps.indexOf(order.status) === -1 ? 0 : steps.indexOf(order.status);
    const progressPercent = (currentStepIndex / (steps.length - 1)) * 100;

    return (
        <div className="min-h-screen bg-slate-50 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <header className="fixed top-0 inset-x-0 bg-white/90 backdrop-blur z-50 px-4 py-3 shadow-sm border-b border-slate-100 flex items-center gap-4 transition-all">
                <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-slate-50 text-slate-600 transition-colors">
                    <span className="material-icons">arrow_back</span>
                </button>
                <div className="flex-1">
                    <h1 className="font-bold text-slate-800 text-lg">Track Order</h1>
                    <p className="text-xs text-slate-500 font-medium">#{order.id.slice(0, 8)} • {order.order_items?.length || 1} Items</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700 animate-pulse'
                    }`}>
                    {order.status}
                </span>
            </header>

            {/* Map Area */}
            <div className="mt-14 relative h-72 bg-slate-200 w-full overflow-hidden border-b border-slate-200 shadow-inner group">
                <div className="absolute inset-0 bg-slate-200 opacity-60" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                {/* Driver Marker */}
                <div className="absolute transition-all duration-[2000ms] ease-linear flex flex-col items-center z-10"
                    style={{ top: '50%', left: '50%', transform: `translate(${(driverLocation.lng - 78.4867) * 10000}px, ${(driverLocation.lat - 17.3850) * 10000}px)` }}>
                    <div className="relative">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full animate-ping absolute -inset-2"></div>
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-blue-600 text-blue-600 z-10 relative">
                            <span className="material-icons text-xl">two_wheeler</span>
                        </div>
                    </div>
                    {driver && <div className="mt-2 bg-white/90 px-3 py-1 rounded-lg text-xs font-bold shadow-sm whitespace-nowrap">{driver.name}</div>}
                </div>

                {/* ETA Float */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur px-5 py-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estimated Arrival</p>
                        <p className="text-sm font-bold text-slate-800">
                            {order.estimated_delivery ? new Date(order.estimated_delivery).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                                order.status === 'Delivered' ? 'Arrived' : 'Calculating...'}
                        </p>
                    </div>
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                        <span className="material-icons">schedule</span>
                    </div>
                </div>
            </div>

            <main className="px-4 py-6 space-y-6 -mt-4 relative z-10">

                {/* OTP Card */}
                {(order.status === 'Out for Delivery' || order.status === 'Shipped') && order.delivery_otp && (
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden transform hover:scale-[1.02] transition-transform">
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <span className="material-icons text-blue-200 mb-2">lock_open</span>
                            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">Share Delivery PIN</p>
                            <div className="text-5xl font-mono font-bold tracking-[0.2em] text-white drop-shadow-md my-2">
                                {order.delivery_otp}
                            </div>
                            <p className="text-xs text-blue-200 mt-2 opacity-80">Verify this PIN with your delivery partner</p>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
                    </div>
                )}

                {/* Status Timeline */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <span className="material-icons text-slate-300 text-lg">timeline</span> Tracking Status
                    </h3>
                    <div className="relative pl-2">
                        <div className="absolute left-[15px] top-2 bottom-4 w-0.5 bg-slate-100 rounded-full">
                            <div className="w-full bg-green-500 transition-all duration-1000 ease-out rounded-full" style={{ height: `${progressPercent}%` }}></div>
                        </div>

                        <div className="space-y-8">
                            {steps.map((step, index) => {
                                const isCompleted = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;
                                const stepLog = logs.find(l => l.status === step);

                                return (
                                    <div key={step} className="relative pl-12 group transition-all">
                                        <div className={`absolute left-0 top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all z-10 ${isCompleted ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-200' : 'bg-white border-slate-200 text-slate-300'
                                            } ${isCurrent ? 'ring-4 ring-green-100 scale-110' : ''}`}>
                                            <span className="material-icons text-[14px]">{isCompleted ? 'check' : 'circle'}</span>
                                        </div>

                                        <div className={`transition-all ${isCurrent ? 'transform translate-x-1' : ''}`}>
                                            <h4 className={`text-sm font-bold ${isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>{step}</h4>
                                            {isCompleted && stepLog && (
                                                <div className="mt-1">
                                                    <p className="text-[10px] text-slate-400 font-medium">
                                                        {new Date(stepLog.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(stepLog.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                    {stepLog.note && isCurrent && (
                                                        <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                                                            "{stepLog.note}"
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Driver Card */}
                {driver && (
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-2xl border border-slate-100">👷</div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800">{driver.name}</h4>
                            <p className="text-xs text-slate-500">Delivery Partner</p>
                            <div className="flex items-center gap-1 mt-1">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span className="text-[10px] text-green-600 font-bold uppercase">Online</span>
                            </div>
                        </div>
                        <a href={`tel:${driver.phone}`} className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center hover:bg-green-500 hover:text-white transition-all shadow-sm">
                            <span className="material-icons">phone</span>
                        </a>
                    </div>
                )}
            </main>
            <BottomNav />
        </div>
    );
}
