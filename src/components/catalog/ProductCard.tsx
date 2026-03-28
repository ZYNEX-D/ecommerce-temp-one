"use client";

import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight, Activity, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import { useCartStore } from "@/store/cartStore";
import { alerts } from "@/lib/alerts";

const m = motion as any;

interface ProductCardProps {
    product: any;
    index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);

    return (
        <m.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            className="group relative flex flex-col bg-white rounded-xl border border-surface-100 hover:border-brand-600 hover:shadow-[0_20px_50px_rgba(220,38,38,0.1)] transition-all duration-700 overflow-hidden"
        >
            {/* Header / Badges */}
            <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start pointer-events-none">
                <div className="flex flex-col gap-2">
                    <span className="bg-surface-950/90 backdrop-blur-md text-white px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] shadow-xl border border-white/10 flex items-center gap-2">
                        <Activity size={10} className="text-brand-500" />
                        {product.category?.name || "Premium Component"}
                    </span>
                    {product.stock > 0 && product.stock <= 5 && (
                        <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg">
                            Critical Stock: {product.stock}
                        </span>
                    )}
                </div>
                <div className="bg-white/90 backdrop-blur-md text-surface-950 p-2 rounded-xl border border-surface-200 shadow-xl group-hover:bg-brand-600 group-hover:text-white transition-colors duration-500">
                    <Zap size={14} className={product.stock > 0 ? "text-brand-600 group-hover:text-white" : "text-surface-300"} />
                </div>
            </div>

            {/* Image Container */}
            <Link 
                href={`/products/${product.slug}`} 
                className="relative h-96 overflow-hidden bg-surface-50 flex items-center justify-center p-12"
            >
                <m.div
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative w-full h-full"
                >
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain drop-shadow-2xl grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                    />
                </m.div>
                
                {/* Overlay with Quick View hint */}
                <div className="absolute inset-0 bg-brand-600/0 group-hover:bg-brand-600/5 transition-all duration-700 pointer-events-none" />
            </Link>

            {/* Content */}
            <div className="p-10 flex flex-col flex-1 relative bg-white">
                <div className="mb-4">
                    <span className="text-[8px] font-black text-surface-300 uppercase tracking-[0.3em] mb-1 block leading-none">
                        APEX-SPEC-{product.sku || "UNKN"}
                    </span>
                    <h2 className="text-2xl font-black text-surface-950 uppercase tracking-tight group-hover:text-brand-600 transition-colors line-clamp-2 leading-[1.1]">
                        {product.name}
                    </h2>
                </div>

                <p className="text-surface-400 font-medium text-xs mb-10 line-clamp-2 leading-relaxed tracking-wide">
                    {product.description}
                </p>

                <div className="mt-auto space-y-6">
                    <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black text-surface-300 uppercase tracking-[0.2em] mb-1">MSRP-VALUATION</span>
                            <PriceDisplay amount={product.price} className="text-4xl font-black text-surface-950 tracking-tighter" />
                        </div>
                        
                        <m.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                addItem(product);
                                alerts.toast(`${product.name} SECURED`);
                            }}
                            className="w-16 h-16 bg-surface-950 hover:bg-brand-600 text-white rounded-xl flex items-center justify-center transition-all duration-500 shadow-2xl shadow-surface-950/20 active:bg-brand-700 group/btn"
                        >
                            <ShoppingCart size={24} className="group-hover/btn:rotate-12 transition-transform" />
                        </m.button>
                    </div>

                    <Link 
                        href={`/products/${product.slug}`}
                        className="flex items-center justify-center gap-3 w-full py-4 border-2 border-surface-100 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-surface-400 hover:text-brand-600 hover:border-brand-600/20 hover:bg-surface-50 transition-all duration-300"
                    >
                        Detailed Specs
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
            
            {/* Decoration line */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-100 group-hover:bg-brand-600 transition-colors duration-700" />
        </m.div>
    );
}
