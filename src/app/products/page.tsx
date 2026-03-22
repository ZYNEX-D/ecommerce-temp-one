"use client";

import { motion } from "framer-motion";
import { alerts } from "@/lib/alerts";
import { ShoppingCart, Loader2, Target, Box, Search, X } from "lucide-react";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useCartStore } from "@/store/cartStore";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PriceDisplay } from "@/components/common/PriceDisplay";

const m = motion as any;

function ProductsContent() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    
    const searchParams = useSearchParams();
    const router = useRouter();
    const categoryId = searchParams.get('category');
    
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    fetch('/api/products'),
                    fetch('/api/categories')
                ]);
                
                const [prodData, catData] = await Promise.all([
                    prodRes.json(),
                    catRes.json()
                ]);

                if (Array.isArray(prodData)) setProducts(prodData);
                if (Array.isArray(catData)) setCategories(catData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                alerts.error("Failed to load catalog data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const activeCategory = useMemo(() => {
        if (!categoryId) return null;
        return categories.find(c => c.id === categoryId);
    }, [categories, categoryId]);

    const filteredProducts = useMemo(() => {
        let filtered = products;

        // Filter by Category
        if (categoryId) {
            filtered = filtered.filter(p => p.categoryId === categoryId);
        }

        // Filter by Search Query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.description.toLowerCase().includes(query) ||
                p.category?.name?.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [products, searchQuery, categoryId]);

    const clearFilters = () => {
        setSearchQuery("");
        router.push('/products');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-16 h-16 text-brand-600 animate-spin" />
                    <span className="font-black uppercase tracking-[0.3em] text-surface-400">Loading Catalog</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-24 min-h-screen bg-surface-50 font-outfit">
            <div className="mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-12">
                <div className="max-w-3xl">
                    <m.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-brand-600 font-black uppercase tracking-[0.3em] text-xs mb-4"
                    >
                        <Target size={14} />
                        <span>Apex Performance Parts</span>
                    </m.div>
                    <m.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-surface-950 uppercase leading-[0.85]"
                    >
                        {activeCategory ? (
                            <>
                                {activeCategory.name.split(' ')[0]} <span className="text-brand-600">{activeCategory.name.split(' ').slice(1).join(' ') || 'PARTS'}</span>
                            </>
                        ) : (
                            <>AUTO <span className="text-brand-600">CATALOG</span></>
                        )}
                    </m.h1>
                    
                    <div className="flex flex-wrap gap-4 items-center">
                        <m.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-surface-500 max-w-xl text-xl font-medium leading-relaxed"
                        >
                            {activeCategory 
                                ? activeCategory.description 
                                : "Browse our full range of precision-calibrated components, from high-tensile brakes to high-performance filters."
                            }
                        </m.p>
                        
                        {activeCategory && (
                            <m.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={clearFilters}
                                className="flex items-center gap-2 px-4 py-2 bg-surface-200 hover:bg-surface-300 text-surface-700 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                            >
                                <X size={14} />
                                <span>Clear Category</span>
                            </m.button>
                        )}
                    </div>
                </div>

                <div className="w-full lg:w-96">
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-surface-300 group-focus-within:text-brand-600 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search part ID or name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-surface-200 rounded-xl pl-16 pr-8 py-5 focus:outline-none focus:border-brand-600 focus:ring-4 focus:ring-brand-600/5 transition-all font-bold text-surface-950 shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <m.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-32 rounded-3xl border-2 border-dashed border-surface-200 bg-white/50"
                >
                    <Box className="w-20 h-20 text-surface-200 mx-auto mb-6" />
                    <p className="text-surface-400 font-black text-2xl uppercase tracking-widest">No matching components found</p>
                    <button onClick={clearFilters} className="mt-6 text-brand-600 font-black uppercase tracking-widest text-sm hover:underline">Clear All Filters</button>
                </m.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredProducts.map((product, idx) => (
                        <m.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: idx * 0.05 }}
                            className="apex-card group overflow-hidden bg-white border border-surface-200 rounded-[2.5rem] hover:border-brand-600 hover:shadow-2xl hover:shadow-brand-600/10 transition-all duration-500"
                        >
                            <Link href={`/products/${product.id}`} className="block relative h-80 overflow-hidden shrink-0 bg-surface-100">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute top-6 right-6 z-20 bg-surface-950 text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
                                    {product.category?.name || 'General'}
                                </div>
                            </Link>

                            <div className="p-10 flex flex-col flex-1">
                                <Link href={`/products/${product.id}`}>
                                    <h2 className="text-2xl font-black text-surface-950 mb-4 line-clamp-2 group-hover:text-brand-600 transition-colors uppercase tracking-tight">
                                        {product.name}
                                    </h2>
                                </Link>
                                <p className="text-surface-500 font-medium text-base mb-10 flex-1 line-clamp-3 leading-relaxed">
                                    {product.description}
                                </p>

                                <div className="flex items-center justify-between mt-auto pt-8 border-t border-surface-100">
                                    <PriceDisplay amount={product.price} className="text-4xl font-black text-surface-950" />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addItem(product);
                                            alerts.toast(`${product.name} added to cart!`);
                                        }}
                                        className="w-14 h-14 bg-brand-600 hover:bg-brand-700 text-white rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg shadow-brand-600/20 active:scale-90"
                                    >
                                        <ShoppingCart size={24} />
                                    </button>
                                </div>
                            </div>
                        </m.div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-surface-50">
                <Loader2 className="w-16 h-16 text-brand-600 animate-spin" />
            </div>
        }>
            <ProductsContent />
        </Suspense>
    );
}
