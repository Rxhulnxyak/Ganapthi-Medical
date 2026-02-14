
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path ? "text-primary" : "text-slate-400 dark:text-slate-500";
    };

    return (
        <nav className="fixed bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 px-6 py-4 flex justify-between items-center z-50">
            <Link href="/" className={`flex flex-col items-center gap-1 transition-all duration-300 ${pathname === "/" ? "text-primary scale-110" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}>
                <span className="material-icons">{pathname === "/" ? "home" : "home"}</span>
            </Link>
            <Link href="/store" className={`flex flex-col items-center gap-1 transition-all duration-300 ${pathname === "/store" ? "text-primary scale-110" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}>
                <span className="material-icons">{pathname === "/store" ? "storefront" : "storefront"}</span>
            </Link>

            {/* Floating Action Button for Cart/Upload */}
            <div className="relative -top-8">
                <Link href="/upload" className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/40 hover:scale-105 transition-transform">
                    <span className="material-icons text-2xl">add_a_photo</span>
                </Link>
            </div>

            <Link href="/orders" className={`flex flex-col items-center gap-1 transition-all duration-300 ${pathname === "/orders" ? "text-primary scale-110" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}>
                <span className="material-icons">{pathname === "/orders" ? "receipt_long" : "receipt_long"}</span>
            </Link>
            <Link href="/profile" className={`flex flex-col items-center gap-1 transition-all duration-300 ${pathname === "/profile" ? "text-primary scale-110" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}>
                <span className="material-icons">{pathname === "/profile" ? "person" : "person_outline"}</span>
            </Link>
        </nav>
    );
}
