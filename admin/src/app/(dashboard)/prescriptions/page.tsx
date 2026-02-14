
"use client";

import { useEffect, useState } from "react";
import AdminHeader from "../../../components/AdminHeader";

interface Prescription {
    id: string;
    user_id: string;
    image_url: string;
    status: string;
    created_at: string;
    profiles?: {
        name: string;
        email: string;
    } | null;
}

export default function PrescriptionsPage() {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const fetchPrescriptions = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/prescriptions`);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setPrescriptions(data);
                } else {
                    console.error("API returned non-array data:", data);
                    setPrescriptions([]);
                }
            } else {
                console.error("Failed to fetch prescriptions:", res.statusText);
            }
        } catch (error) {
            console.error("Failed to fetch prescriptions", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/prescriptions/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Optimistic update
                setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
            } else {
                console.error("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status", error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "approved": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500 border-green-200 dark:border-green-800";
            case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 border-yellow-200 dark:border-yellow-800";
            case "rejected": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500 border-red-200 dark:border-red-800";
            default: return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700";
        }
    };

    return (
        <>
            <AdminHeader title="Prescriptions" />
            <main className="p-8 pb-32">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl h-80 animate-pulse"></div>
                        ))}
                    </div>
                ) : prescriptions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <span className="material-icons text-6xl mb-4">description_off</span>
                        <p>No prescriptions found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {prescriptions.map((item) => (
                            <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                                {/* Image Section */}
                                <div
                                    className="h-56 bg-slate-100 dark:bg-slate-900 relative cursor-pointer overflow-hidden"
                                    onClick={() => setSelectedImage(item.image_url)}
                                >
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt="Prescription"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                console.error("Error loading image:", item.image_url);
                                                e.currentTarget.src = "https://via.placeholder.com/400?text=Error+Loading+Image";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-icons text-4xl text-slate-300">image_not_supported</span>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <span className="bg-white/90 text-slate-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-sm">View</span>
                                    </div>
                                </div>

                                {/* Details Section */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                                                {item.profiles?.name || (item.user_id === 'guest-user' ? 'Guest User' : 'Unknown User')}
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                <span className="material-icons text-[10px]">event</span>
                                                {new Date(item.created_at).toLocaleDateString()}
                                                <span className="mx-1">•</span>
                                                {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </div>

                                    {/* Contact Info (if available) */}
                                    {item.profiles?.email && (
                                        <div className="mb-4 text-xs text-slate-500 bg-slate-50 dark:bg-slate-700/30 p-2 rounded-lg truncate">
                                            <span className="font-semibold block mb-0.5 text-slate-700 dark:text-slate-300">Contact:</span>
                                            {item.profiles.email}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                                        <button
                                            onClick={() => handleStatusUpdate(item.id, 'Rejected')}
                                            disabled={item.status === 'Rejected'}
                                            className="px-4 py-2 bg-slate-50 dark:bg-slate-700/50 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(item.id, 'Approved')}
                                            disabled={item.status === 'Approved'}
                                            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-sm shadow-primary/30 transition-colors disabled:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {item.status === 'Approved' ? 'Approved' : 'Approve'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
                    <div className="relative max-w-4xl w-full max-h-[90vh] bg-transparent rounded-2xl overflow-hidden shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center z-50 backdrop-blur-md transition-colors"
                        >
                            <span className="material-icons">close</span>
                        </button>
                        <img src={selectedImage} alt="Full Prescription" className="w-full h-full object-contain max-h-[85vh] rounded-lg" />
                    </div>
                </div>
            )}
        </>
    );
}
