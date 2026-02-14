
"use client";

import { useEffect, useState } from "react";
import AdminHeader from "../../components/AdminHeader";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeOrders: 0,
    newPrescriptions: 0,
    totalUsers: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/dashboard/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <>
      <AdminHeader title="Dashboard" />
      <main className="p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Revenue */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {loading ? "..." : `₹${stats.totalRevenue}`}
              </h3>
              <p className="text-xs text-green-500 flex items-center mt-2">
                <span className="material-icons text-sm mr-1">trending_up</span>
                Real-time
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <span className="material-icons text-2xl">payments</span>
            </div>
          </div>

          {/* Active Orders */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Active Orders</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {loading ? "..." : stats.activeOrders}
              </h3>
              <p className="text-xs text-orange-500 flex items-center mt-2">
                <span className="material-icons text-sm mr-1">hourglass_empty</span>
                Pending Review
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
              <span className="material-icons text-2xl">local_shipping</span>
            </div>
          </div>

          {/* Prescriptions */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Prescriptions</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {loading ? "..." : stats.newPrescriptions}
              </h3>
              <p className="text-xs text-blue-500 flex items-center mt-2">
                <span className="material-icons text-sm mr-1">new_releases</span>
                Pending Approval
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
              <span className="material-icons text-2xl">receipt_long</span>
            </div>
          </div>

          {/* Users */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Users</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {loading ? "..." : stats.totalUsers}
              </h3>
              <p className="text-xs text-green-500 flex items-center mt-2">
                <span className="material-icons text-sm mr-1">person_add</span>
                Registered Profile
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
              <span className="material-icons text-2xl">group</span>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-blue-800 dark:text-blue-300 text-sm">
          <strong>Note:</strong> This dashboard is now connected to your live Supabase database. Add orders or users to see numbers update.
        </div>

      </main>
    </>
  );
}
