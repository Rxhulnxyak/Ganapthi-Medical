
import Link from "next/link";

export default function AdminHeader({ title }: { title: string }) {
    return (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-8 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h2>

            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
                    <span className="material-icons text-slate-500 dark:text-slate-400">notifications</span>
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Dr. Admin</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Store Owner</p>
                    </div>
                    <Link href="/profile" className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center overflow-hidden hover:ring-2 ring-primary transition-all">
                        <span className="material-icons text-slate-400">person</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}
