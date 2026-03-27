/* eslint-disable */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Search, X, Save, Loader2, Globe, Tag, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { alerts } from "@/lib/alerts";

export default function AdminCategories() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isIdling, setIsIdling] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        image: "",
        metaTitle: "",
        metaDescription: ""
    });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            alerts.error("Data Fetch Failure", "Could not synchronize category records from the database.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleOpenModal = (category: any = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug,
                description: category.description,
                image: category.image,
                metaTitle: category.metaTitle || "",
                metaDescription: category.metaDescription || ""
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: "",
                slug: "",
                description: "",
                image: "",
                metaTitle: "",
                metaDescription: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsIdling(true);
        const method = editingCategory ? 'PUT' : 'POST';
        const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (res.ok) {
                alerts.success(
                    editingCategory ? "Category Updated" : "Category Created",
                    `The component classification "${formData.name}" has been successfully recorded.`
                );
                setIsModalOpen(false);
                fetchCategories();
            } else {
                alerts.error(
                    "Operation Failed",
                    data.details || data.error || "An unexpected error occurred while processing the record."
                );
            }
        } catch (error) {
            console.error("Failed to save category:", error);
            alerts.error("Connection Error", "The terminal lost connection to the core database services.");
        } finally {
            setIsIdling(false);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmed = await alerts.confirm(
            "Terminate Category?",
            "This action will de-link all associated products. The engineering metadata will be permanently erased."
        );
        
        if (!confirmed) return;

        try {
            const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setCategories(prev => prev.filter(c => c.id !== id));
                alerts.success("Record Terminated", "The category has been successfully purged from the system.");
            } else {
                const data = await res.json();
                alerts.error("Deletion Failed", data.error || "Could not execute the termination sequence.");
            }
        } catch (error) {
            console.error("Failed to delete category:", error);
            alerts.error("System Error", "The deletion sequence was interrupted by a network failure.");
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8 font-outfit">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-surface-950 mb-2 uppercase">
                        PART <span className="text-brand-600">CATEGORIES</span>
                    </h1>
                    <p className="text-surface-500 font-medium">Organize your inventory and optimize for search engines.</p>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-brand-600/20 active:scale-95 uppercase tracking-widest text-sm"
                >
                    <Plus size={20} />
                    <span>CREATE CATEGORY</span>
                </button>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-surface-200 shadow-sm">
                <div className="relative w-full sm:w-96">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 pl-12 pr-6 text-surface-900 focus:outline-none focus:border-brand-500 transition-all font-bold placeholder:text-surface-300"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] border border-surface-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-50/50 border-b border-surface-200 text-surface-500 font-black text-[10px] uppercase tracking-[0.2em]">
                                    <th className="py-6 px-8">Category / Visual</th>
                                    <th className="py-6 px-8">Slug</th>
                                    <th className="py-6 px-8">Product Count</th>
                                    <th className="py-6 px-8 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                {filteredCategories.map((category, i) => (
                                    <motion.tr
                                        key={category.id}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="hover:bg-surface-50/50 transition-colors group"
                                    >
                                        <td className="py-5 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-surface-200 bg-surface-50">
                                                    <Image src={category.image} alt={category.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div className="font-black text-surface-950 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{category.name}</div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8 text-sm font-bold text-surface-400 font-mono">
                                            /{category.slug}
                                        </td>
                                        <td className="py-5 px-8">
                                            <span className="font-black text-brand-600 bg-brand-50 px-4 py-1 rounded-full text-xs border border-brand-100 italic">
                                                {category._count?.products || 0} UNITS
                                            </span>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(category)}
                                                    className="p-2.5 text-surface-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all border border-transparent hover:border-brand-100 shadow-sm"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="p-2.5 text-surface-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-surface-950/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-surface-200"
                        >
                            <div className="flex items-center justify-between p-8 border-b border-surface-100">
                                <h2 className="text-2xl font-black text-surface-950 uppercase tracking-tight">
                                    {editingCategory ? 'Edit' : 'Create'} <span className="text-brand-600">Category</span>
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-100 rounded-xl transition-colors text-surface-400 hover:text-surface-900">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Core Info */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Category Name</label>
                                            <div className="relative">
                                                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" size={18} />
                                                <input
                                                    required
                                                    value={formData.name}
                                                    onChange={e => {
                                                        const name = e.target.value;
                                                        const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                                                        setFormData({ ...formData, name, slug });
                                                    }}
                                                    className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 pl-12 pr-6 font-bold text-surface-900 focus:border-brand-500 outline-none"
                                                    placeholder="e.g. Braking Systems"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Slug (URL)</label>
                                            <input
                                                required
                                                value={formData.slug}
                                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                                className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 px-6 font-bold text-surface-400 font-mono focus:border-brand-500 outline-none"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Cover Image URL</label>
                                            <div className="relative">
                                                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" size={18} />
                                                <input
                                                    required
                                                    value={formData.image}
                                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                                    className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 pl-12 pr-6 font-bold text-surface-900 focus:border-brand-500 outline-none"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* SEO & Description */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">SEO Meta Title</label>
                                            <div className="relative">
                                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" size={18} />
                                                <input
                                                    value={formData.metaTitle}
                                                    onChange={e => setFormData({ ...formData, metaTitle: e.target.value })}
                                                    className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 pl-12 pr-6 font-bold text-surface-900 focus:border-brand-500 outline-none"
                                                    placeholder="SEO optimized title..."
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">SEO Meta Description</label>
                                            <textarea
                                                rows={2}
                                                value={formData.metaDescription}
                                                onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                                                className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 px-4 font-bold text-surface-900 focus:border-brand-500 outline-none resize-none"
                                                placeholder="Brief description for search engines..."
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Description</label>
                                            <textarea
                                                required
                                                rows={4}
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 px-4 font-bold text-surface-900 focus:border-brand-500 outline-none resize-none"
                                                placeholder="Briefly describe this category..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-8 py-4 bg-surface-50 hover:bg-surface-100 text-surface-600 font-black rounded-2xl transition-all uppercase tracking-widest text-sm"
                                    >
                                        Discard
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isIdling}
                                        className="flex items-center gap-2 px-12 py-4 bg-brand-600 hover:bg-brand-700 disabled:bg-surface-300 text-white font-black rounded-2xl transition-all shadow-xl shadow-brand-600/20 active:scale-95 uppercase tracking-widest text-sm"
                                    >
                                        {isIdling ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            <Save size={20} />
                                        )}
                                        <span>{isIdling ? 'SAVING...' : 'SAVE CATEGORY'}</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
