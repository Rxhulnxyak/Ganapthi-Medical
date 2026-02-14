"use client";

import Link from "next/link";
import { useState } from "react";

import AdminHeader from "../../../../components/AdminHeader";

export default function AdminWallet() {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <>
            <AdminHeader title="Wallet & Payouts" />
            <div className="p-8 max-w-4xl mx-auto space-y-8">

                {/* Overview Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

                    <div className="relative z-10">
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Total Earnings (This Month)</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold tracking-tight">₹ 45,892.00</span>
                            <span className="text-green-500 bg-green-500/20 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                <span className="material-icons text-xs">arrow_upward</span> 12.5%
                            </span>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
                                <span className="material-icons text-sm">account_balance</span>
                                Withdraw
                            </button>
                            <button className="bg-primary hover:bg-primary/90 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/30 flex items-center gap-2">
                                <span className="material-icons text-sm">history</span>
                                Transactions
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 dark:border-slate-800">
                    <TabButton id="overview" label="Overview" active={activeTab} onClick={setActiveTab} />
                    <TabButton id="payouts" label="Payout Settings" active={activeTab} onClick={setActiveTab} />
                    <TabButton id="invoices" label="Invoices" active={activeTab} onClick={setActiveTab} />
                </div>

                {/* Linked Accounts */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                        Linked Bank Accounts
                        <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full uppercase">Verified</span>
                    </h3>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between group hover:border-primary/20 transition-all shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                                <span className="material-icons text-slate-500">account_balance</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">HDFC Bank Ltd</h4>
                                <p className="text-sm text-slate-500">**** **** **** 8892</p>
                            </div>
                        </div>
                        <button className="text-slate-400 hover:text-red-500 transition-colors">
                            <span className="material-icons">delete</span>
                        </button>
                    </div>

                    <button className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 py-4 rounded-2xl text-slate-500 text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-primary hover:border-primary transition-all">
                        <span className="material-icons text-sm">add</span>
                        Link New Account / UPI
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

function TabButton({ id, label, active, onClick }: { id: string, label: string, active: string, onClick: (id: string) => void }) {
    return (
        <button
            onClick={() => onClick(id)}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${active === id ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
        >
            {label}
        </button>
    );
}
