
"use client";

import Link from "next/link";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 shadow-sm px-5 pt-6 pb-4">
            <div className="flex items-center justify-between mb-5">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <span className="material-icons text-white">medical_services</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Ganapathi Medical</h1>
                </Link>
                <Link href="/cart" className="relative p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                    <span className="material-icons text-slate-600 dark:text-slate-300">shopping_cart</span>
                    <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-slate-900">2</span>
                </Link>
            </div>
            {/* Search Bar - Large & Accessible */}
            <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center">
                    <span className="material-icons text-slate-400">search</span>
                </span>
                <input
                    type="text"
                    placeholder="Search for medicines..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl py-4 pl-12 pr-4 text-lg focus:outline-none focus:border-primary transition-colors"
                />
            </div>
        </header>
    );
}
