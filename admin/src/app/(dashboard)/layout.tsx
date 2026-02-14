"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Sidebar from "../../components/Sidebar";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        // Single auth check - no listener for better performance
        const checkAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (!mounted) return;

                if (session?.user?.user_metadata?.role === "admin") {
                    setLoading(false);
                } else {
                    // Not admin or not logged in
                    if (session) {
                        await supabase.auth.signOut();
                    }
                    router.replace("/login");
                }
            } catch (error) {
                console.error("Auth check failed:", error);
                if (mounted) {
                    router.replace("/login");
                }
            }
        };

        checkAuth();

        // Cleanup
        return () => {
            mounted = false;
        };
    }, [router]); // Only re-run if router changes (never)

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-slate-500">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 font-display text-slate-800 dark:text-slate-100">
            <Sidebar />
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                {children}
            </div>
        </div>
    );
}
