
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            // Success!
            router.push("/");

        } catch (err: any) {
            setError(err.message || "Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'google' | 'twitter') => {
        setLoading(true);
        setError("");
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `http://localhost:3000/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            setError(err.message || `Failed to login with ${provider}`);
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-200 min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Decorative Background Elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/5 rounded-full pointer-events-none"></div>

            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 z-10">

                {/* Top Branding Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                        <span className="material-icons text-primary text-5xl">medical_services</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Ganapathi Medical</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Your Health, Our Priority</p>
                </div>

                {/* Welcome Message */}
                <div className="mb-8 text-center">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Welcome Back</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Log in to manage your prescriptions</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 flex items-center gap-2">
                        <span className="material-icons text-sm">error</span>
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email/Phone Field */}
                    <div>
                        <label htmlFor="identifier" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 px-1">Email</label>
                        <div className="relative">
                            <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person_outline</span>
                            <input
                                id="identifier"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 px-1">Password</label>
                        <div className="relative">
                            <span className="material-icons absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock_outline</span>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-base"
                            />
                        </div>
                        <div className="flex justify-end mt-3">
                            <Link href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">Forgot Password?</Link>
                        </div>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] text-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : "Log In"}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-10">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white dark:bg-slate-900 text-slate-500 font-medium">OR CONTINUE WITH</span>
                    </div>
                </div>

                {/* Social Logins */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => handleSocialLogin('google')}
                        className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBU6bZhHX1glFw2Ezp_Zttca6wPTJYac2jpMOwuRqA5geB0B2kpTvJ4ayAo2zJHrkM1ZoBE_dJoG_mx0ULm7tnu0ISv_8EbIqGaeC1GFyb1Tt_45EthW5OJAxTrWo_QG3neXvPaGDCqNa7GCXhje0s1G_R18qYjPaE0-tg2RcAVsyavjohJRdIgXyTskkwasSdmMr5hHLOknUkENNed8C5FUQ_me-n1_duCvKrCY0JrsHifOlxexXHmCVCoq7bCc-c-RA51iQvtQZ-C" alt="Google" className="w-5 h-5" />
                        <span className="font-semibold text-slate-700 dark:text-slate-200">Google</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSocialLogin('twitter')}
                        className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAs4xzV-lEUfe4PjGOGhbTVdHjZSACBkM3OvCQYPuf0bI5nH3wtf5w7500pNbWeCxT3GzuddewFq244cdabmgrI-M95zp6Xr6W91F5x_7X0wGho39TBv_Le8zqXS_jMlf0QYnZBNGaRaYzU1t8pX04g_KW1GiC1eHzDSSxlzw3yH21U9PIbm4FYyKC3H9c8lL3oTCmVrJPsJoUbmPWNTQNfORckrGWv7QuNpsyO14DLcyVkUvHRO16wI3Rvz_Eneot-mKcDFzU-kLIi" alt="Twitter" className="w-5 h-5 dark:invert" />
                        <span className="font-semibold text-slate-700 dark:text-slate-200">Twitter</span>
                    </button>
                </div>

                {/* Sign Up Footer */}
                <div className="mt-8 text-center">
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Don't have an account?
                        <Link href="/signup" className="text-primary font-bold ml-1 hover:underline">Sign Up</Link>
                    </p>
                </div>

            </div>
        </div>
    );
}
