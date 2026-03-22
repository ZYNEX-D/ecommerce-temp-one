"use client";

import { motion } from "framer-motion";
import { Box, RefreshCw } from "lucide-react";
import { ProductCard } from "./ProductCard";

const m = motion as any;

interface ProductGridProps {
    products: any[];
    loading: boolean;
}

export function ProductGrid({ products, loading }: ProductGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-[600px] bg-white rounded-2xl border border-surface-100 animate-pulse relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-surface-50 to-transparent skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <m.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full py-32 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-surface-200"
            >
                <div className="w-24 h-24 rounded-2xl bg-surface-100 flex items-center justify-center text-surface-250 mb-8 border border-surface-200">
                    <Box size={40} className="text-surface-300" />
                </div>
                <h3 className="text-2xl font-black text-surface-950 uppercase tracking-tight mb-2">Inventory Depleted</h3>
                <p className="text-surface-400 font-medium text-sm text-center max-w-xs uppercase tracking-widest leading-loose">
                    No components matching the specified engineering parameters found in our current matrix.
                </p>
            </m.div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {products.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
            ))}
        </div>
    );
}
