"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

export default function TrackingDetail({ order: initialOrder, onClose }: { order: any, onClose: () => void }) {
    const [order, setOrder] = useState<any>(initialOrder);
    const [logs, setLogs] = useState<any[]>([]);
    const [driverLocation, setDriverLocation] = useState({ lat: 17.3850, lng: 78.4867 });
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [currentDriver, setCurrentDriver] = useState<any>(null);
    const [availableDrivers, setAvailableDrivers] = useState<any[]>([]);
    const [assigning, setAssigning] = useState(false);

    // Status Logic
    const [updateNote, setUpdateNote] = useState("");
    const [courierName, setCourierName] = useState("");
    const [trackingNumber, setTrackingNumber] = useState("");
    const [otpInput, setOtpInput] = useState("");
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [targetStatus, setTargetStatus] = useState("");

    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    // Initial Fetch & Realtime
    useEffect(() => {
        fetchOrderDetails();
        fetchLogs();
        fetchMessages();
        fetchDriverInfo();
        fetchAvailableDrivers();

        const chatChannel = supabase.channel(`order-chat-${initialOrder.id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `order_id=eq.${initialOrder.id}` }, (payload) => {
                setMessages(prev => [...prev, payload.new]);
                scrollToBottom();
            }).subscribe();

        const logsChannel = supabase.channel(`order-logs-${initialOrder.id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'order_status_logs', filter: `order_id=eq.${initialOrder.id}` }, () => {
                fetchLogs(); fetchOrderDetails();
            }).subscribe();

        return () => { supabase.removeChannel(chatChannel); supabase.removeChannel(logsChannel); };
    }, [initialOrder.id]);

    useEffect(() => {
        // Driver Animation
        if (order.status !== 'Delivered' && order.status !== 'Cancelled') {
            const interval = setInterval(() => {
                setDriverLocation(prev => ({
                    lat: prev.lat + (Math.random() - 0.5) * 0.001, lng: prev.lng + (Math.random() - 0.5) * 0.001
                }));
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [order.status]);

    const fetchOrderDetails = async () => { const { data } = await supabase.from('orders').select('*').eq('id', initialOrder.id).single(); if (data) setOrder(data); };
    const fetchLogs = async () => { const { data } = await supabase.from('order_status_logs').select('*').eq('order_id', initialOrder.id).order('created_at', { ascending: false }); if (data) setLogs(data); };
    const fetchMessages = async () => { const { data } = await supabase.from('messages').select('*').eq('order_id', initialOrder.id).order('created_at', { ascending: true }); if (data) setMessages(data); };
    const fetchDriverInfo = async () => { if (order?.driver_id) { const { data } = await supabase.from('drivers').select('*').eq('id', order.driver_id).single(); if (data) { setCurrentDriver(data); setDriverLocation({ lat: data.current_lat || 17.3850, lng: data.current_lng || 78.4867 }); } } };
    const fetchAvailableDrivers = async () => { const { data } = await supabase.from('drivers').select('*').eq('status', 'available'); if (data) setAvailableDrivers(data); };

    const handleSendMessage = async () => { if (!newMessage.trim()) return; await supabase.from('messages').insert([{ order_id: order.id, sender_role: 'admin', content: newMessage }]); setNewMessage(""); };

    const handleAssignDriver = async (driverId: string) => {
        await supabase.from('orders').update({ driver_id: driverId, status: 'Processing' }).eq('id', order.id);
        await supabase.from('order_status_logs').insert([{ order_id: order.id, status: 'Processing', note: 'Driver assigned to order.', updated_by: 'Admin' }]);
        setAssigning(false); fetchDriverInfo();
    };

    const initiateStatusUpdate = (status: string) => {
        setTargetStatus(status);
        setShowStatusModal(true);
        // Default recommended notes
        if (status === 'Processing') setUpdateNote("Order verified and packed at warehouse.");
        if (status === 'Shipped') setUpdateNote("Package handed over to courier partner.");
        if (status === 'Out for Delivery') setUpdateNote("Rider is out for delivery.");
        if (status === 'Delivered') setUpdateNote("Delivered to customer.");
    };

    const confirmStatusUpdate = async () => {
        let updates: any = { status: targetStatus };
        let logNote = updateNote;

        if (targetStatus === 'Shipped') {
            if (!courierName || !trackingNumber) return alert("Enter Courier & Tracking Number");
            updates.courier_partner = courierName;
            updates.tracking_number = trackingNumber;
            updates.shipped_at = new Date().toISOString();

            // Estimated Delivery Calculation
            const isLocal = courierName.toLowerCase().includes('dunzo') || courierName.toLowerCase().includes('uber');
            const deliveryDays = isLocal ? 0 : 2; // Simple Logic: Local = Today, else +2 Days
            const estimatedDate = new Date();
            estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);
            updates.estimated_delivery = estimatedDate.toISOString();

            logNote += ` (Courier: ${courierName}, Track #: ${trackingNumber})`;
        }

        if (targetStatus === 'Delivered') {
            if (order.delivery_otp && otpInput !== order.delivery_otp) return alert("Invalid OTP");
            updates.delivered_at = new Date().toISOString();
        }

        if (targetStatus === 'Out for Delivery') {
            // Maybe auto-assign driver if not exists?
        }

        const { error } = await supabase.from('orders').update(updates).eq('id', order.id);

        if (!error) {
            await supabase.from('order_status_logs').insert([{ order_id: order.id, status: targetStatus, note: logNote, updated_by: 'Admin' }]);
            setShowStatusModal(false);
            fetchOrderDetails();
        } else {
            alert("Failed to update status");
        }
    };

    const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
    useEffect(scrollToBottom, [messages]);

    // Calculate Estimated Delivery Display
    const getEstimatedDelivery = () => {
        if (order.delivered_at) return `Delivered on ${new Date(order.delivered_at).toLocaleDateString()}`;
        if (order.estimated_delivery) {
            const d = new Date(order.estimated_delivery);
            const today = new Date();
            if (d.toDateString() === today.toDateString()) return "Arriving Today";
            return `Arriving by ${d.toLocaleDateString()}`;
        }
        return "Calculated upon shipping";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-300">
            <div className="bg-white dark:bg-slate-900 w-full max-w-7xl h-[90vh] rounded-2xl shadow-2xl flex overflow-hidden border border-slate-200 dark:border-slate-800">
                {/* Left Panel */}
                <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-slate-50 dark:bg-slate-950/50">
                    {/* Header with Actions */}
                    <div className="flex items-center justify-between mb-6 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                Order #{order.id.slice(0, 8)}
                                <StatusBadge status={order.status} />
                            </h2>
                            <div className="flex gap-4 mt-1 text-xs text-slate-500 font-medium">
                                <span>Customer: {initialOrder.customer || 'Customer'}</span>
                                <span>•</span>
                                <span>Est: <span className="text-primary font-bold">{getEstimatedDelivery()}</span></span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {/* Strict Forward Flow Buttons */}
                            {order.status === 'Pending' && <PrimaryButton icon="inventory_2" label="Process Order" onClick={() => initiateStatusUpdate('Processing')} />}
                            {order.status === 'Processing' && <PrimaryButton icon="local_shipping" label="Ship Order" onClick={() => initiateStatusUpdate('Shipped')} />}
                            {order.status === 'Shipped' && <PrimaryButton icon="directions_bike" label="Out for Delivery" onClick={() => initiateStatusUpdate('Out for Delivery')} />}
                            {order.status === 'Out for Delivery' && <PrimaryButton icon="check_circle" label="Mark Delivered" onClick={() => initiateStatusUpdate('Delivered')} />}
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-colors"><span className="material-icons">close</span></button>
                        </div>
                    </div>

                    {/* Advanced Map (Visual Only) */}
                    <div className="relative h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden border mb-6 shadow-inner group">
                        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 opacity-60" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                        <div className="absolute top-4 left-4 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 border"> <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div> <span className="text-xs font-bold text-slate-700 dark:text-slate-300">LIVE GPS</span> </div>
                        <div className="absolute transition-all duration-[3000ms] ease-linear flex flex-col items-center z-10" style={{ top: '50%', left: '50%', transform: `translate(${(driverLocation.lng - 78.4867) * 8000}px, ${(driverLocation.lat - 17.3850) * 8000}px)` }}>
                            <div className="relative"> <div className="w-16 h-16 bg-blue-500/20 rounded-full animate-ping absolute -inset-2"></div> <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-xl border-4 border-blue-500 text-blue-500 z-10 relative"> <span className="material-icons">local_shipping</span> </div> </div>
                            {currentDriver && <div className="mt-2 text-xs font-bold bg-white/90 px-2 py-1 rounded shadow text-slate-800">{currentDriver.name}</div>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Timeline */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 text-lg"> <span className="material-icons text-slate-400">history</span> Order Timeline </h3>
                            <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-3 space-y-8">
                                {logs.length > 0 ? logs.map((log) => (<TimelineLog key={log.id} log={log} />)) : (<p className="pl-6 text-sm text-slate-400">No history.</p>)}
                            </div>
                        </div>

                        {/* Driver & Shipment */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2"> <span className="material-icons text-slate-400">two_wheeler</span> Delivery Partner </h3>
                                {currentDriver ? (
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-2xl">👷</div>
                                        <div> <p className="font-bold text-slate-900 dark:text-white text-lg">{currentDriver.name}</p> <p className="text-sm text-slate-500">{currentDriver.phone} • <span className="text-green-500 font-bold">Online</span></p> </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed text-slate-500">
                                        <p className="mb-4 text-sm">No driver.</p>
                                        {!assigning ? <button onClick={() => setAssigning(true)} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold">Assign</button> :
                                            <div className="px-4 space-y-2 max-h-40 overflow-y-auto">{availableDrivers.map(d => <div key={d.id} onClick={() => handleAssignDriver(d.id)} className="p-2 bg-white border rounded cursor-pointer hover:border-primary text-sm font-medium">{d.name}</div>)}</div>}
                                    </div>
                                )}
                            </div>
                            {order.tracking_number && (
                                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Shipment Details</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div> <p className="text-slate-500 text-xs">Courier</p> <p className="font-medium">{order.courier_partner}</p> </div>
                                        <div> <p className="text-slate-500 text-xs">Tracking #</p> <p className="font-medium font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded w-fit">{order.tracking_number}</p> </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Chat */}
                <div className="w-96 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
                    <div className="p-4 border-b font-bold flex items-center justify-between"> <h3 className="text-sm font-bold">Support Chat</h3> <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase">Active</span> </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950/50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex flex-col ${msg.sender_role === 'admin' ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${msg.sender_role === 'admin' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 border rounded-bl-none'}`}>{msg.content}</div>
                                <span className="text-[10px] text-slate-400 mt-1">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 border-t bg-white dark:bg-slate-900">
                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2">
                            <input className="bg-transparent flex-1 text-sm focus:outline-none" placeholder="Type..." value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} />
                            <button onClick={handleSendMessage} className="text-blue-600 font-medium text-sm">Send</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl border">
                        <h3 className="text-lg font-bold mb-4">Update to <span className="text-primary">{targetStatus}</span></h3>
                        <div className="space-y-4">
                            {targetStatus === 'Shipped' && (
                                <>
                                    <div> <label className="text-xs font-bold text-slate-500 uppercase px-1">Courier Partner</label> <input type="text" className="w-full bg-slate-50 border rounded-lg px-4 py-2 text-sm" placeholder="e.g. Dunzo" value={courierName} onChange={e => setCourierName(e.target.value)} /> </div>
                                    <div> <label className="text-xs font-bold text-slate-500 uppercase px-1">Tracking Number</label> <input type="text" className="w-full bg-slate-50 border rounded-lg px-4 py-2 text-sm" placeholder="e.g. DZ12345" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} /> </div>
                                </>
                            )}
                            {targetStatus === 'Delivered' && order.delivery_otp && (
                                <div> <label className="text-xs font-bold text-slate-500 uppercase px-1">OTP</label> <input type="text" className="w-full bg-slate-50 border rounded-lg px-4 py-2 text-sm text-center tracking-widest" placeholder="XXXX" value={otpInput} onChange={e => setOtpInput(e.target.value)} /> </div>
                            )}
                            <div> <label className="text-xs font-bold text-slate-500 uppercase px-1">Note</label> <textarea className="w-full bg-slate-50 border rounded-lg px-4 py-2 text-sm h-24 resize-none" value={updateNote} onChange={e => setUpdateNote(e.target.value)}></textarea> </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setShowStatusModal(false)} className="flex-1 py-2.5 rounded-xl border font-bold text-sm">Cancel</button>
                            <button onClick={confirmStatusUpdate} className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-lg">Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const color = status === 'Delivered' ? 'bg-green-100 text-green-700' : status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700';
    return <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${color}`}>{status}</span>;
}

function PrimaryButton({ icon, label, onClick }: { icon: string, label: string, onClick: () => void }) {
    return <button onClick={onClick} className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"><span className="material-icons text-sm">{icon}</span>{label}</button>;
}

function TimelineLog({ log }: { log: any }) {
    return (
        <div className="relative pl-8 group">
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-slate-200 border-2 border-white group-hover:bg-primary transition-all"></div>
            <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{log.status}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{new Date(log.created_at).toLocaleString()}</p>
                {log.note && <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded border italic">"{log.note}"</p>}
            </div>
        </div>
    );
}
