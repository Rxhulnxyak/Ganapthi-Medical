
const { createClient } = require('@supabase/supabase-js');

// Config from .env.local (admin)
const supabaseUrl = "https://zmrenmqbfyjtevswwauo.supabase.co";
// Using the visible ANON KEY
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InptcmVubXFiZnlqdGV2c3d3YXVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3Mjk5OTYsImV4cCI6MjA4NjMwNTk5Nn0.ayWf5j4HxmfXoy4RK2gor4ma4cERSef3Z792O1JgfKg";

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
    console.log("Creating Verified Admin User...");
    const email = "admin@ganapathi.com";
    const password = "Admin123!";

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                role: 'admin',
                name: 'Verified Admin',
                full_name: 'Verified Admin'
            }
        }
    });

    if (error) {
        console.error("SIGNUP FAILED:", error);
    } else {
        console.log("SIGNUP SUCCESS! User ID:", data.user?.id);
        console.log("NOTE: You must manually confirm this email in the database or check inbox.");
    }
}

createAdmin();
