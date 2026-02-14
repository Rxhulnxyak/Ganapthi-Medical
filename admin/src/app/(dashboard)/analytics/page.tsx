
"use client";

import AdminHeader from "../../../components/AdminHeader";

export default function Analytics() {
    return (
        <>
            <AdminHeader title="Analytics" />
            <main className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Sales Chart Placeholder */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-80 flex items-center justify-center flex-col">
                        <span className="material-icons text-4xl text-slate-300 mb-2">bar_chart</span>
                        <p className="text-slate-500">Sales Overview (Coming Soon)</p>
                    </div>

                    {/* User Growth Placeholder */}
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 h-80 flex items-center justify-center flex-col">
                        <span className="material-icons text-4xl text-slate-300 mb-2">show_chart</span>
                        <p className="text-slate-500">User Growth (Coming Soon)</p>
                    </div>
                </div>
            </main>
        </>
    );
}
