"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log("User logged in");
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 font-display pb-32">
      <Header />

      <main className="px-5 py-6">
        {/* Hero: Upload Prescription */}
        <section className="mb-8">
          <div className="bg-primary rounded-xl p-6 text-white shadow-lg shadow-primary/20 flex items-center gap-5 relative overflow-hidden">
            <div className="flex-1 z-10">
              <h2 className="text-2xl font-bold mb-1">Quick Order</h2>
              <p className="text-white/80 text-lg mb-4">Upload your prescription and we'll handle the rest.</p>
              <Link href="/upload" className="bg-white text-primary font-bold py-3 px-6 rounded-lg flex items-center gap-2 text-lg active:scale-95 transition-transform w-fit">
                <span className="material-icons">photo_camera</span>
                Upload Now
              </Link>
            </div>
            <div className="hidden sm:block opacity-90">
              {/* Placeholder for illustration */}
              <span className="material-icons text-9xl text-white/20">assignment</span>
            </div>
          </div>
        </section>

        {/* Quick Action Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Link href="/store" className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 active:bg-slate-50 transition-colors">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-primary rounded-lg flex items-center justify-center">
              <span className="material-icons text-3xl">medication</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Order Medicines</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Browse 50k+ products</p>
            </div>
          </Link>

          <Link href="/orders" className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 active:bg-slate-50 transition-colors">
            <div className="w-14 h-14 bg-green-50 dark:bg-green-900/30 text-green-500 rounded-lg flex items-center justify-center">
              <span className="material-icons text-3xl">history</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">My Orders</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Track & reorder</p>
            </div>
          </Link>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 active:bg-slate-50 transition-colors">
            <div className="w-14 h-14 bg-orange-50 dark:bg-orange-900/30 text-orange-500 rounded-lg flex items-center justify-center">
              <span className="material-icons text-3xl">volunteer_activism</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Health Tips</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Daily wellness advice</p>
            </div>
          </div>
        </section>

        {/* Recommended Medicines Section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recommended for You</h2>
            <Link href="/store" className="text-primary font-semibold">See All</Link>
          </div>

          <div className="flex overflow-x-auto gap-4 hide-scrollbar -mx-5 px-5 pb-4">
            {/* Medicine Card 1 */}
            <div className="min-w-[180px] bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="w-full h-32 mb-4 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <span className="material-icons text-4xl text-slate-300">medication</span>
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">Multivitamin Daily</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">60 Capsules</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900 dark:text-white">₹499</span>
                <button className="bg-primary/10 text-primary p-2 rounded-lg hover:bg-primary hover:text-white transition-colors">
                  <span className="material-icons">add</span>
                </button>
              </div>
            </div>

            {/* Medicine Card 2 */}
            <div className="min-w-[180px] bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="w-full h-32 mb-4 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <span className="material-icons text-4xl text-slate-300">water_drop</span>
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">Omega 3 Fish Oil</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">30 Softgels</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900 dark:text-white">₹850</span>
                <button className="bg-primary/10 text-primary p-2 rounded-lg hover:bg-primary hover:text-white transition-colors">
                  <span className="material-icons">add</span>
                </button>
              </div>
            </div>

            {/* Medicine Card 3 */}
            <div className="min-w-[180px] bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="w-full h-32 mb-4 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <span className="material-icons text-4xl text-slate-300">local_cafe</span>
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">Immunity Tea</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">25 Tea Bags</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900 dark:text-white">₹299</span>
                <button className="bg-primary/10 text-primary p-2 rounded-lg hover:bg-primary hover:text-white transition-colors">
                  <span className="material-icons">add</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="mt-8">
          <div className="bg-slate-900 rounded-xl p-5 overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-white text-xl font-bold">20% Off on First Order</h3>
              <p className="text-slate-400 mb-3">Use code: <span className="text-primary font-bold">GANAPATHI20</span></p>
              <button className="text-sm font-semibold text-white border border-slate-700 px-4 py-1.5 rounded-full">T&C Apply</button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-30 transform rotate-12">
              <span className="material-icons text-[120px] text-white">local_offer</span>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
