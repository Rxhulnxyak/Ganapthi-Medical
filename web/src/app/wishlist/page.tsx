"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import BottomNav from "../../components/BottomNav";
import { useCart } from "../../context/CartContext";

interface WishlistItem {
    id: string; // Wishlist ID
    medicine: {
        id: string;
        name: string;
        price: number;
        image_url: string;
        stock: number;
    }
}

export default function WishlistPage() {
    const router = useRouter();
    const { addToCart } = useCart();
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return router.push('/login');

        const { data, error } = await supabase
            .from('wishlist')
            .select(`
                id,
                medicine: medicines (
                    id, name, price, image_url, stock
                )
            `)
            .eq('user_id', user.id);

        if (data) {
            // Filter out null medicines if relation broken
            setWishlist(data.filter(w => w.medicine) as any);
        }
        setLoading(false);
    };

    const handleRemove = async (id: string) => {
        setWishlist(prev => prev.filter(w => w.id !== id));
        await supabase.from('wishlist').delete().eq('id', id);
    };

    const handleMoveToCart = async (item: WishlistItem) => {
        addToCart({
            id: item.medicine.id,
            name: item.medicine.name,
            price: item.medicine.price,
            image_url: item.medicine.image_url,
            quantity: 1
        });
        await handleRemove(item.id);
        // Show notification ideally
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-32 font-display">
            <header className="fixed top-0 inset-x-0 bg-white z-50 px-4 py-3 shadow-sm border-b border-slate-100 flex items-center gap-3">
                <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-slate-50 text-slate-600">
                    <span className="material-icons">arrow_back</span>
                </button>
                <h1 className="font-bold text-lg text-slate-800">My Wishlist</h1>
                <span className="ml-auto bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">{wishlist.length} Items</span>
            </header>

            <main className="pt-20 px-4">
                {loading ? (
                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-slate-200 rounded-2xl animate-pulse"></div>)}
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                            <span className="material-icons text-4xl">favorite_border</span>
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">Your Wishlist is Empty</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">Browse the store and save medicines for later purchase.</p>
                        <button onClick={() => router.push('/store')} className="mt-6 bg-primary text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-blue-500/30">
                            Browse Medicines
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {wishlist.map(item => (
                            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative group overflow-hidden">
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="absolute top-2 right-2 p-1.5 bg-slate-50 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors z-10"
                                >
                                    <span className="material-icons text-sm">close</span>
                                </button>

                                <div className="h-32 mb-3 bg-slate-50 rounded-xl flex items-center justify-center p-2">
                                    {item.medicine.image_url ? (
                                        <img src={item.medicine.image_url} alt={item.medicine.name} className="h-full object-contain mix-blend-multiply" loading="lazy" />
                                    ) : (
                                        <span className="material-icons text-4xl text-slate-200">medication</span>
                                    )}
                                </div>

                                <h3 className="font-bold text-slate-800 text-sm truncate">{item.medicine.name}</h3>
                                <p className="text-xs text-slate-500 font-medium mb-3">In Stock: {item.medicine.stock > 0 ? 'Yes' : 'No'}</p>

                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-900">₹{item.medicine.price}</span>
                                    <button
                                        onClick={() => handleMoveToCart(item)}
                                        className="bg-primary/10 text-primary p-2 rounded-xl hover:bg-primary hover:text-white transition-colors"
                                    >
                                        <span className="material-icons text-sm">shopping_cart</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <BottomNav />
        </div>
    );
}
