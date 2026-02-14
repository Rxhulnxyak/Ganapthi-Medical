import { memo } from "react";
import Image from "next/image";

interface Medicine {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    requires_prescription: boolean;
    image_url?: string;
}

interface MedicineRowProps {
    item: Medicine;
    onEdit: (medicine: Medicine) => void;
    onDelete: (id: string) => void;
}

const MedicineRow = memo(function MedicineRow({ item, onEdit, onDelete }: MedicineRowProps) {
    const getStockStatus = (stock: number) => {
        if (stock === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
        if (stock < 50) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
        return { label: "In Stock", color: "bg-green-100 text-green-800" };
    };

    const status = getStockStatus(item.stock);

    return (
        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <td className="px-6 py-4">
                {item.image_url ? (
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-100">
                        <Image
                            src={item.image_url}
                            alt={item.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                            loading="lazy"
                        />
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <span className="material-icons text-slate-400 text-sm">medication</span>
                    </div>
                )}
            </td>
            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{item.name}</td>
            <td className="px-6 py-4">{item.category || '-'}</td>
            <td className="px-6 py-4">₹{item.price}</td>
            <td className="px-6 py-4">{item.stock}</td>
            <td className="px-6 py-4">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                    {status.label}
                </span>
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => onEdit(item)}
                        className="p-2 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        aria-label="Edit medicine"
                    >
                        <span className="material-icons text-lg">edit</span>
                    </button>
                    <button
                        onClick={() => onDelete(item.id)}
                        className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                        aria-label="Delete medicine"
                    >
                        <span className="material-icons text-lg">delete</span>
                    </button>
                </div>
            </td>
        </tr>
    );
});

export default MedicineRow;
