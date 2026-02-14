
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useState } from "react";

export default function Cart() {
    const router = useRouter();
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const [isOrdering, setIsOrdering] = useState(false);

    const handlePlaceOrder = () => {
        router.push('/checkout');
    };

    if (cart.length === 0) {
        return (
            <div className="bg-gray-50 dark:bg-slate-900 font-sans min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
                    <span className="material-icons text-5xl text-blue-300">shopping_cart</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Your Cart is Empty</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs">Looks like you haven't added anything to your cart yet.</p>
                <Link href="/store" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95">Browse Store</Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 antialiased min-h-screen pb-40">
            {/* Header with Steps */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl px-6 pt-12 pb-4 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 transition-colors">
                        <span className="material-icons text-slate-600 dark:text-slate-300">arrow_back</span>
                    </button>
                    <h1 className="text-lg font-bold">My Cart</h1>
                    <button onClick={clearCart} className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors">CLEAR</button>
                </div>
                {/* Progress Steps */}
                <div className="flex items-center justify-between px-4 relative">
                    <div className="absolute left-10 right-10 top-1/2 h-0.5 bg-slate-200 dark:bg-slate-700 -z-10"></div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold border-4 border-white dark:border-slate-800 shadow-md">1</div>
                        <span className="text-[10px] font-bold text-blue-600">Cart</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 flex items-center justify-center text-xs font-bold border-4 border-white dark:border-slate-800">2</div>
                        <span className="text-[10px] font-medium text-slate-400">Address</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 flex items-center justify-center text-xs font-bold border-4 border-white dark:border-slate-800">3</div>
                        <span className="text-[10px] font-medium text-slate-400">Payment</span>
                    </div>
                </div>
            </header>

            <main className="px-6 space-y-6 mt-6">
                {/* Cart Items Section */}
                <section className="space-y-4">
                    {cart.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex gap-4 transition-transform hover:scale-[1.02]">
                            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex-shrink-0 flex items-center justify-center p-2">
                                {item.image_url ? (
                                    <img src={item.image_url} alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                                ) : (
                                    <span className="material-icons text-4xl text-slate-200 dark:text-slate-600">medication</span>
                                )}
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white leading-tight line-clamp-2">{item.name}</h3>
                                    <p className="text-xs text-slate-400 font-medium mt-1">₹{item.price} / unit</p>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center bg-slate-50 dark:bg-slate-900 rounded-xl p-1 border border-slate-100 dark:border-slate-700">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 shadow-sm text-slate-600 hover:text-blue-600 transition-colors"
                                        >
                                            <span className="material-icons text-sm">remove</span>
                                        </button>
                                        <span className="w-8 text-center text-sm font-bold text-slate-700 dark:text-slate-200">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-500/30 hover:bg-blue-700 transition-colors"
                                        >
                                            <span className="material-icons text-sm">add</span>
                                        </button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors">
                                        <span className="material-icons text-lg">delete_outline</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Offer Coupon (Visual Only) */}
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-indigo-100 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <span className="material-icons">local_offer</span>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-indigo-900 dark:text-indigo-200 text-sm">Apply Coupon</h4>
                        <p className="text-xs text-indigo-500 dark:text-indigo-400">Get discount on total</p>
                    </div>
                    <span className="material-icons text-indigo-400">chevron_right</span>
                </div>

                {/* Price Breakdown */}
                <section className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-3 shadow-sm">
                    <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 font-medium">
                        <span>Subtotal</span>
                        <span className="text-slate-800 dark:text-white">₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 font-medium">
                        <span>Delivery Fee</span>
                        <span className="text-green-600 font-bold">Free</span>
                    </div>
                    <div className="h-px bg-slate-100 dark:bg-slate-700 my-2"></div>
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-lg text-slate-900 dark:text-white">Total</span>
                        <span className="font-black text-2xl text-blue-600 dark:text-blue-400">₹{cartTotal}</span>
                    </div>
                </section>
            </main>

            {/* Fixed Checkout Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-40 rounded-t-3xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]">
                <button
                    onClick={handlePlaceOrder}
                    disabled={isOrdering}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:scale-100"
                >
                    {isOrdering ? (
                        <span>Processing...</span>
                    ) : (
                        <>
                            <span>Checkout</span>
                            <span className="bg-white/20 rounded-lg px-2 text-sm">₹{cartTotal}</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
