/* eslint-disable */
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap, Target, Box, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PriceDisplay } from "@/components/common/PriceDisplay";

const m = motion as any;

const products = [
    {
        id: "1",
        name: "Premium Ceramic Brake Pads",
        price: 89.99,
        description: "High-performance ceramic compound engineered for stopping power and low dust.",
        image: "https://images.unsplash.com/photo-1598083842605-7af83fb18ebd?auto=format&fit=crop&q=80&w=800",
        category: "Brakes"
    },
    {
        id: "2",
        name: "Synthetic Motor Oil 5W-30",
        price: 34.99,
        description: "Full synthetic motor oil designed for optimal engine protection and performance.",
        image: "https://images.unsplash.com/photo-1610493864198-4eabd27df61a?auto=format&fit=crop&q=80&w=800",
        category: "Fluids"
    },
    {
        id: "3",
        name: "Performance Air Filter",
        price: 45.99,
        description: "High-flow cotton gauze air filter for increased horsepower and acceleration.",
        image: "https://images.unsplash.com/photo-1610493863481-9b7e779a543f?auto=format&fit=crop&q=80&w=800",
        category: "Engine"
    }
];

export function Hero() {
    return (
        <div className="relative min-h-[90vh] flex flex-col justify-center pt-32 pb-20 overflow-hidden bg-surface-50 font-outfit">
            {/* Clean Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] bg-brand-50 rounded-full blur-[120px] opacity-40" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-surface-100 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center mt-8">
                <m.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-surface-200 text-surface-600 font-bold text-xs mb-8 shadow-sm uppercase tracking-widest"
                >
                    <Target size={14} className="text-brand-600" />
                    <span>PREMIUM AUTO SPARES</span>
                </m.div>

                <m.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-6xl md:text-9xl font-black tracking-tighter mb-6 leading-[0.85] text-surface-950 uppercase"
                >
                    POWER YOUR<br />
                    <span className="text-brand-600 neon-text">
                        PERFORMANCE
                    </span>
                </m.h1>

                <m.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl md:text-2xl text-surface-500 max-w-3xl mb-12 font-medium leading-relaxed italic"
                >
                    Engineered for durability. Designed for speed. Discover our curated catalog of precision automotive components.
                </m.p>

                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-6"
                >
                    <Link href="/products" className="apex-button min-w-[240px]">
                        SHOP CATALOG <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="/categories" className="px-8 py-4 bg-white border border-surface-200 hover:border-brand-600 text-surface-950 font-black rounded-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-sm uppercase tracking-widest text-sm min-w-[240px]">
                        VIEW CATEGORIES
                    </Link>
                </m.div>

                {/* Stats / Features */}
                <m.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full max-w-5xl text-left"
                >
                    {[
                        { icon: Zap, title: "Fast Shipping", desc: "Same-day dispatch nationwide" },
                        { icon: Target, title: "Exact Fitment", desc: "Guaranteed compatibility" },
                        { icon: Box, title: "Quality Assured", desc: "Exceeding OEM standards" },
                    ].map((feature, idx) => (
                        <div key={idx} className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-surface-200 hover:border-brand-300 transition-all group hover:bg-white hover:shadow-xl">
                            <div className="w-14 h-14 rounded-xl bg-brand-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                                <feature.icon size={28} className="text-brand-600 group-hover:text-white" />
                            </div>
                            <h3 className="text-2xl font-black text-surface-950 mb-3 uppercase tracking-tight">{feature.title}</h3>
                            <p className="text-surface-500 font-medium leading-relaxed italic">{feature.desc}</p>
                        </div>
                    ))}
                </m.div>
            </div>
        </div>
    );
}

export function FeaturedProducts() {
    return (
        <section className="py-32 relative z-10 bg-white font-outfit">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-surface-950 mb-4 uppercase">
                            NEW <span className="text-brand-600">ARRIVALS</span>
                        </h2>
                        <p className="text-surface-500 font-medium text-xl max-w-xl">Precision-engineered additions to our high-performance catalog.</p>
                    </div>
                    <Link href="/products" className="apex-button px-6 py-3 bg-surface-950 hover:bg-black">
                        View All Parts <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {products.map((product, idx) => (
                        <m.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="apex-card group"
                        >
                            <div className="relative h-80 overflow-hidden bg-surface-100">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute top-6 right-6 z-20 bg-surface-950 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                    {product.category}
                                </div>
                            </div>

                            <div className="p-10 relative">
                                <h3 className="text-2xl font-black text-surface-950 mb-4 leading-tight group-hover:text-brand-600 transition-colors uppercase tracking-tight">
                                    {product.name}
                                </h3>
                                <p className="text-surface-500 text-base mb-10 line-clamp-2 font-medium leading-relaxed italic">
                                    {product.description}
                                </p>

                                <div className="flex items-center justify-between border-t border-surface-100 pt-8">
                                    <PriceDisplay amount={product.price} className="text-4xl font-black text-surface-950" />
                                    <Link href={`/products/${product.id}`} className="w-14 h-14 bg-brand-600 hover:bg-brand-700 text-white rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg shadow-brand-600/20 active:scale-90">
                                        <ShoppingCart size={24} />
                                    </Link>
                                </div>
                            </div>
                        </m.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
