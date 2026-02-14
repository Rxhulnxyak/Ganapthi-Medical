
const { createClient } = require('@supabase/supabase-js');

// Config from .env.local
const supabaseUrl = "https://zmrenmqbfyjtevswwauo.supabase.co";
// Using the LEGACY JWT KEY we found
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptcmVubXFiZnlqdGV2c3d3YXVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3Mjk5OTYsImV4cCI6MjA4NjMwNTk5Nn0.ayWf5j4HxmfXoy4RK2gor4ma4cERSef3Z792O1JgfKg";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
    console.log("Testing Login Only...");
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@ganapathi.com',
        password: 'Admin123!'
    });

    if (error) {
        console.error("LOGIN FAILED:", error);
    } else {
        console.log("LOGIN SUCCESS! User ID:", data.user.id);
        console.log("Role Metadata:", data.user.user_metadata);
    }
}

testLogin();
