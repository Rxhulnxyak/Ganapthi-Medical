
import AdminHeader from "../../../components/AdminHeader";
import MedicinesClient from "./MedicinesClient";

// Define the Medicine Interface
interface Medicine {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    requires_prescription: boolean;
    image_url?: string;
}

// Ensure dynamic rendering so we always fetch fresh data on navigation
export const dynamic = 'force-dynamic';

export default async function MedicinesPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    let medicines: Medicine[] = [];

    const startTime = Date.now();
    console.log('[Medicines Page] Starting server-side data fetch...');

    try {
        const fetchStart = Date.now();
        const res = await fetch(`${API_URL}/medicines`, {
            cache: 'no-store',
            next: { revalidate: 0 }
        });
        const fetchEnd = Date.now();
        console.log(`[Medicines Page] ⏱️  API Response Time: ${fetchEnd - fetchStart}ms`);

        if (res.ok) {
            const parseStart = Date.now();
            medicines = await res.json();
            const parseEnd = Date.now();
            console.log(`[Medicines Page] 📊 JSON Parse Time: ${parseEnd - parseStart}ms`);
            console.log(`[Medicines Page] 💊 Total Medicines Loaded: ${medicines.length}`);
        } else {
            console.error("[Medicines Page] ❌ Failed to fetch medicines:", res.status, res.statusText);
        }
    } catch (error) {
        console.error("[Medicines Page] ❌ Error fetching medicines:", error);
    }

    const endTime = Date.now();
    console.log(`[Medicines Page] ✅ Total Server Processing Time: ${endTime - startTime}ms\n`);

    return (
        <>
            <AdminHeader title="Medicine Inventory" />
            <MedicinesClient initialMedicines={medicines} />
        </>
    );
}
