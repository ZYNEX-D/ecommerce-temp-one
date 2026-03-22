"use client";

import { motion, AnimatePresence } from "framer-motion";
import { alerts } from "@/lib/alerts";
import { X, ShoppingBag, ShoppingCart, ArrowRight, Trash2, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { PriceDisplay } from "@/components/common/PriceDisplay";

export function CartDrawer() {
    const { items, isCartOpen, setCartOpen, removeItem, updateQuantity } = useCartStore();

    const handleRemove = (id: string, name: string) => {
        removeItem(id);
        alerts.toast(`${name} removed from cart.`);
    };

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setCartOpen(false)}
                        className="fixed inset-0 bg-surface-950/60 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 h-full w-full max-w-lg bg-white z-50 flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.2)] rounded-l-3xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-10 border-b border-surface-100">
                            <h2 className="font-outfit text-3xl font-black tracking-tighter text-surface-950 flex items-center gap-2 uppercase">
                                <span className="text-brand-600">APEX</span> CART
                            </h2>
                            <button
                                onClick={() => setCartOpen(false)}
                                className="w-12 h-12 flex items-center justify-center hover:bg-surface-50 rounded-xl transition-all text-surface-400 hover:text-surface-950 border border-transparent hover:border-surface-200"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-10 flex flex-col gap-8 scrollbar-hide">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="w-32 h-32 rounded-2xl border-2 border-dashed border-surface-200 flex items-center justify-center mb-8 bg-surface-50">
                                        <ShoppingBag className="w-12 h-12 text-surface-200" />
                                    </div>
                                    <p className="font-outfit text-2xl font-black text-surface-950 uppercase tracking-tighter mb-4">Your cart is empty</p>
                                    <p className="text-surface-500 font-medium max-w-[240px] mb-8 italic">Ready to power your performance? Start shopping our premium catalog.</p>
                                    <button
                                        onClick={() => setCartOpen(false)}
                                        className="text-brand-600 hover:text-brand-700 font-black text-sm tracking-[0.2em] uppercase transition-all flex items-center gap-2 group"
                                    >
                                        Return to shop <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex gap-6 bg-white p-6 rounded-xl border border-surface-100 group hover:border-brand-500 hover:shadow-xl transition-all duration-500 relative"
                                    >
                                        <div className="relative w-28 h-28 bg-surface-50 rounded-xl overflow-hidden shrink-0 border border-surface-100">
                                            <Image
                                                src={item.image || "/placeholder.svg"}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div className="flex justify-between items-start">
                                                <div className="max-w-[180px]">
                                                    <h3 className="font-black text-surface-950 text-lg line-clamp-1 uppercase tracking-tight font-outfit">{item.name}</h3>
                                                    <PriceDisplay amount={item.price} className="text-brand-600 font-black text-xl mt-1 font-outfit" />
                                                </div>
                                                <button
                                                    onClick={() => handleRemove(item.id, item.name)}
                                                    className="w-10 h-10 flex items-center justify-center text-surface-300 hover:text-red-600 transition-all hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-4 bg-surface-50 rounded-xl w-fit p-1.5 border border-surface-100">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="w-8 h-8 flex items-center justify-center text-surface-400 hover:text-brand-600 hover:bg-white rounded-lg transition-all"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="text-lg font-black w-6 text-center text-surface-950 font-outfit">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-surface-400 hover:text-brand-600 hover:bg-white rounded-lg transition-all"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-10 border-t border-surface-100 bg-surface-50/50 backdrop-blur-md">
                                <div className="flex justify-between items-end mb-10">
                                    <div className="flex flex-col">
                                        <span className="text-surface-400 uppercase tracking-[0.3em] text-[10px] font-black mb-1">Estimated Total</span>
                                        <span className="text-surface-400 text-xs font-medium italic">VAT and shipping calculated at checkout</span>
                                    </div>
                                    <PriceDisplay amount={total} className="font-outfit text-5xl font-black text-surface-950 tracking-tighter" />
                                </div>
                                <Link
                                    href="/checkout"
                                    onClick={() => setCartOpen(false)}
                                    className="apex-button py-6 text-lg"
                                >
                                    <span>PROCEED TO SECURE CHECKOUT</span>
                                    <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                                </Link>
                                <p className="text-center text-[10px] text-surface-400 font-bold uppercase tracking-[0.2em] mt-6">
                                    Guaranteed Secure Transaction
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
