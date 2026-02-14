"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";

const Sidebar = memo(function Sidebar() {
    const pathname = usePathname();

    const menuItems = [
        { name: "Dashboard", icon: "dashboard", href: "/" },
        { name: "Prescriptions", icon: "receipt_long", href: "/prescriptions" },
        { name: "Orders", icon: "shopping_bag", href: "/orders" },
        { name: "Medicines", icon: "medication", href: "/medicines" },
        { name: "Users", icon: "group", href: "/users" },
        { name: "Analytics", icon: "bar_chart", href: "/analytics" },
        { name: "Settings", icon: "settings", href: "/settings" },
    ];

    const isActive = (path: string) => {
        return pathname === path
            ? "bg-primary text-white shadow-lg shadow-primary/30"
            : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400";
    };

    return (
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-50">
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <span className="material-icons text-white">medical_services</span>
                </div>
                <div>
                    <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                        Ganapathi<br />Medical
                    </h1>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive(item.href)}`}
                    >
                        <span className="material-icons">{item.icon}</span>
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <button className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl w-full transition-colors font-medium">
                    <span className="material-icons">logout</span>
                    Logout
                </button>
            </div>
        </aside>
    );
});

export default Sidebar;
