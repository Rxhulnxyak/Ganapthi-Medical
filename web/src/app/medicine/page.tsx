
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MedicineDetails() {
    const router = useRouter();

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-200 min-h-screen flex flex-col">
            {/* Top Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-4 flex items-center justify-between">
                <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <span className="material-icons text-slate-600 dark:text-slate-300">arrow_back_ios_new</span>
                </button>
                <h1 className="text-lg font-semibold">Medicine Details</h1>
                <div className="flex gap-2">
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                        <span className="material-icons text-slate-600 dark:text-slate-300">share</span>
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-primary">
                        <span className="material-icons">favorite_border</span>
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow px-4 pb-32">
                {/* Product Showcase Section */}
                <div className="relative w-full aspect-square bg-gradient-to-tr from-primary/5 to-primary/20 rounded-xl overflow-hidden mt-2 mb-6 group flex items-center justify-center">
                    {/* Placeholder Image */}
                    <span className="material-icons text-9xl text-slate-300">medication</span>

                    <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-800/90 p-2 rounded-lg shadow-sm">
                        <span className="material-icons text-primary">3d_rotation</span>
                    </div>
                </div>

                {/* Prescription Warning */}
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <span className="material-icons text-primary mt-0.5">assignment_late</span>
                    <div>
                        <h3 className="font-semibold text-primary">Prescription Required</h3>
                        <p className="text-sm opacity-80">A valid medical prescription from a licensed doctor is required to purchase this medicine.</p>
                    </div>
                </div>

                {/* Title and Pricing */}
                <div className="mb-8">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Amoxicillin 500mg</h2>
                            <p className="text-slate-500 dark:text-slate-400">By PharmaCare Laboratories • 10 Capsules</p>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-primary">$14.50</span>
                            <p className="text-xs text-slate-400 line-through">$18.00</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex text-yellow-400">
                            <span className="material-icons text-sm">star</span>
                            <span className="material-icons text-sm">star</span>
                            <span className="material-icons text-sm">star</span>
                            <span className="material-icons text-sm">star</span>
                            <span className="material-icons text-sm">star_half</span>
                        </div>
                        <span className="text-xs font-medium text-slate-500">(1.2k Reviews)</span>
                    </div>
                </div>

                {/* Dosage Instructions */}
                <section className="mb-8">
                    <h3 className="text-lg font-bold mb-4">Dosage Guidance</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                            <span className="material-icons text-primary mb-2">schedule</span>
                            <p className="text-xs text-slate-500 mb-1">Frequency</p>
                            <p className="text-sm font-semibold">3x Daily</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                            <span className="material-icons text-primary mb-2">restaurant</span>
                            <p className="text-xs text-slate-500 mb-1">When</p>
                            <p className="text-sm font-semibold">After Meal</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                            <span className="material-icons text-primary mb-2">event_repeat</span>
                            <p className="text-xs text-slate-500 mb-1">Duration</p>
                            <p className="text-sm font-semibold">7 Days</p>
                        </div>
                    </div>
                </section>

                {/* Information Accordions */}
                <section className="space-y-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-orange-500">warning</span>
                                <span className="font-semibold">Usage Warnings</span>
                            </div>
                            <span className="material-icons text-slate-400">expand_more</span>
                        </div>
                        <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-700/50 pt-4">
                            Avoid alcohol consumption while taking this medication. Do not use if you have a history of penicillin allergy. Inform your doctor about kidney issues.
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="material-icons text-blue-500">medical_services</span>
                                <span className="font-semibold">Side Effects</span>
                            </div>
                            <span className="material-icons text-slate-400">expand_more</span>
                        </div>
                        <div className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-700/50 pt-4">
                            Common side effects may include nausea, diarrhea, or mild stomach upset. If you experience a rash or difficulty breathing, seek immediate medical attention.
                        </div>
                    </div>
                </section>
            </main>

            {/* Sticky Bottom Bar */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 pb-8 flex items-center gap-4 z-50">
                {/* Quantity Selector */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 shrink-0">
                    <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-800">
                        <span className="material-icons">remove</span>
                    </button>
                    <span className="w-8 text-center font-bold">1</span>
                    <button className="w-10 h-10 flex items-center justify-center text-primary hover:text-primary/80">
                        <span className="material-icons">add</span>
                    </button>
                </div>
                {/* Add to Cart Button */}
                <button className="flex-grow bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform">
                    <span className="material-icons text-sm">shopping_cart</span>
                    Add to Cart
                </button>
            </footer>
        </div>
    );
}
