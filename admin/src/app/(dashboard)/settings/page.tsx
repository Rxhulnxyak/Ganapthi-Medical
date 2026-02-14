
"use client";

import AdminHeader from "../../../components/AdminHeader";

export default function SettingsPage() {
    return (
        <>
            <AdminHeader title="Settings" />
            <main className="p-8 space-y-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <h3 className="tex-lg font-bold text-slate-800 dark:text-white mb-4">General Settings</h3>
                    <p className="text-slate-500">Store configuration options will appear here.</p>

                    <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                            <div>
                                <h4 className="font-medium text-slate-900 dark:text-white">Store Status</h4>
                                <p className="text-sm text-slate-500">Open or close your online store temporarily</p>
                            </div>
                            <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                                <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-green-400 cursor-pointer"></label>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
