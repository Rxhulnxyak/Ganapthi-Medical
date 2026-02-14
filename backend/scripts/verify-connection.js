
// Using global fetch (Node 18+)

async function verify() {
    console.log('Testing Backend Connection...');
    try {
        const res = await fetch('http://localhost:3000/medicines');
        const data = await res.json();

        if (res.ok) {
            console.log('✅ Success! Backend is running and connected to Supabase.');
            console.log('Response:', data);
        } else {
            console.log('⚠️ Backend reachable but returned error (likely missing tables):');
            console.log(data);
        }
    } catch (err) {
        console.error('❌ Failed to connect to backend:', err.message);
    }
}

verify();
