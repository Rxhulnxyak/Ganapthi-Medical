
"use client";

import { useState, memo, useCallback } from "react";
import Image from "next/image";
import MedicineRow from "./MedicineRow";

interface Medicine {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    requires_prescription: boolean;
    image_url?: string;
}

interface MedicinesClientProps {
    initialMedicines: Medicine[];
}

export default function MedicinesClient({ initialMedicines }: MedicinesClientProps) {
    const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
    // Loading is only true if we are RE-fetching, but initial data is instant
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        stock: '',
        requires_prescription: false,
        image_url: ''
    });

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    // Fetch Medicines from Backend (Client-side refresh)
    const refreshMedicines = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/medicines`, { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setMedicines(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Open Modal for Create
    const openCreateModal = useCallback(() => {
        setEditingId(null);
        setFormData({ name: '', category: '', price: '', stock: '', requires_prescription: false, image_url: '' });
        setIsModalOpen(true);
    }, []);

    // Open Modal for Edit
    const openEditModal = useCallback((medicine: Medicine) => {
        setEditingId(medicine.id);
        setFormData({
            name: medicine.name,
            category: medicine.category,
            price: medicine.price.toString(),
            stock: medicine.stock.toString(),
            requires_prescription: medicine.requires_prescription,
            image_url: medicine.image_url || ''
        });
        setIsModalOpen(true);
    }, []);

    // Handle Submit (Create or Update)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId ? `${API_URL}/medicines/${editingId}` : `${API_URL}/medicines`;
            const method = editingId ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    stock: parseInt(formData.stock)
                })
            });

            if (res.ok) {
                setIsModalOpen(false);
                refreshMedicines(); // Refresh list to see changes
            } else {
                alert('Operation failed');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Handle Delete
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this medicine?")) return;
        try {
            const res = await fetch(`${API_URL}/medicines/${id}`, { method: 'DELETE' });
            if (res.ok) {
                refreshMedicines();
            } else {
                alert("Failed to delete");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <main className="p-8">
            {/* Header Actions */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">All Medicines</h2>
                <button
                    onClick={openCreateModal}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <span className="material-icons text-sm">add</span>
                    Add New Medicine
                </button>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                {loading ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase font-semibold text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">Image</th>
                                    <th className="px-6 py-4">Medicine Name</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Stock</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {[...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div></td>
                                        <td className="px-6 py-4 text-right"><div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded ml-auto"></div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase font-semibold text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">Image</th>
                                    <th className="px-6 py-4">Medicine Name</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">Stock</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {medicines.map((item) => (
                                    <MedicineRow
                                        key={item.id}
                                        item={item}
                                        onEdit={openEditModal}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                            {editingId ? 'Edit Medicine' : 'Add New Medicine'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Image URL</label>
                                <input
                                    type="url"
                                    placeholder="https://"
                                    className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                                    value={formData.image_url}
                                    onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Price</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Stock</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="checkbox"
                                    id="req_pres"
                                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                                    checked={formData.requires_prescription}
                                    onChange={e => setFormData({ ...formData, requires_prescription: e.target.checked })}
                                />
                                <label htmlFor="req_pres" className="text-sm font-medium">Requires Prescription</label>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                                >
                                    {editingId ? 'Update Medicine' : 'Add Medicine'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
