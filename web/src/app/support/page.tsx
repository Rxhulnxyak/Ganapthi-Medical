"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import BottomNav from "../../components/BottomNav";

interface Ticket {
    id: string;
    subject: string;
    description: string;
    status: 'open' | 'in_progress' | 'closed';
    priority: string;
    created_at: string;
}

export default function SupportPage() {
    const router = useRouter();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newTicket, setNewTicket] = useState({ subject: "", description: "", priority: "normal" });

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return router.push('/login');

        const { data } = await supabase
            .from('support_tickets')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (data) setTickets(data as any);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from('support_tickets').insert([{
            user_id: user.id,
            ...newTicket,
            status: 'open'
        }]);

        if (!error) {
            setShowForm(false);
            setNewTicket({ subject: "", description: "", priority: "normal" });
            fetchTickets();
            alert("Ticket Raised Successfully!");
        } else {
            alert("Failed to raise ticket.");
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-32 font-display">
            <header className="fixed top-0 inset-x-0 bg-white z-50 px-4 py-3 shadow-sm border-b border-slate-100 flex items-center gap-3">
                <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-slate-50 text-slate-600">
                    <span className="material-icons">arrow_back</span>
                </button>
                <h1 className="font-bold text-lg text-slate-800">Help & Support</h1>
            </header>

            <main className="pt-20 px-4 space-y-6">
                {/* FAQ Section */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                    <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                        <span className="material-icons text-sm">help</span> Common Questions
                    </h3>
                    <div className="space-y-2 text-sm text-blue-800/80">
                        <details className="cursor-pointer group">
                            <summary className="font-semibold list-none flex justify-between items-center bg-white/50 p-2 rounded-lg hover:bg-white transition-colors">How do I track my order? <span className="material-icons text-xs group-open:rotate-180 transition-transform">expand_more</span></summary>
                            <p className="p-2 text-xs">Go to Orders tab and select current order to view live status.</p>
                        </details>
                        <details className="cursor-pointer group">
                            <summary className="font-semibold list-none flex justify-between items-center bg-white/50 p-2 rounded-lg hover:bg-white transition-colors">Can I return medicines? <span className="material-icons text-xs group-open:rotate-180 transition-transform">expand_more</span></summary>
                            <p className="p-2 text-xs">Yes, within 7 days of delivery if unopened.</p>
                        </details>
                    </div>
                </div>

                {/* Tickets Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-slate-800 text-lg">My Tickets</h2>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="text-primary text-sm font-bold bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                        >
                            {showForm ? 'Cancel' : '+ New Ticket'}
                        </button>
                    </div>

                    {showForm && (
                        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 mb-6 animate-in slide-in-from-top-4">
                            <div className="space-y-3">
                                <input
                                    required
                                    placeholder="Subject (e.g. Delivery Issue)"
                                    value={newTicket.subject}
                                    onChange={e => setNewTicket({ ...newTicket, subject: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
                                />
                                <textarea
                                    required
                                    placeholder="Describe your issue in detail..."
                                    rows={4}
                                    value={newTicket.description}
                                    onChange={e => setNewTicket({ ...newTicket, description: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 resize-none"
                                />
                                <select
                                    value={newTicket.priority}
                                    onChange={e => setNewTicket({ ...newTicket, priority: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                >
                                    <option value="normal">Normal Priority</option>
                                    <option value="high">High Priority</option>
                                    <option value="critical">Critical (Emergency)</option>
                                </select>
                                <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                                    Submit Ticket
                                </button>
                            </div>
                        </form>
                    )}

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2].map(i => <div key={i} className="h-24 bg-slate-200 rounded-2xl animate-pulse"></div>)}
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
                            <span className="material-icons text-slate-300 text-4xl mb-2">support_agent</span>
                            <p className="text-slate-500 font-medium">No active tickets.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {tickets.map(ticket => (
                                <div key={ticket.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${ticket.status === 'open' ? 'bg-green-100 text-green-700' :
                                                ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                        <span className="text-xs text-slate-400">{new Date(ticket.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-1">{ticket.subject}</h3>
                                    <p className="text-sm text-slate-500 line-clamp-2">{ticket.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
