"use client";

import Link from "next/link";

import AdminHeader from "../../../../components/AdminHeader";

export default function StoreAddresses() {
    return (
        <>
            <AdminHeader title="Store Locations" />
            <div className="p-8 max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        {/* <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Store Locations</h1> */}
                        <p className="text-slate-500 dark:text-slate-400">Manage your physical store addresses for pickups.</p>
                    </div>
                    <button className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors">
                        <span className="material-icons text-sm">add</span>
                        Add New Branch
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Primary Store Card */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border-2 border-primary/20 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-4 right-4 bg-primary text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Primary</div>
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center flex-shrink-0">
                                <span className="material-icons">storefront</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Ganapathi Medical - Main</h3>
                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                    12-3-456/A, Gandhi Nagar,<br />
                                    Opp. City Hospital, Hyderabad,<br />
                                    Telangana - 500080
                                </p>
                                <p className="text-xs text-slate-400 mt-2 font-mono">+91 98765 43210</p>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <button className="flex-1 text-xs font-bold text-primary bg-primary/5 py-2 rounded-lg hover:bg-primary/10 transition-colors">Edit Details</button>
                            <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><span className="material-icons text-sm">delete</span></button>
                        </div>
                    </div>

                    {/* Placeholder for New */}
                    <button className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-primary hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all gap-2 group min-h-[200px]">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                            <span className="material-icons text-2xl group-hover:scale-110 transition-transform">add_location_alt</span>
                        </div>
                        <span className="font-semibold text-sm">Add Branch Location</span>
                    </button>
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
