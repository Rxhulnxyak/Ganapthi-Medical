"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function AdminProfile() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({
        name: "Admin User",
        email: "admin@example.com",
        phone: "",
        avatar_url: "",
        role: "Store Owner"
    });

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser({
                    name: user.user_metadata?.full_name || user.user_metadata?.name || "Admin User",
                    email: user.email || "",
                    phone: user.phone || "",
                    avatar_url: user.user_metadata?.avatar_url || "",
                    role: user.user_metadata?.role === 'admin' ? "Store Admin" : "Staff"
                });
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;

    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen pb-10">
            {/* Header Area */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 h-64 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
            </div>

            <div className="px-8 -mt-20 relative z-10">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 p-8 border border-white/50 dark:border-slate-700 backdrop-blur-sm max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-primary to-purple-600 shadow-lg">
                                <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                                    {user.avatar_url ? (
                                        <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="material-icons text-6xl text-slate-300">person</span>
                                    )}
                                </div>
                            </div>
                            <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                                <span className="material-icons text-sm">edit</span>
                            </button>
                        </div>

                        <div className="text-center md:text-left flex-1">
                            <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{user.name}</h1>
                                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full border border-primary/20">
                                    {user.role}
                                </span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">{user.email}</p>
                            <p className="text-sm text-slate-400 mt-1">{user.phone || "No phone number added"}</p>

                            <div className="flex items-center gap-4 mt-6 justify-center md:justify-start">
                                <button className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold shadow-lg shadow-slate-900/20 hover:scale-105 transition-transform text-sm">
                                    Edit Profile
                                </button>
                                <button onClick={handleLogout} className="px-5 py-2.5 bg-white dark:bg-slate-800 text-red-500 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm flex items-center gap-2">
                                    <span className="material-icons text-sm">logout</span>
                                    Sign Out
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex gap-4 md:border-l md:border-slate-100 dark:md:border-slate-700 md:pl-8">
                            <div className="text-center">
                                <span className="block text-2xl font-bold text-slate-900 dark:text-white">Active</span>
                                <span className="text-xs text-green-500 font-medium">Status</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-2xl font-bold text-slate-900 dark:text-white">High</span>
                                <span className="text-xs text-purple-500 font-medium">Access Level</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 max-w-4xl mx-auto">
                    <FeatureCard
                        title="Addresses"
                        subtitle="Manage Store Locations"
                        icon="store"
                        color="text-orange-500"
                        bg="bg-orange-100 dark:bg-orange-900/20"
                        href="/profile/addresses"
                    />
                    <FeatureCard
                        title="Wallet & Payouts"
                        subtitle="View Earnings & Banks"
                        icon="account_balance_wallet"
                        color="text-green-600"
                        bg="bg-green-100 dark:bg-green-900/20"
                        href="/profile/wallet"
                    />
                    <FeatureCard
                        title="Watchlist"
                        subtitle="Track Critical Items"
                        icon="visibility"
                        color="text-blue-500"
                        bg="bg-blue-100 dark:bg-blue-900/20"
                        href="/wishlist"
                    />
                    <FeatureCard
                        title="Help & Support"
                        subtitle="Contact Super Admin"
                        icon="support_agent"
                        color="text-cyan-500"
                        bg="bg-cyan-100 dark:bg-cyan-900/20"
                        href="/support"
                    />
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ title, subtitle, icon, color, bg, href }: any) {
    return (
        <Link href={href} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md hover:border-primary/30 group transition-all">
            <div className={`w-12 h-12 rounded-xl ${bg} ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <span className="material-icons">{icon}</span>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
        </Link>
    );
}
