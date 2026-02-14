"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import BottomNav from "../../components/BottomNav";

interface Transaction {
    id: string;
    amount: number;
    type: 'credit' | 'debit';
    status: string;
    description: string;
    created_at: string;
}

export default function WalletPage() {
    const router = useRouter();
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [amountToAdd, setAmountToAdd] = useState("");

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return router.push('/login');

        // Fetch Wallet
        let { data: wallet, error } = await supabase.from('wallet').select('*').eq('user_id', user.id).single();

        if (!wallet && !error) {
            // Create wallet if not exists
            const { data: newWallet } = await supabase.from('wallet').insert([{ user_id: user.id, balance: 0 }]).select().single();
            wallet = newWallet;
        }

        if (wallet) {
            setBalance(wallet.balance);
            // Fetch Transactions
            const { data: txs } = await supabase
                .from('transactions')
                .select('*')
                .eq('wallet_id', wallet.id)
                .order('created_at', { ascending: false });
            if (txs) setTransactions(txs);
        }
        setLoading(false);
    };

    const handleAddMoney = async () => {
        const amount = parseFloat(amountToAdd);
        if (isNaN(amount) || amount <= 0) return alert("Invalid Amount");

        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Get Wallet ID
        const { data: wallet } = await supabase.from('wallet').select('id, balance').eq('user_id', user.id).single();
        if (!wallet) return;

        // 2. Add Transaction
        // NOTE: In production, verify payment via server/edge function. Here we simulate.
        const { error: txError } = await supabase.from('transactions').insert([{
            wallet_id: wallet.id,
            amount: amount,
            type: 'credit',
            status: 'success',
            description: 'Top-up via UPI'
        }]);

        if (!txError) {
            // 3. Update Balance (ideally via trigger/RPC to avoid race conditions)
            await supabase.from('wallet').update({ balance: wallet.balance + amount }).eq('id', wallet.id);
            setAmountToAdd("");
            fetchWalletData();
            alert("Money Added Successfully!");
        } else {
            alert("Transaction Failed");
        }
        setLoading(false);
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-32 font-display">
            <header className="fixed top-0 inset-x-0 bg-slate-900 z-50 px-4 py-4 text-white shadow-sm flex items-center gap-3">
                <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
                    <span className="material-icons">arrow_back</span>
                </button>
                <h1 className="font-bold text-lg">My Wallet</h1>
            </header>

            <main className="pt-24 px-4 space-y-6">
                {loading ? (
                    <div className="h-48 bg-slate-200 rounded-3xl animate-pulse"></div>
                ) : (
                    <>
                        {/* Balance Card */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-slate-400 text-sm font-medium mb-1">Total Balance</p>
                                <h2 className="text-4xl font-bold tracking-tight mb-6">₹{balance.toFixed(2)}</h2>
                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <div className="relative group">
                                            <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-white transition-colors">currency_rupee</span>
                                            <input
                                                type="number"
                                                placeholder="Amount"
                                                value={amountToAdd}
                                                onChange={e => setAmountToAdd(e.target.value)}
                                                className="w-full bg-white/10 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm font-bold placeholder:text-slate-500 focus:outline-none focus:bg-white/20 transition-all text-white"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleAddMoney}
                                        className="bg-green-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-green-500/30 hover:bg-green-400 transition-colors active:scale-95"
                                    >
                                        + Add
                                    </button>
                                </div>
                            </div>
                            {/* Decorative */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
                        </div>

                        {/* Recent Transactions */}
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg mb-4">Recent Transactions</h3>
                            {transactions.length === 0 ? (
                                <p className="text-center text-slate-400 py-10 bg-white rounded-3xl border border-slate-100">No transactions yet.</p>
                            ) : (
                                <div className="bg-white rounded-3xl border border-slate-100 p-2 shadow-sm">
                                    {transactions.map(tx => (
                                        <div key={tx.id} className="flex justify-between items-center p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded-2xl transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                    <span className="material-icons">{tx.type === 'credit' ? 'south_west' : 'north_east'}</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{tx.description}</p>
                                                    <p className="text-xs text-slate-400">{new Date(tx.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </div>
                                            <p className={`font-bold text-sm ${tx.type === 'credit' ? 'text-green-600' : 'text-slate-900'}`}>
                                                {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
            <BottomNav />
        </div>
    );
}
