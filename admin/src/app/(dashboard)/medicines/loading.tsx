export default function MedicinesLoading() {
    return (
        <main className="p-8">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center mb-6">
                <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                <div className="h-10 w-40 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
            </div>

            {/* Table Skeleton */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase font-semibold text-slate-500">
                            <tr>
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">Medicine Name</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {[...Array(8)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4">
                                        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded ml-auto"></div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Loading indicator */}
            <div className="mt-4 text-center">
                <p className="text-sm text-slate-500 animate-pulse">Loading medicines from database...</p>
            </div>
        </main>
    );
}
