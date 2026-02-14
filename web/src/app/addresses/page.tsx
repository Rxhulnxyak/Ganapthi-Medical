"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import BottomNav from "../../components/BottomNav";

interface Address {
    id: string;
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    tag: string;
    is_default: boolean;
}

export default function AddressesPage() {
    const router = useRouter();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        full_name: "", phone: "", address_line1: "", address_line2: "",
        city: "", state: "", pincode: "", landmark: "", tag: "Home", is_default: false
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return router.push('/login');

        const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .eq('user_id', user.id)
            .order('is_default', { ascending: false }); // Default first

        if (data) setAddresses(data);
        setLoading(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Validation
        if (formData.pincode.length !== 6) return alert("Invalid Pincode");

        const payload = { ...formData, user_id: user.id };

        if (editingId) {
            await supabase.from('addresses').update(payload).eq('id', editingId);
        } else {
            // If first address, make default
            if (addresses.length === 0) payload.is_default = true;
            await supabase.from('addresses').insert([payload]);
        }

        setShowForm(false);
        setEditingId(null);
        setFormData({ full_name: "", phone: "", address_line1: "", address_line2: "", city: "", state: "", pincode: "", landmark: "", tag: "Home", is_default: false });
        fetchAddresses();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this address?")) {
            await supabase.from('addresses').delete().eq('id', id);
            fetchAddresses();
        }
    };

    const handleEdit = (addr: Address) => {
        setFormData({
            full_name: addr.full_name, phone: addr.phone, address_line1: addr.address_line1,
            address_line2: addr.address_line2 || "", city: addr.city, state: addr.state,
            pincode: addr.pincode, landmark: addr.landmark || "", tag: addr.tag, is_default: addr.is_default
        });
        setEditingId(addr.id);
        setShowForm(true);
    };

    const useGPS = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                // Mock Reverse Geocoding
                setFormData(prev => ({
                    ...prev,
                    city: "Hyderabad",
                    state: "Telangana",
                    pincode: "500081",
                    address_line1: `Mapped Location (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`
                }));
            });
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-32 font-display">
            {/* Header */}
            <header className="fixed top-0 inset-x-0 bg-white z-50 px-4 py-3 shadow-sm border-b border-slate-100 flex items-center gap-3">
                <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-slate-50 text-slate-600">
                    <span className="material-icons">arrow_back</span>
                </button>
                <h1 className="font-bold text-lg text-slate-800">Saved Addresses</h1>
            </header>

            <main className="pt-20 px-4">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map(i => <div key={i} className="h-40 bg-slate-200 rounded-xl animate-pulse"></div>)}
                    </div>
                ) : !showForm ? (
                    <>
                        <button
                            onClick={() => setShowForm(true)}
                            className="w-full py-4 border-2 border-dashed border-primary/30 bg-blue-50/50 rounded-xl text-primary font-bold flex items-center justify-center gap-2 mb-6 hover:bg-blue-50 transition-colors"
                        >
                            <span className="material-icons">add_location_alt</span>
                            Add New Address
                        </button>

                        <div className="space-y-4">
                            {addresses.map(addr => (
                                <div key={addr.id} className={`bg-white p-5 rounded-2xl border ${addr.is_default ? 'border-primary shadow-md shadow-blue-500/10' : 'border-slate-100 shadow-sm'} relative group`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${addr.tag === 'Home' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {addr.tag}
                                            </span>
                                            {addr.is_default && <span className="text-xs text-primary font-bold flex items-center gap-1"><span className="material-icons text-[14px]">verified</span> Default</span>}
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(addr)} className="text-slate-400 hover:text-blue-600"><span className="material-icons text-lg">edit</span></button>
                                            <button onClick={() => handleDelete(addr.id)} className="text-slate-400 hover:text-red-600"><span className="material-icons text-lg">delete</span></button>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-slate-800">{addr.full_name}</h3>
                                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                        {addr.address_line1}, {addr.address_line2 && `${addr.address_line2}, `}
                                        {addr.landmark && `Near ${addr.landmark}, `}
                                        {addr.city}, {addr.state} - <b>{addr.pincode}</b>
                                    </p>
                                    <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                                        <span className="material-icons text-[14px]">phone</span> {addr.phone}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold text-lg">{editingId ? 'Edit Address' : 'New Address'}</h2>
                            <button onClick={useGPS} className="text-xs font-bold text-blue-600 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
                                <span className="material-icons text-sm">my_location</span> Use GPS
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input required placeholder="Full Name" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400" />
                                <input required placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400" />
                            </div>
                            <input required placeholder="House No, Building Name" value={formData.address_line1} onChange={e => setFormData({ ...formData, address_line1: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400" />
                            <input placeholder="Area, Colony (Optional)" value={formData.address_line2} onChange={e => setFormData({ ...formData, address_line2: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400" />
                            <div className="grid grid-cols-2 gap-4">
                                <input required placeholder="City" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400" />
                                <input required placeholder="State" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input required placeholder="Pincode (6 digits)" maxLength={6} value={formData.pincode} onChange={e => setFormData({ ...formData, pincode: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400" />
                                <input placeholder="Landmark" value={formData.landmark} onChange={e => setFormData({ ...formData, landmark: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400" />
                            </div>

                            <div className="flex gap-4 pt-2">
                                {['Home', 'Work', 'Other'].map(tag => (
                                    <button type="button" key={tag} onClick={() => setFormData({ ...formData, tag })}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold border ${formData.tag === tag ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}>
                                        {tag}
                                    </button>
                                ))}
                            </div>

                            <label className="flex items-center gap-3 pt-2">
                                <input type="checkbox" checked={formData.is_default} onChange={e => setFormData({ ...formData, is_default: e.target.checked })} className="w-5 h-5 rounded text-primary focus:ring-primary" />
                                <span className="text-sm font-medium text-slate-700">Make this my default address</span>
                            </label>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-blue-500/20">Save Address</button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
            <BottomNav />
        </div>
    );
}
