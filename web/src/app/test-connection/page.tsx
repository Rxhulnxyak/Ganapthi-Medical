
'use client';

import { useEffect, useState } from 'react';

export default function TestConnectionPage() {
    const [medicines, setMedicines] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMedicines() {
            try {
                const res = await fetch('http://localhost:3000/medicines');
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setMedicines(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchMedicines();
    }, []);

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">Backend Connection Test</h1>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            <div className="grid gap-4">
                {medicines.map((med: any) => (
                    <div key={med.id} className="border p-4 rounded shadow">
                        <h2 className="text-xl font-semibold">{med.name}</h2>
                        <p>Price: ₹{med.price}</p>
                        <p>Stock: {med.stock}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
