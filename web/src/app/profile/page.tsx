"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import BottomNav from "../../components/BottomNav";

export default function Profile() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({
        name: "Guest User",
        email: "guest@example.com",
        phone: "",
        avatar_url: "",
    });

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser({
                    name: user.user_metadata?.full_name || user.user_metadata?.name || "User",
                    email: user.email || "",
                    phone: user.phone || "",
                    avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || "",
                });
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login"); // Redirect to login after logout
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 min-h-screen font-display pb-32">

            {/* 1. immersive Header with Gradient */}
            <header className="relative h-64 bg-gradient-to-br from-primary via-primary/80 to-purple-600 overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

                <div className="absolute top-0 left-0 right-0 p-4 pt-8 flex justify-between items-center z-10 text-white">
                    <h1 className="text-xl font-bold tracking-tight">My Profile</h1>
                    <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors">
                        <span className="material-icons text-xl">settings</span>
                    </button>
                </div>
            </header>

            <main className="px-5 -mt-20 relative z-20 space-y-6">

                {/* 2. Glassmorphic Profile Card */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 p-6 flex flex-col items-center text-center border border-white/50 dark:border-slate-700 backdrop-blur-sm relative">
                    <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 text-[10px] font-bold uppercase tracking-wider rounded-full border border-yellow-200 dark:border-yellow-800">Gold Member</span>
                    </div>

                    <div className="relative">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-600 p-1 shadow-lg mb-4">
                            <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden relative">
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="material-icons text-6xl text-slate-300 dark:text-slate-600">person</span>
                                )}
                            </div>
                        </div>
                        <button className="absolute bottom-4 right-0 w-8 h-8 bg-primary text-white rounded-full border-2 border-white dark:border-slate-800 shadow-md flex items-center justify-center hover:scale-110 transition-transform">
                            <span className="material-icons text-sm">edit</span>
                        </button>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{user.email}</p>
                    <p className="text-xs text-slate-400 mt-1">{user.phone}</p>
                </div>

                {/* 3. Dashboard Grid (Stats & Quick Links) */}
                <div className="grid grid-cols-2 gap-4">
                    <Link href="/orders" className="group bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md hover:border-primary/30 transition-all flex flex-col gap-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-xl -mr-4 -mt-4 transition-all group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30"></div>
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center relative z-10">
                            <span className="material-icons">local_mall</span>
                        </div>
                        <div className="relative z-10">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white block">12</span>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Orders</span>
                        </div>
                    </Link>

                    <Link href="/prescriptions" className="group bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md hover:border-purple-500/30 transition-all flex flex-col gap-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 dark:bg-purple-900/20 rounded-full blur-xl -mr-4 -mt-4 transition-all group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30"></div>
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center relative z-10">
                            <span className="material-icons">description</span>
                        </div>
                        <div className="relative z-10">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white block">4</span>
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Prescriptions</span>
                        </div>
                    </Link>
                </div>

                {/* 4. Menu Actions List */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-2 shadow-sm border border-slate-100 dark:border-slate-700">
                    <MenuItem
                        icon="location_on"
                        color="text-orange-500"
                        bg="bg-orange-100 dark:bg-orange-900/20"
                        title="Saved Addresses"
                        subtitle="Home, Office locations"
                        href="/addresses"
                    />
                    <MenuItem
                        icon="account_balance_wallet"
                        color="text-green-600"
                        bg="bg-green-100 dark:bg-green-900/20"
                        title="Wallet & Payments"
                        subtitle="Manage cards, UPI"
                        href="/wallet"
                    />
                    <MenuItem
                        icon="favorite"
                        color="text-red-500"
                        bg="bg-red-100 dark:bg-red-900/20"
                        title="Wishlist"
                        subtitle="Your saved medicines"
                        href="/wishlist"
                    />
                    <MenuItem
                        icon="support_agent"
                        color="text-cyan-500"
                        bg="bg-cyan-100 dark:bg-cyan-900/20"
                        title="Help & Support"
                        subtitle="Chat with us"
                        href="/support"
                    />
                </div>

                {/* 5. Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
                >
                    <span className="material-icons group-hover:-translate-x-1 transition-transform">logout</span>
                    <span className="font-bold">Log Out</span>
                </button>

                <p className="text-center text-xs text-slate-400 pb-4">

                </p>

            </main>

            <BottomNav />
        </div>
    );
}

function MenuItem({ icon, color, bg, title, subtitle, href }: { icon: string, color: string, bg: string, title: string, subtitle: string, href: string }) {
    return (
        <Link href={href || '#'} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
            <div className={`w-12 h-12 rounded-2xl ${bg} ${color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                <span className="material-icons">{icon}</span>
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{subtitle}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-icons text-sm">chevron_right</span>
            </div>
        </Link>
    );
}
