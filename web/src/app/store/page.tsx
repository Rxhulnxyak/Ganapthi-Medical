"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import BottomNav from "../../components/BottomNav";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";

interface Medicine {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    requires_prescription: boolean;
    image_url?: string;
    description?: string;
}

// Debounce helper
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function StorePage() {
    const router = useRouter();
    const categories = ["All", "Tablets", "Syrups", "Devices", "Vitamins", "First Aid", "Skin Care", "Baby Care"];

    // State
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [userName, setUserName] = useState("Guest");
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const debouncedSearch = useDebounce(searchQuery, 500);
    const PAGE_SIZE = 12;

    const { addToCart, cartCount } = useCart();

    // Fetch User
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserName(user.user_metadata?.name || user.email?.split('@')[0] || "User");
                if (user.user_metadata?.avatar_url) setProfilePic(user.user_metadata.avatar_url);
            }
        };
        getUser();
    }, []);

    const [error, setError] = useState<string | null>(null);

    // Fetch Medicines logic
    const fetchMedicines = useCallback(async (isLoadMore = false) => {
        if (!isLoadMore) {
            setLoading(true);
            setError(null);
        }

        try {
            let query = supabase
                .from('medicines')
                .select('id, name, category, price, stock, requires_prescription, image_url')
                .range(isLoadMore ? offset : 0, isLoadMore ? offset + PAGE_SIZE - 1 : PAGE_SIZE - 1);

            if (selectedCategory !== "All") {
                query = query.eq('category', selectedCategory);
            }

            if (debouncedSearch) {
                query = query.ilike('name', `%${debouncedSearch}%`);
            }

            const { data, error: dbError } = await query;

            if (dbError) throw dbError;

            if (data) {
                if (isLoadMore) {
                    setMedicines(prev => [...prev, ...data]);
                } else {
                    setMedicines(data);
                }
                setHasMore(data.length === PAGE_SIZE);
                setOffset(prev => isLoadMore ? prev + PAGE_SIZE : PAGE_SIZE);
            }
        } catch (err: any) {
            console.error("Error fetching medicines:", err);
            setError(err.message || "Failed to load medicines. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [selectedCategory, debouncedSearch, offset]);

    // Initial Load & Category/Search Change
    useEffect(() => {
        setOffset(0); // Reset offset on filter change
        fetchMedicines(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory, debouncedSearch]);

    const handleAddToCart = (e: React.MouseEvent, med: Medicine) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent navigation
        addToCart({
            id: med.id,
            name: med.name,
            price: Number(med.price),
            quantity: 1,
            image_url: med.image_url
        });

        // Optional: Show toast or feedback
    };

    return (
        <div className="bg-gray-50 dark:bg-slate-900 min-h-screen pb-32 font-sans selection:bg-blue-100 dark:selection:bg-blue-900">
            {/* Header Section - Sticky & Glassmorphism */}
            <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-6 pt-8 pb-4 border-b border-slate-200 dark:border-slate-800 transition-all">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Location</span>
                        <div className="flex items-center gap-1 text-slate-800 dark:text-white font-bold cursor-pointer hover:text-blue-600 transition-colors">
                            <span className="material-icons text-blue-600 text-lg">location_on</span>
                            <span>Bangalore, IN</span>
                            <span className="material-icons text-sm opacity-50">expand_more</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/cart" className="relative p-2.5 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-200 active:scale-95 group">
                            <span className="material-icons text-[20px] group-hover:text-blue-600 transition-colors">shopping_bag</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm animate-bounce">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <Link href="/profile" className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 p-0.5 shadow-md active:scale-95 transition-transform">
                            {profilePic ? (
                                <img src={profilePic} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-white" />
                            ) : (
                                <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-blue-600 font-bold">
                                    {userName.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Powerful Search Bar */}
                <div className="relative group">
                    <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300">search</span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for medicines, brands..."
                        className="w-full bg-slate-100 dark:bg-slate-900/50 border border-transparent dark:border-slate-700 rounded-2xl py-3.5 pl-12 pr-12 text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none shadow-inner group-hover:shadow-md"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600">
                            <span className="material-icons text-sm">close</span>
                        </button>
                    )}
                </div>
            </header>

            <div className="px-6 space-y-8 mt-6">
                {/* Categories - Horizontal Scroll */}
                <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar -mx-6 px-6 snap-x">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`flex-shrink-0 snap-start px-4 py-2 rounded-full text-sm font-bold transition-all border ${selectedCategory === cat
                                ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Main Grid */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                            {debouncedSearch ? `Search: "${debouncedSearch}"` : `${selectedCategory} Medicines`}
                            {loading && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pb-20">
                        {error && !loading ? (
                            <div className="col-span-full py-16 flex flex-col items-center justify-center text-red-500 text-center bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20">
                                <span className="material-icons text-5xl mb-2">error_outline</span>
                                <h3 className="font-bold text-lg mb-1">Oops! Something went wrong</h3>
                                <p className="text-sm mb-4 px-4">{error}</p>
                                <button onClick={() => fetchMedicines(false)} className="bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-sm hover:bg-red-700 transition-colors">
                                    Try Again
                                </button>
                            </div>
                        ) : loading && medicines.length === 0 ? (
                            // Skeleton Grid
                            [...Array(6)].map((_, i) => (
                                <div key={i} className="bg-white dark:bg-slate-800 rounded-3xl h-64 p-4 shadow-sm border border-slate-100 dark:border-slate-700 animate-pulse flex flex-col">
                                    <div className="bg-slate-100 dark:bg-slate-700 h-32 w-full rounded-2xl mb-4"></div>
                                    <div className="bg-slate-100 dark:bg-slate-700 h-4 w-3/4 rounded mb-2"></div>
                                    <div className="bg-slate-100 dark:bg-slate-700 h-4 w-1/2 rounded mb-auto"></div>
                                    <div className="flex justify-between mt-4">
                                        <div className="bg-slate-100 dark:bg-slate-700 h-6 w-16 rounded"></div>
                                        <div className="bg-slate-100 dark:bg-slate-700 h-8 w-8 rounded-full"></div>
                                    </div>
                                </div>
                            ))
                        ) : medicines.length === 0 ? (
                            <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 text-center">
                                <span className="material-icons text-6xl mb-4 text-slate-200 dark:text-slate-700">medication_liquid</span>
                                <h3 className="text-slate-600 font-bold text-lg">No medicines found</h3>
                                <p className="text-sm">Try adjusting your search or filters.</p>
                                <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }} className="mt-4 text-blue-600 font-bold text-sm hover:underline">Clear Filters</button>
                            </div>
                        ) : (
                            medicines.map((med) => (
                                <div onClick={() => router.push(`/medicine/${med.id}`)} key={med.id} className="group bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden cursor-pointer h-full flex flex-col">

                                    {/* Image Area */}
                                    <div className="relative h-32 mb-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500 overflow-hidden">
                                        {med.image_url ? (
                                            <img src={med.image_url} alt={med.name} className="h-full w-full object-contain p-4 mix-blend-multiply dark:mix-blend-normal" loading="lazy" />
                                        ) : (
                                            <span className="material-icons text-5xl text-slate-200 dark:text-slate-700 group-hover:text-blue-200 transition-colors">medication</span>
                                        )}
                                        {med.requires_prescription && (
                                            <div className="absolute top-2 left-2 bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                                                <span className="material-icons text-[10px]">prescription</span> RX
                                            </div>
                                        )}
                                        {med.stock < 5 && med.stock > 0 && (
                                            <div className="absolute bottom-2 left-2 bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                                Only {med.stock} left
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col">
                                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-1 opacity-80">{med.category}</p>
                                        <h4 className="font-bold text-slate-800 dark:text-white text-sm leading-tight mb-1 line-clamp-2 min-h-[2.5em] group-hover:text-blue-600 transition-colors">{med.name}</h4>

                                        <div className="flex items-center gap-1 mb-3">
                                            <div className="flex text-amber-400 text-[10px]">
                                                <span className="material-icons text-[12px]">star</span>
                                                <span className="material-icons text-[12px]">star</span>
                                                <span className="material-icons text-[12px]">star</span>
                                                <span className="material-icons text-[12px]">star</span>
                                            </div>
                                            <span className="text-[10px] text-slate-400">(4.5)</span>
                                        </div>

                                        <div className="mt-auto flex items-end justify-between">
                                            <div>
                                                <p className="text-[10px] text-slate-400 line-through decoration-slate-300">₹{Number(med.price) + Math.floor(Number(med.price) * 0.2)}</p>
                                                <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">₹{med.price}</p>
                                            </div>
                                            <button
                                                onClick={(e) => handleAddToCart(e, med)}
                                                className="w-9 h-9 bg-slate-900 dark:bg-white rounded-xl shadow-lg shadow-slate-900/20 flex items-center justify-center text-white dark:text-slate-900 hover:bg-blue-600 hover:shadow-blue-500/30 transition-all active:scale-90"
                                            >
                                                <span className="material-icons text-sm">add</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Load More Trigger */}
                    {!loading && hasMore && medicines.length > 0 && (
                        <div className="flex justify-center pt-4 pb-8">
                            <button
                                onClick={() => fetchMedicines(true)}
                                className="bg-white border border-slate-200 text-slate-600 px-6 py-2 rounded-full text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
                            >
                                Load More <span className="material-icons text-sm">expand_more</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
