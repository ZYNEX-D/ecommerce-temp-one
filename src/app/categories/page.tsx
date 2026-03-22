"use client";

import { motion } from "framer-motion";
import {
    Zap,
    Disc,
    Droplets,
    Settings,
    Maximize,
    Lightbulb,
    ArrowRight,
    Loader2,
    Tag,
    Wrench
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Icon mapping for categories
const iconMap: Record<string, any> = {
    "performance": Zap,
    "maintenance": Wrench,
    "brakes": Disc,
    "suspension": Maximize,
    "lighting": Lightbulb,
    "engine": Settings,
    "fluids": Droplets
};

// Color mapping for categories
const colorMap: Record<string, string> = {
    "performance": "bg-purple-50 text-purple-600",
    "maintenance": "bg-amber-50 text-amber-600",
    "brakes": "bg-red-50 text-red-600",
    "suspension": "bg-emerald-50 text-emerald-600",
    "lighting": "bg-orange-50 text-orange-600",
    "engine": "bg-blue-50 text-blue-600",
    "fluids": "bg-cyan-50 text-cyan-600"
};

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                const data = await res.json();
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="bg-surface-50 min-h-screen pt-24 pb-12 font-outfit">
            <div className="container mx-auto px-4">
                <div className="mb-16 border-b border-surface-200 pb-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-black tracking-tighter mb-4 text-surface-950 uppercase"
                    >
                        PART <span className="text-brand-600">CATEGORIES</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-surface-600 max-w-2xl text-lg font-medium"
                    >
                        Explore our comprehensive catalog organized by vehicle system to find exactly what you need.
                    </motion.p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="w-12 h-12 text-brand-600 animate-spin" />
                        <p className="text-surface-400 font-bold uppercase tracking-widest text-sm">Synchronizing Catalog...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((cat, i) => {
                            const IconComponent = iconMap[cat.slug] || Tag;
                            const colorClass = colorMap[cat.slug] || "bg-surface-50 text-surface-600";
                            
                            return (
                                <motion.div
                                    key={cat.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Link
                                        href={`/products?category=${cat.id}`}
                                        className="group block bg-white border border-surface-200 p-8 rounded-2xl hover:border-brand-600 hover:shadow-xl hover:shadow-brand-600/5 transition-all duration-300 h-full relative overflow-hidden"
                                    >
                                        <div className={`w-16 h-16 ${colorClass} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                                            <IconComponent size={32} />
                                        </div>

                                        <h2 className="text-3xl font-black text-surface-950 mb-3 uppercase tracking-tight group-hover:text-brand-600 transition-colors">
                                            {cat.name}
                                        </h2>

                                        <p className="text-surface-600 font-medium mb-8 line-clamp-2">
                                            {cat.description || "Explore high-quality components for your vehicle system."}
                                        </p>

                                        <div className="flex items-center justify-between text-sm font-black tracking-widest uppercase">
                                            <span className="text-surface-400 group-hover:text-brand-600 transition-colors italic">
                                                {cat._count?.products || 0} Products
                                            </span>
                                            <div className="w-10 h-10 rounded-full bg-surface-50 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-all">
                                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>

                                        {/* Abstract background element */}
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <IconComponent size={120} />
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
