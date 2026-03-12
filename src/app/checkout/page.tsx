"use client";

import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Truck, CreditCard, ShieldCheck, ChevronRight, Lock, ArrowLeft, CheckCircle2, Package, Clock } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { PriceDisplay } from "@/components/common/PriceDisplay";

type Step = "shipping" | "payment" | "success";

export default function CheckoutPage() {
    const [step, setStep] = useState<Step>("shipping");
    const items = useCartStore((state) => state.items);
    const clearCart = useCartStore((state) => state.clearCart);
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const [shippingData, setShippingData] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        zip: "",
    });

    const handleComplete = () => {
        clearCart();
        setStep("success");
        toast.success("Order Placed Successfully!", {
            description: "Your AX- series components are being prepared for dispatch.",
            icon: <CheckCircle2 size={16} />
        });
    };

    if (items.length === 0 && step !== "success") {
        return (
            <div className="min-h-screen bg-surface-50 pt-32 pb-12 flex flex-col items-center justify-center container mx-auto px-4 text-center">
                <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center text-surface-200 mb-10 border border-surface-200 shadow-sm">
                    <Package size={56} />
                </div>
                <h1 className="text-5xl font-outfit font-black text-surface-950 uppercase mb-4 tracking-tighter">Your cart is empty</h1>
                <p className="text-surface-500 font-medium mb-12 max-w-sm italic text-lg leading-relaxed">Boost your vehicle's performance with our precision components before checking out.</p>
                <Link href="/products" className="apex-button">
                    Browse Performance Catalog
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-50 pt-40 pb-24">
            <div className="container mx-auto px-4">
                <div className="max-w-7xl mx-auto">
                    {step !== "success" && (
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                            <div>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2 text-brand-600 font-black uppercase tracking-[0.3em] text-[10px] mb-4"
                                >
                                    <Lock size={12} />
                                    <span>256-bit Secure Session</span>
                                </motion.div>
                                <h1 className="text-5xl md:text-7xl font-outfit font-black text-surface-950 uppercase tracking-tighter leading-none">SECURE <span className="text-brand-600">CHECKOUT</span></h1>
                            </div>

                            {/* Progress Stepper */}
                            <div className="flex items-center gap-6 bg-white p-3 rounded-3xl border border-surface-200 shadow-sm">
                                <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-500 ${step === "shipping" ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20" : "text-surface-400 font-bold"}`}>
                                    <Truck size={20} />
                                    <span className="font-black text-xs uppercase tracking-widest hidden sm:inline">Shipping</span>
                                </div>
                                <ChevronRight size={18} className="text-surface-200" />
                                <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-500 ${step === "payment" ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20" : "text-surface-400 font-bold"}`}>
                                    <CreditCard size={20} />
                                    <span className="font-black text-xs uppercase tracking-widest hidden sm:inline">Payment</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                        {/* Main Interaction Area */}
                        <div className="lg:col-span-8">
                            <AnimatePresence mode="wait">
                                {step === "shipping" && (
                                    <motion.div
                                        key="shipping"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className="bg-white rounded-[3rem] p-10 md:p-16 border border-surface-200 shadow-sm"
                                    >
                                        <h2 className="text-3xl font-black text-surface-950 mb-12 uppercase tracking-tighter flex items-center gap-4">
                                            <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 shadow-inner">
                                                <Truck size={24} />
                                            </div>
                                            Logistics Destination
                                        </h2>

                                        <div className="grid grid-cols-2 gap-8 mb-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">First Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-surface-50 border-2 border-surface-100 rounded-2xl px-8 py-5 focus:outline-none focus:border-brand-600 font-bold text-surface-950 transition-all"
                                                    placeholder="e.g. Lewis"
                                                    value={shippingData.firstName}
                                                    onChange={e => setShippingData({ ...shippingData, firstName: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Last Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-surface-50 border-2 border-surface-100 rounded-2xl px-8 py-5 focus:outline-none focus:border-brand-600 font-bold text-surface-950 transition-all"
                                                    placeholder="e.g. Hamilton"
                                                    value={shippingData.lastName}
                                                    onChange={e => setShippingData({ ...shippingData, lastName: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-8 mb-12">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Fleet Delivery Address</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-surface-50 border-2 border-surface-100 rounded-2xl px-8 py-5 focus:outline-none focus:border-brand-600 font-bold text-surface-950 transition-all"
                                                    placeholder="123 Performance Way"
                                                    value={shippingData.address}
                                                    onChange={e => setShippingData({ ...shippingData, address: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">City</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-surface-50 border-2 border-surface-100 rounded-2xl px-8 py-5 focus:outline-none focus:border-brand-600 font-bold text-surface-950 transition-all"
                                                        placeholder="Detroit"
                                                        value={shippingData.city}
                                                        onChange={e => setShippingData({ ...shippingData, city: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Zip / Postal</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-surface-50 border-2 border-surface-100 rounded-2xl px-8 py-5 focus:outline-none focus:border-brand-600 font-bold text-surface-950 transition-all"
                                                        placeholder="48201"
                                                        value={shippingData.zip}
                                                        onChange={e => setShippingData({ ...shippingData, zip: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setStep("payment")}
                                            className="apex-button w-full py-6 text-base"
                                        >
                                            Continue to Payment Gateway <ChevronRight size={20} />
                                        </button>
                                    </motion.div>
                                )}

                                {step === "payment" && (
                                    <motion.div
                                        key="payment"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className="bg-white rounded-[3rem] p-10 md:p-16 border border-surface-200 shadow-sm"
                                    >
                                        <button
                                            onClick={() => setStep("shipping")}
                                            className="flex items-center gap-2 text-surface-400 hover:text-brand-600 font-black uppercase tracking-[0.2em] text-[10px] mb-10 transition-all group"
                                        >
                                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Modify Shipping
                                        </button>

                                        <h2 className="text-3xl font-black text-surface-950 mb-12 uppercase tracking-tighter flex items-center gap-4">
                                            <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 shadow-inner">
                                                <CreditCard size={24} />
                                            </div>
                                            Secure Payment Gateway
                                        </h2>

                                        <div className="space-y-10 mb-12">
                                            <div className="p-10 bg-surface-950 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
                                                <div className="absolute top-0 right-0 p-12 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform duration-1000">
                                                    <CreditCard size={200} />
                                                </div>
                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-start mb-20">
                                                        <div className="w-16 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl" />
                                                        <span className="font-outfit font-black text-3xl italic tracking-tighter text-brand-500">APEX SECURE</span>
                                                    </div>
                                                    <p className="text-3xl md:text-4xl font-mono tracking-[0.3em] mb-8">•••• •••• •••• 4012</p>
                                                    <div className="flex justify-between items-end">
                                                        <div>
                                                            <p className="text-[10px] uppercase tracking-widest opacity-40 mb-2 font-black">Authorized Holder</p>
                                                            <p className="font-black tracking-widest text-xl uppercase font-outfit">{shippingData.firstName || "PERFORMANCE"} {shippingData.lastName || "CLIENT"}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[10px] uppercase tracking-widest opacity-40 mb-2 font-black">Valid Thru</p>
                                                            <p className="font-black tracking-widest text-xl font-outfit">12 / 28</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-8">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Card Number</label>
                                                    <input readOnly type="text" className="w-full bg-surface-50 border-2 border-surface-100 rounded-2xl px-8 py-5 font-black text-surface-950" value="•••• •••• •••• 4012" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Expiry</label>
                                                        <input readOnly type="text" className="w-full bg-surface-50 border-2 border-surface-100 rounded-2xl px-8 py-5 font-black text-surface-950" value="12/28" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">CVV</label>
                                                        <input readOnly type="password" className="w-full bg-surface-50 border-2 border-surface-100 rounded-2xl px-8 py-5 font-black text-surface-950" value="•••" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleComplete}
                                            className="w-full py-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-emerald-600/20 uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 text-base"
                                        >
                                            AUTHORIZE PAYMENT <ShieldCheck size={22} />
                                        </button>
                                        <div className="flex items-center justify-center gap-4 mt-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                                            <div className="h-6 w-12 bg-surface-200 rounded" />
                                            <div className="h-6 w-12 bg-surface-200 rounded" />
                                            <div className="h-6 w-12 bg-surface-200 rounded" />
                                        </div>
                                    </motion.div>
                                )}

                                {step === "success" && (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white rounded-[4rem] p-16 md:p-32 border border-surface-200 shadow-2xl text-center relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 inset-x-0 h-2 bg-emerald-500" />
                                        <div className="w-32 h-32 bg-emerald-50 rounded-[3rem] flex items-center justify-center text-emerald-600 mx-auto mb-12 border border-emerald-100 shadow-inner">
                                            <CheckCircle2 size={64} className="animate-bounce" />
                                        </div>
                                        <h2 className="text-5xl md:text-7xl font-outfit font-black text-surface-950 uppercase tracking-tighter mb-6 leading-none">ORDER <span className="text-emerald-600">CONFIRMED</span></h2>
                                        <p className="text-surface-500 font-medium text-xl mb-16 max-w-sm mx-auto italic">High-performance components secured. Order #AX-90210 is now entering the logistics queue.</p>

                                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                            <Link href="/products" className="apex-button px-12">
                                                Return to Shop
                                            </Link>
                                            <Link href="/profile" className="px-12 py-5 bg-surface-950 hover:bg-black text-white font-black rounded-2xl transition-all uppercase tracking-widest text-sm shadow-xl flex items-center justify-center gap-3">
                                                Track Delivery <Truck size={20} />
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary Sidebar */}
                        {step !== "success" && (
                            <aside className="lg:col-span-4 sticky top-40">
                                <div className="bg-white rounded-[3rem] p-10 border border-surface-200 shadow-xl">
                                    <h3 className="text-2xl font-black text-surface-950 mb-10 uppercase tracking-tighter font-outfit">Manifest Summary</h3>

                                    <div className="space-y-8 mb-10 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex gap-6 group">
                                                <div className="w-20 h-20 bg-surface-50 rounded-2xl overflow-hidden border border-surface-100 shrink-0 group-hover:border-brand-500 transition-colors">
                                                    <Image src={item.image} alt={item.name} width={80} height={80} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 py-1">
                                                    <p className="font-black text-surface-950 text-sm uppercase tracking-tight font-outfit line-clamp-1">{item.name}</p>
                                                    <p className="text-[10px] text-surface-400 font-black uppercase tracking-[0.2em] mt-1">Batch Qty: {item.quantity}</p>
                                                    <PriceDisplay amount={item.price * item.quantity} className="text-lg font-black text-brand-600 font-outfit mt-2 block" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-5 pt-10 border-t-2 border-dashed border-surface-100">
                                        <div className="flex justify-between text-[10px] font-black text-surface-400 uppercase tracking-[0.3em]">
                                            <span>Subtotal</span>
                                            <PriceDisplay amount={total} />
                                        </div>
                                        <div className="flex justify-between text-[10px] font-black text-surface-400 uppercase tracking-[0.3em]">
                                            <span>Logistic Fee</span>
                                            <span className="text-emerald-600">COMPLIMENTARY</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-6 border-t border-surface-950">
                                            <span className="text-2xl font-black text-surface-950 uppercase tracking-tighter font-outfit">Total AMT</span>
                                            <PriceDisplay amount={total} className="text-4xl font-black text-surface-950 tracking-tighter font-outfit" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-10 flex flex-col items-center gap-4 text-surface-400 font-black text-[10px] uppercase tracking-[0.3em]">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck size={20} className="text-emerald-500" />
                                        Apex Buyer Protection Active
                                    </div>
                                    <div className="w-12 h-1 bg-surface-200 rounded-full" />
                                </div>
                            </aside>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
