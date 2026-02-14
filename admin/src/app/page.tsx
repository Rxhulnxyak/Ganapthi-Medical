"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function RootPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Check if user is admin
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.user_metadata?.role === "admin") {
            router.push("/(dashboard)");
          } else {
            router.push("/(auth)/login");
          }
        } else {
          router.push("/(auth)/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/(auth)/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    </div>
  );
}
