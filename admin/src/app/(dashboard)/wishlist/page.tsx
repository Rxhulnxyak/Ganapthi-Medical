"use client";

import Link from "next/link";
import { useState } from "react";

import AdminHeader from "../../../components/AdminHeader";

export default function Watchlist() {
    // Admin Watchlist = Usually Low Stock items to reorder
    const [items] = useState([
        { id: 1, name: "Paracetamol 500mg", stock: 12, threshold: 50, supplier: "PharmaDist Ltd" },
        { id: 2, name: "Amoxicillin 250mg", stock: 5, threshold: 20, supplier: "MediSource" },
        { id: 3, name: "Vitamin C Tablets", stock: 0, threshold: 100, supplier: "HealthCare Inc" },
    ]);

    return (
        <>
            <AdminHeader title="Low Stock Watchlist" />
            <div className="p-8 max-w-6xl mx-auto min-h-screen">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Watchlist</h1>
                        <p className="text-slate-500 dark:text-slate-400">Items flagged for reordering or needing attention.</p>
                    </div>
                    <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                        <span className="material-icons text-sm">add</span>
                        Add to Watchlist
                    </button>
                </div>

                <div className="overflow-hidden bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4">Item Name</th>
                                <th className="px-6 py-4">Current Stock</th>
                                <th className="px-6 py-4">Reorder Level</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            <span className="material-icons text-sm">medication</span>
                                        </div>
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-red-500">{item.stock}</td>
                                    <td className="px-6 py-4 text-slate-400">{item.threshold}</td>
                                    <td className="px-6 py-4">
                                        {item.stock === 0 ? (
                                            <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold border border-red-200">Out of Stock</span>
                                        ) : item.stock < item.threshold ? (
                                            <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold border border-orange-200">Low Stock</span>
                                        ) : (
                                            <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold border border-green-200">Okay</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-primary hover:underline font-semibold mr-4">Order Now</button>
                                        <button className="text-slate-400 hover:text-red-500 transition-colors">
                                            <span className="material-icons text-sm">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8">
                    <Link href="/profile" className="flex items-center text-sm text-slate-500 hover:text-primary transition-colors gap-1">
                        <span className="material-icons text-sm">arrow_back</span>
                        Back to Profile
                    </Link>
                </div>
            </div>
        </>
    );
}
