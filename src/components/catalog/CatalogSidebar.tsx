"use client";

import { motion } from "framer-motion";
import { Search, X, SlidersHorizontal, ChevronDown, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const m = motion as any;

interface CatalogSidebarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    categories: any[];
    activeCategoryId: string | null;
    setActiveCategoryId: (id: string | null) => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;
}

export function CatalogSidebar({
    searchQuery,
    setSearchQuery,
    categories,
    activeCategoryId,
    setActiveCategoryId,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange
}: CatalogSidebarProps) {
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);

    const sortOptions = [
        { label: "Recommended", value: "newest" },
        { label: "Price: Low to High", value: "price_asc" },
        { label: "Price: High to Low", value: "price_desc" },
        { label: "Alphabetical", value: "alpha" }
    ];

    return (
        <aside className="w-full lg:w-80 shrink-0 space-y-10">
            {/* Search Box */}
            <div className="relative group p-1 bg-surface-200 rounded-xl focus-within:bg-brand-600/10 transition-colors">
                <div className="relative flex items-center bg-white rounded-xl overflow-hidden border border-surface-200 group-focus-within:border-brand-600 transition-all shadow-sm">
                    <Search className="absolute left-6 text-surface-400 group-focus-within:text-brand-600 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="SEARCH PARTS..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-16 pr-6 py-5 focus:outline-none font-black text-[10px] uppercase tracking-widest text-surface-950 placeholder:text-surface-300"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery("")}
                            className="absolute right-4 p-2 text-surface-400 hover:text-brand-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Sort Options - Desktop */}
            <div className="hidden lg:block space-y-6">
                <div className="flex items-center gap-3 text-surface-950 px-2">
                    <SlidersHorizontal size={18} className="text-brand-600" />
                    <h3 className="font-black text-xs uppercase tracking-[0.2em]">Engineering Sort</h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    {sortOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setSortBy(option.value)}
                            className={`flex items-center justify-between px-6 py-4 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${
                                sortBy === option.value 
                                ? "bg-surface-950 text-white border-surface-950 shadow-xl" 
                                : "bg-white text-surface-500 border-surface-200 hover:border-brand-600 hover:text-brand-600"
                            }`}
                        >
                            {option.label}
                            {sortBy === option.value && <CheckCircle2 size={14} className="text-brand-400" />}
                        </button>
                    ))}
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-6">
                <button 
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    className="w-full flex items-center justify-between text-surface-950 px-2"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-6 bg-brand-600 rounded-full" />
                        <h3 className="font-black text-xs uppercase tracking-[0.2em]">Component Sector</h3>
                    </div>
                    <ChevronDown size={18} className={`transition-transform duration-300 ${isCategoriesOpen ? "rotate-180" : ""}`} />
                </button>
                
                {isCategoriesOpen && (
                    <m.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-2"
                    >
                        <button
                            onClick={() => setActiveCategoryId(null)}
                            className={`px-6 py-4 rounded-xl border text-left text-[10px] font-black uppercase tracking-widest transition-all ${
                                !activeCategoryId 
                                ? "bg-brand-600 text-white border-brand-600 shadow-xl shadow-brand-600/20" 
                                : "bg-white text-surface-500 border-surface-100 hover:border-surface-300"
                            }`}
                        >
                            All Categories
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategoryId(category.id)}
                                className={`px-6 py-4 rounded-xl border text-left text-[10px] font-black uppercase tracking-widest transition-all ${
                                    activeCategoryId === category.id 
                                    ? "bg-brand-600 text-white border-brand-600 shadow-xl shadow-brand-600/20" 
                                    : "bg-white text-surface-500 border-surface-100 hover:border-surface-300 group"
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{category.name}</span>
                                    {activeCategoryId === category.id && <CheckCircle2 size={12} className="text-white/60" />}
                                </div>
                            </button>
                        ))}
                    </m.div>
                )}
            </div>

            {/* Price Filter - Simplified for now */}
            <div className="space-y-6 pt-6 border-t border-surface-200">
                <div className="flex items-center gap-3 text-surface-950 px-2">
                    <div className="w-2 h-6 bg-surface-950 rounded-full" />
                    <h3 className="font-black text-xs uppercase tracking-[0.2em]">Price Budget</h3>
                </div>
                <div className="px-2">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-surface-400">RANGE</span>
                        <span className="text-[10px] font-black text-brand-600">${priceRange[0]} - ${priceRange[1]}</span>
                    </div>
                    <div className="flex gap-4">
                        <input 
                            type="number" 
                            placeholder="Min"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                            className="w-1/2 bg-white border border-surface-200 rounded-xl px-4 py-3 text-[10px] font-bold focus:outline-none focus:border-brand-600"
                        />
                        <input 
                            type="number" 
                            placeholder="Max"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
                            className="w-1/2 bg-white border border-surface-200 rounded-xl px-4 py-3 text-[10px] font-bold focus:outline-none focus:border-brand-600"
                        />
                    </div>
                </div>
            </div>
        </aside>
    );
}
