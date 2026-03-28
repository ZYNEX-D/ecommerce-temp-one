/* eslint-disable */
"use client"

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Search, X, Save, Loader2, Globe, Box, Tag, DollarSign, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { alerts } from "@/lib/alerts";
import { CustomSelect, SelectOption } from "@/components/common/CustomSelect";

const m = motion as any;

export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [isIdling, setIsIdling] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        price: 0,
        image: "",
        stock: 0,
        sku: "",
        categoryId: "",
        metaTitle: "",
        metaDescription: "",
        warranty: "",
        delivery: "",
        returns: "",
        terms: ""
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/categories')
            ]);
            const [prodData, catData] = await Promise.all([prodRes.json(), catRes.json()]);
            if (Array.isArray(prodData)) setProducts(prodData);
            if (Array.isArray(catData)) setCategories(catData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            alerts.error("Sync Failure", "Could not retrieve the latest inventory records.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (product: any = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                slug: product.slug,
                description: product.description,
                price: parseFloat(product.price),
                image: product.image,
                stock: product.stock,
                sku: product.sku || "",
                categoryId: product.categoryId,
                metaTitle: product.metaTitle || "",
                metaDescription: product.metaDescription || "",
                warranty: product.warranty || "",
                delivery: product.delivery || "",
                returns: product.returns || "",
                terms: product.terms || ""
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: "",
                slug: "",
                description: "",
                price: 0,
                image: "",
                stock: 0,
                sku: "",
                categoryId: categories[0]?.id || "",
                metaTitle: "",
                metaDescription: "",
                warranty: "",
                delivery: "",
                returns: "",
                terms: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsIdling(true);
        const method = editingProduct ? 'PUT' : 'POST';
        const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            
            if (res.ok) {
                alerts.success(
                    editingProduct ? "Product Updated" : "Product Deployed",
                    `The component "${formData.name}" has been successfully updated in the inventory.`
                );
                setIsModalOpen(false);
                fetchData();
            } else {
                const data = await res.json();
                alerts.error("Deployment Failed", data.error || "Could not save the product record.");
            }
        } catch (error) {
            console.error("Failed to save product:", error);
            alerts.error("Terminal Error", "The connection to the inventory server was lost.");
        } finally {
            setIsIdling(false);
        }
    };

    const handleDelete = async (id: string) => {
        const confirmed = await alerts.confirm(
            "Decommission Part?",
            "This will permanently erase all engineering data and stock records for this component."
        );
        
        if (!confirmed) return;

        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(prev => prev.filter(p => p.id !== id));
                alerts.success("Part Decommissioned", "The record has been purged from the global inventory.");
            } else {
                alerts.error("Purge Failed", "Could not execute the decommissioning sequence.");
            }
        } catch (error) {
            console.error("Failed to delete product:", error);
            alerts.error("System Failure", "The deletion sequence was interrupted.");
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "all" || p.categoryId === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const categoryOptions: SelectOption[] = [
        { value: "all", label: "All Categories" },
        ...categories.map(c => ({ value: c.id, label: c.name }))
    ];

    const categoryFormOptions: SelectOption[] = categories.map(c => ({ value: c.id, label: c.name }));

    return (
        <div className="max-w-7xl mx-auto space-y-8 font-outfit">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-surface-950 mb-2 uppercase">
                        PRODUCT <span className="text-brand-600">INVENTORY</span>
                    </h1>
                    <p className="text-surface-500 font-medium">Manage your automotive spare parts, stock levels, and SEO.</p>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-brand-600/20 active:scale-95 uppercase tracking-widest text-sm"
                >
                    <Plus size={20} />
                    <span>ADD PRODUCT</span>
                </button>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-surface-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-96">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input
                        type="text"
                        placeholder="Search parts, IDs, or categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 pl-12 pr-6 text-surface-900 focus:outline-none focus:border-brand-500 transition-all font-bold placeholder:text-surface-300"
                    />
                </div>

                <div className="flex gap-3">
                    <CustomSelect
                        options={categoryOptions}
                        value={filterCategory}
                        onChange={setFilterCategory}
                        triggerClassName="bg-surface-50 border border-surface-200 rounded-2xl py-3 px-5 text-surface-600 font-bold hover:border-surface-400 min-w-[180px]"
                        listClassName="top-full"
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
                                    <th className="py-6 px-8">Product / Model</th>
                                    <th className="py-6 px-8">Category</th>
                                    <th className="py-6 px-8">Base Price</th>
                                    <th className="py-6 px-8">Stock Status</th>
                                    <th className="py-6 px-8 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                {filteredProducts.map((product, i) => (
                                    <m.tr
                                        key={product.id}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="hover:bg-surface-50/50 transition-colors group"
                                    >
                                        <td className="py-5 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-surface-200 bg-surface-50">
                                                    <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div>
                                                    <div className="font-black text-surface-950 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{product.name}</div>
                                                    <div className="text-[10px] font-black text-surface-400 uppercase tracking-widest">SKU: {product.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <span className="font-black text-surface-500 text-[10px] uppercase tracking-widest bg-surface-50 px-3 py-1 rounded-full border border-surface-100">
                                                {product.category?.name || 'General'}
                                            </span>
                                        </td>
                                        <td className="py-5 px-8">
                                            <span className="font-black text-surface-950">${parseFloat(product.price).toFixed(2)}</span>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="w-24 h-1.5 bg-surface-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${product.stock > 20 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                        style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">{product.stock} Units In Stock</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(product)}
                                                    className="p-2.5 text-surface-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all border border-transparent hover:border-brand-100"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2.5 text-surface-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </m.tr>
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
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-surface-950/40 backdrop-blur-md"
                        />
                        <m.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-surface-200"
                        >
                            <div className="flex items-center justify-between p-8 border-b border-surface-100">
                                <h2 className="text-2xl font-black text-surface-950 uppercase tracking-tight">
                                    {editingProduct ? 'Edit' : 'Add New'} <span className="text-brand-600">Product</span>
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-surface-100 rounded-xl transition-colors text-surface-400 hover:text-surface-900">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Column 1: Core Logistics */}
                                    <div className="space-y-8">
                                        <div className="space-y-6">
                                            <h3 className="text-xs font-black text-brand-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-600" /> Core Identity
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Part Name</label>
                                                    <div className="relative">
                                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" size={18} />
                                                        <input
                                                            required
                                                            value={formData.name}
                                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                            className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 pl-12 pr-6 font-bold text-surface-900 focus:border-brand-500 outline-none transition-all"
                                                            placeholder="e.g. Performance Brake Pads"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Base Price</label>
                                                        <div className="relative">
                                                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" size={18} />
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                value={formData.price}
                                                                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                                                className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 pl-10 pr-4 font-bold text-surface-900 focus:border-brand-500 outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Stock Level</label>
                                                        <div className="relative">
                                                            <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" size={18} />
                                                            <input
                                                                type="number"
                                                                value={formData.stock}
                                                                onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                                                className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 pl-10 pr-4 font-bold text-surface-900 focus:border-brand-500 outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Global Category</label>
                                                    <CustomSelect
                                                        options={categoryFormOptions}
                                                        value={formData.categoryId}
                                                        onChange={(val) => setFormData({ ...formData, categoryId: val })}
                                                        triggerClassName="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 px-4 font-bold text-surface-900 hover:border-brand-500"
                                                        listClassName="top-full"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Image Reference URL</label>
                                                    <div className="relative">
                                                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-300" size={18} />
                                                        <input
                                                            required
                                                            value={formData.image}
                                                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                                                            className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 pl-12 pr-6 font-bold text-surface-900 focus:border-brand-500 outline-none"
                                                            placeholder="https://images.unsplash..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-surface-100">
                                            <h3 className="text-xs font-black text-brand-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-600" /> Service & Fulfillment
                                            </h3>
                                            <div className="grid grid-cols-1 gap-5">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Warranty Coverage</label>
                                                    <input 
                                                        value={formData.warranty}
                                                        onChange={e => setFormData({ ...formData, warranty: e.target.value })}
                                                        className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 px-5 font-bold text-surface-950 focus:border-brand-500 outline-none shadow-sm"
                                                        placeholder="e.g. 2-YEAR FULL WARRANTY"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Delivery Protocol</label>
                                                    <input 
                                                        value={formData.delivery}
                                                        onChange={e => setFormData({ ...formData, delivery: e.target.value })}
                                                        className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 px-5 font-bold text-surface-950 focus:border-brand-500 outline-none shadow-sm"
                                                        placeholder="e.g. EXPRESS LOGISTICS"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Return Policy</label>
                                                    <input 
                                                        value={formData.returns}
                                                        onChange={e => setFormData({ ...formData, returns: e.target.value })}
                                                        className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-3 px-5 font-bold text-surface-950 focus:border-brand-500 outline-none shadow-sm"
                                                        placeholder="e.g. 30-DAY EASY RETURNS"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 2: SEO & Technicals */}
                                    <div className="space-y-8">
                                        <div className="space-y-6">
                                            <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" /> Google Search Optimization
                                            </h3>
                                            <div className="p-6 bg-indigo-50/30 rounded-[2rem] border border-indigo-100 space-y-5">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-indigo-900/40 uppercase tracking-widest pl-1">Search Result Title</label>
                                                    <div className="relative">
                                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
                                                        <input
                                                            value={formData.metaTitle}
                                                            onChange={e => setFormData({ ...formData, metaTitle: e.target.value })}
                                                            className="w-full bg-white border border-indigo-100 rounded-xl py-3 pl-12 pr-6 font-bold text-indigo-950 focus:border-brand-500 outline-none shadow-sm"
                                                            placeholder="Optimized for Google..."
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-indigo-900/40 uppercase tracking-widest pl-1">Meta Description</label>
                                                    <textarea
                                                        rows={3}
                                                        value={formData.metaDescription}
                                                        onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                                                        className="w-full bg-white border border-indigo-100 rounded-xl py-3 px-5 font-bold text-indigo-950 focus:border-brand-500 outline-none resize-none shadow-sm"
                                                        placeholder="Snippets for search results..."
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-xs font-black text-surface-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-surface-400" /> Engineering Breakdown
                                            </h3>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Full Description</label>
                                                <textarea
                                                    required
                                                    rows={6}
                                                    value={formData.description}
                                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                    className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-4 px-5 font-bold text-surface-950 focus:border-brand-500 outline-none resize-none transition-all"
                                                    placeholder="Technical specifications and fitment data..."
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-surface-100">
                                            <h3 className="text-xs font-black text-red-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-600" /> Legal & Compliance
                                            </h3>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Product-Specific Terms</label>
                                                <textarea 
                                                    rows={3}
                                                    value={formData.terms}
                                                    onChange={e => setFormData({ ...formData, terms: e.target.value })}
                                                    className="w-full bg-surface-50 border border-surface-200 rounded-2xl py-4 px-5 font-bold text-surface-950 focus:border-brand-500 outline-none resize-none shadow-sm"
                                                    placeholder="Liability waivers or special handling clauses..."
                                                />
                                            </div>
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
                                        <span>{isIdling ? 'DEPLOYING...' : 'DEPLOY CHANGES'}</span>
                                    </button>
                                </div>
                            </form>
                        </m.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
