"use client";

import Link from "next/link";

import AdminHeader from "../../../components/AdminHeader";

export default function AdminSupport() {
    return (
        <>
            <AdminHeader title="Help & Support" />
            <div className="p-8 max-w-4xl mx-auto min-h-screen">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        {/* <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Help & Support</h1> */}
                        <p className="text-slate-500 dark:text-slate-400">Get assistance for your admin panel issues.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Contact Card */}
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center mb-2">
                            <span className="material-icons text-3xl">headset_mic</span>
                        </div>
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white">Contact Super Admin</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
                            Need urgent help? Reach out to the technical team directly for platform issues.
                        </p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30">
                            Create Ticket
                        </button>
                        <p className="text-xs text-slate-400">Response time: ~2 hours</p>
                    </div>

                    {/* Docs Card */}
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 text-purple-600 rounded-full flex items-center justify-center mb-2">
                            <span className="material-icons text-3xl">menu_book</span>
                        </div>
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white">Documentation</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
                            Learn how to manage orders, update inventory, and handle user requests.
                        </p>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white w-full py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-500/30">
                            View Guides
                        </button>
                        <p className="text-xs text-slate-400">Version 1.2.0 Docs</p>
                    </div>

                </div>

                <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/30 flex items-start gap-3">
                    <span className="material-icons text-yellow-600 dark:text-yellow-500 mt-1">lightbulb</span>
                    <div>
                        <h4 className="font-bold text-yellow-800 dark:text-yellow-100 text-sm">Pro Tip</h4>
                        <p className="text-yellow-700 dark:text-yellow-200/80 text-xs mt-1">
                            Most issues can be resolved by clearing your cache or refreshing the dashboard. Try that first!
                        </p>
                    </div>
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
