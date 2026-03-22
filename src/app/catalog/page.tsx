"use client";

import { motion } from "framer-motion";
import { Loader2, Zap, Target, ArrowRight } from "lucide-react";
import { useState, useEffect, useMemo, Suspense } from "react";
import { CatalogSidebar } from "@/components/catalog/CatalogSidebar";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { alerts } from "@/lib/alerts";

const m = motion as any;

function CatalogContent() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Filter & Sort State
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState("newest");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

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
                alerts.error("CRITICAL: SENSOR DATA OFFLINE");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products];

        // Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.description.toLowerCase().includes(query) ||
                p.sku?.toLowerCase().includes(query)
            );
        }

        // Category
        if (activeCategoryId) {
            result = result.filter(p => p.categoryId === activeCategoryId);
        }

        // Price
        result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

        // Sort
        switch (sortBy) {
            case "price_asc":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price_desc":
                result.sort((a, b) => b.price - a.price);
                break;
            case "alpha":
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "newest":
            default:
                result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
        }

        return result;
    }, [products, searchQuery, activeCategoryId, sortBy, priceRange]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-50">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <Loader2 className="w-20 h-20 text-brand-600 animate-spin" />
                        <Zap className="absolute inset-0 m-auto w-8 h-8 text-brand-600 animate-pulse" />
                    </div>
                    <span className="font-black uppercase tracking-[0.5em] text-surface-400 text-xs text-center">
                        Initializing Apex<br />Neural Interface
                    </span>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-surface-100 font-outfit pt-32 pb-20">
            {/* Catalog Hero */}
            <div className="container mx-auto px-4 mb-20">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-surface-200 pb-16">
                    <div className="max-w-4xl">
                        <m.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 text-brand-600 font-black uppercase tracking-[0.4em] text-[10px] mb-6"
                        >
                            <Target size={16} />
                            <span>Precision Component Matrix v4.2</span>
                        </m.div>
                        <m.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "circOut" }}
                            className="text-7xl md:text-[9rem] font-black tracking-tighter text-surface-950 uppercase leading-[0.75] mb-8"
                        >
                            THE <span className="text-brand-600 drop-shadow-[0_10px_30px_rgba(220,38,38,0.2)]">CATALOG</span>
                        </m.h1>
                        <m.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-surface-500 max-w-2xl text-xl font-medium leading-relaxed tracking-tight"
                        >
                            Access our full spectrum of high-velocity engineering assets. Every component is stress-tested beyond industrial standards for maximum tactical efficiency.
                        </m.p>
                    </div>

                    <m.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-8 rounded-2xl border border-surface-200 shadow-xl hidden xl:block"
                    >
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-surface-400 mb-1">Matrix Online</span>
                                <span className="text-2xl font-black text-surface-950">{products.length} ASSETS</span>
                            </div>
                            <div className="w-px h-12 bg-surface-100" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-surface-400 mb-1">System Load</span>
                                <span className="text-2xl font-black text-brand-600">OPTIMIZED</span>
                            </div>
                        </div>
                    </m.div>
                </div>
            </div>

            {/* Main Catalog Layout */}
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Sidebar Filters */}
                    <CatalogSidebar 
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        categories={categories}
                        activeCategoryId={activeCategoryId}
                        setActiveCategoryId={setActiveCategoryId}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        priceRange={priceRange}
                        setPriceRange={setPriceRange}
                    />

                    {/* Product Feed */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-10 text-[10px] font-black uppercase tracking-[0.3em] text-surface-400">
                            <span>Showing {filteredAndSortedProducts.length} Results</span>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
                                <span>Real-time Filtering Active</span>
                            </div>
                        </div>
                        
                        <ProductGrid 
                            products={filteredAndSortedProducts} 
                            loading={loading} 
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function CatalogPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-surface-50">
                <Loader2 className="w-16 h-16 text-brand-600 animate-spin" />
            </div>
        }>
            <CatalogContent />
        </Suspense>
    );
}
