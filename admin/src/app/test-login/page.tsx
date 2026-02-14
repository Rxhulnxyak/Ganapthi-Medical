
"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function TestLogin() {
    const [status, setStatus] = useState("Idle");
    const [key, setKey] = useState("");

    useEffect(() => {
        // Show last 4 chars of key to verify loaded env
        const k = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
        setKey(k.slice(-4));
    }, []);

    const test = async () => {
        setStatus("Testing...");
        try {
            const res = await supabase.auth.signInWithPassword({
                email: "admin@ganapathi.com",
                password: "Admin123!"
            });
            if (res.error) {
                setStatus("Error: " + JSON.stringify(res.error, null, 2));
            } else {
                setStatus("Success! User ID: " + res.data.user.id);
            }
        } catch (e: any) {
            setStatus("Exception: " + e.message);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Debug Login</h1>
            <p>Key ends with: ...{key}</p>
            <button onClick={test} style={{ padding: "10px 20px" }}>Test Login</button>
            <pre style={{ marginTop: 20, background: "#f0f0f0", padding: 10 }}>{status}</pre>
        </div>
    );
}
