/* eslint-disable */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { alerts } from "@/lib/alerts";
import { Truck, CreditCard, ShieldCheck, ChevronRight, Lock, ArrowLeft, CheckCircle2, Package, Landmark, Smartphone, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import Link from "next/link";
import { PriceDisplay } from "@/components/common/PriceDisplay";

type Step = "shipping" | "payment" | "bank_details" | "success";
type PaymentMethod = "PAYHERE" | "BANK_TRANSFER";

export default function CheckoutPage() {
    const [step, setStep] = useState<Step>("shipping");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PAYHERE");
    const [isProcessing, setIsProcessing] = useState(false);
    const [payhereReady, setPayhereReady] = useState(false);
    const items = useCartStore((state) => state.items);
    const clearCart = useCartStore((state) => state.clearCart);
    const [finalTotal, setFinalTotal] = useState(0);
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const [shippingData, setShippingData] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        zip: "",
    });

    useEffect(() => {
        // Load PayHere JS SDK (Sandbox)
        const script = document.createElement("script");
        script.src = "https://sandbox.payhere.lk/lib/payhere.js";
        script.async = true;
        script.onload = () => setPayhereReady(true);
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleOrderSubmission = async () => {
        setIsProcessing(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    shippingData,
                    total,
                    paymentMethod
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Order sequence failed.");

            if (paymentMethod === "PAYHERE" && data.payhereData) {
                if (!(window as any).payhere) {
                    throw new Error("PayHere SDK failed to initialize. Please refresh the page.");
                }

                setFinalTotal(total);

                // Trigger PayHere
                (window as any).payhere.onCompleted = function(orderId: string) {
                    clearCart();
                    setStep("success");
                    alerts.success("Payment Authorized Successfully!");
                };

                (window as any).payhere.onDismissed = function() {
                    setIsProcessing(false);
                    alerts.error("Payment sequence was dismissed.");
                };

                (window as any).payhere.onError = function(error: string) {
                    setIsProcessing(false);
                    alerts.error("Security Authentication Failed", error);
                };

                (window as any).payhere.startPayment(data.payhereData);
            } else {
                // Bank Transfer
                setFinalTotal(total);
                clearCart();
                setStep("bank_details");
                alerts.success("Order Registered. Awaiting Transfer.");
            }
        } catch (error: any) {
            console.error("Checkout Error:", error);
            alerts.error("Terminal Fault", error.message);
        } finally {
            if (paymentMethod === "BANK_TRANSFER") setIsProcessing(false);
        }
    };

    if (items.length === 0 && !["success", "bank_details"].includes(step)) {
        return (
            <div className="min-h-screen bg-surface-50 pt-32 pb-12 flex flex-col items-center justify-center container mx-auto px-4 text-center">
                <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center text-surface-200 mb-10 border border-surface-200 shadow-sm">
                    <Package size={56} />
                </div>
                <h1 className="text-5xl font-outfit font-black text-surface-950 uppercase mb-4 tracking-tighter">Your cart is empty</h1>
                <p className="text-surface-500 font-medium mb-12 max-w-sm italic text-lg leading-relaxed">Boost your vehicle's performance with our precision components before checking out.</p>
                <Link href="/products" className="apex-button">
                    Browse Catalog
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-50 pt-40 pb-24">
            <div className="container mx-auto px-4">
                <div className="max-w-7xl mx-auto">
                    {!["success", "bank_details"].includes(step) && (
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
                            <div className="flex items-center gap-6 bg-white p-3 rounded-2xl border border-surface-200 shadow-sm">
                                <div className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-500 ${step === "shipping" ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20" : "text-surface-400 font-bold"}`}>
                                    <Truck size={20} />
                                    <span className="font-black text-xs uppercase tracking-widest hidden sm:inline">Shipping</span>
                                </div>
                                <ChevronRight size={18} className="text-surface-200" />
                                <div className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-500 ${step === "payment" ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20" : "text-surface-400 font-bold"}`}>
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
                                        className="bg-white rounded-3xl p-10 md:p-16 border border-surface-200 shadow-sm"
                                    >
                                        <h2 className="text-3xl font-black text-surface-950 mb-12 uppercase tracking-tighter flex items-center gap-4">
                                            <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 shadow-inner">
                                                <Truck size={24} />
                                            </div>
                                            Logistics Destination
                                        </h2>

                                        <div className="grid grid-cols-2 gap-8 mb-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">First Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-surface-50 border-2 border-surface-100 rounded-xl px-8 py-5 focus:outline-none focus:border-brand-600 font-bold text-surface-950 transition-all font-outfit"
                                                    placeholder="e.g. Lewis"
                                                    value={shippingData.firstName}
                                                    onChange={e => setShippingData({ ...shippingData, firstName: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Last Name</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-surface-50 border-2 border-surface-100 rounded-xl px-8 py-5 focus:outline-none focus:border-brand-600 font-bold text-surface-950 transition-all font-outfit"
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
                                                    className="w-full bg-surface-50 border-2 border-surface-100 rounded-xl px-8 py-5 focus:outline-none focus:border-brand-600 font-bold text-surface-950 transition-all font-outfit"
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
                                                        className="w-full bg-surface-50 border-2 border-surface-100 rounded-xl px-8 py-5 focus:outline-none focus:border-brand-600 font-bold text-surface-950 transition-all font-outfit"
                                                        placeholder="Detroit"
                                                        value={shippingData.city}
                                                        onChange={e => setShippingData({ ...shippingData, city: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Zip / Postal</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-surface-50 border-2 border-surface-100 rounded-xl px-8 py-5 focus:outline-none focus:border-brand-600 font-bold text-surface-950 transition-all font-outfit"
                                                        placeholder="48201"
                                                        value={shippingData.zip}
                                                        onChange={e => setShippingData({ ...shippingData, zip: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => {
                                                if (!shippingData.firstName || !shippingData.address || !shippingData.city) {
                                                    alerts.error("Missing Logistics Data", "Please complete all shipping fields to proceed.");
                                                    return;
                                                }
                                                setStep("payment");
                                            }}
                                            className="apex-button w-full py-6 text-base"
                                        >
                                            Continue to Payment Selection <ChevronRight size={20} />
                                        </button>
                                    </motion.div>
                                )}

                                {step === "payment" && (
                                    <motion.div
                                        key="payment"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className="bg-white rounded-3xl p-10 md:p-16 border border-surface-200 shadow-sm"
                                    >
                                        <button
                                            onClick={() => setStep("shipping")}
                                            className="flex items-center gap-2 text-surface-400 hover:text-brand-600 font-black uppercase tracking-[0.2em] text-[10px] mb-10 transition-all group"
                                        >
                                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Modify Shipping
                                        </button>

                                        <h2 className="text-3xl font-black text-surface-950 mb-12 uppercase tracking-tighter flex items-center gap-4">
                                            <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 shadow-inner">
                                                <CreditCard size={24} />
                                            </div>
                                            Payment Protocol
                                        </h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                            <button
                                                onClick={() => setPaymentMethod("PAYHERE")}
                                                className={`p-10 rounded-2xl border-2 transition-all text-left flex flex-col gap-6 relative overflow-hidden group ${paymentMethod === "PAYHERE" ? "border-brand-600 bg-brand-50/30 shadow-lg" : "border-surface-100 hover:border-surface-200"}`}
                                            >
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod === "PAYHERE" ? "bg-brand-600 text-white" : "bg-surface-100 text-surface-400"}`}>
                                                    <Smartphone size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-surface-950 uppercase tracking-tight text-xl mb-2 font-outfit">PayHere Online</h3>
                                                    <p className="text-xs font-medium text-surface-500 italic">Credit Cards, Mobile Wallets, Net Banking (Instant Authorization)</p>
                                                </div>
                                                {paymentMethod === "PAYHERE" && <div className="absolute top-6 right-6 text-brand-600"><CheckCircle2 size={24} /></div>}
                                            </button>

                                            <button
                                                onClick={() => setPaymentMethod("BANK_TRANSFER")}
                                                className={`p-10 rounded-2xl border-2 transition-all text-left flex flex-col gap-6 relative overflow-hidden group ${paymentMethod === "BANK_TRANSFER" ? "border-brand-600 bg-brand-50/30 shadow-lg" : "border-surface-100 hover:border-surface-200"}`}
                                            >
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${paymentMethod === "BANK_TRANSFER" ? "bg-brand-600 text-white" : "bg-surface-100 text-surface-400"}`}>
                                                    <Landmark size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-surface-950 uppercase tracking-tight text-xl mb-2 font-outfit">Bank Transfer</h3>
                                                    <p className="text-xs font-medium text-surface-500 italic">Manual bank deposit or online transfer (Manual Verification)</p>
                                                </div>
                                                {paymentMethod === "BANK_TRANSFER" && <div className="absolute top-6 right-6 text-brand-600"><CheckCircle2 size={24} /></div>}
                                            </button>
                                        </div>

                                        <button
                                            onClick={handleOrderSubmission}
                                            disabled={isProcessing || (paymentMethod === "PAYHERE" && !payhereReady)}
                                            className="w-full py-6 bg-brand-600 hover:bg-brand-700 disabled:bg-surface-300 text-white font-black rounded-xl transition-all shadow-xl shadow-brand-600/20 uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95 text-base"
                                        >
                                            {isProcessing ? (
                                                <>INITIALIZING GATEWAY <Loader2 className="animate-spin" size={22} /></>
                                            ) : paymentMethod === "PAYHERE" && !payhereReady ? (
                                                <>SYNCHRONIZING SECURE GATEWAY <Loader2 className="animate-spin" size={22} /></>
                                            ) : (
                                                <>DEPLOY ORDER SEQUENCE <ShieldCheck size={22} /></>
                                            )}
                                        </button>
                                    </motion.div>
                                )}

                                {step === "bank_details" && (
                                    <motion.div
                                        key="bank_details"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white rounded-3xl p-16 md:p-24 border border-surface-200 shadow-2xl text-center"
                                    >
                                        <div className="w-32 h-32 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mx-auto mb-12 border border-brand-100 shadow-inner">
                                            <Landmark size={64} />
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-outfit font-black text-surface-950 uppercase tracking-tighter mb-6 leading-none">ORDER <span className="text-brand-600">PENDING</span></h2>
                                        <p className="text-surface-500 font-medium text-lg mb-12 max-w-sm mx-auto italic">To finalize your acquisition, please execute a bank transfer using the details below.</p>
                                        
                                        <div className="bg-surface-50 p-10 rounded-3xl border-2 border-dashed border-surface-200 text-left space-y-8 mb-12">
                                            <div className="flex justify-between items-center pb-6 border-b border-surface-200">
                                                <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Bank Entity</span>
                                                <span className="font-black text-surface-950 font-outfit uppercase tracking-tight">Apex Automotive Bank (PVT) Ltd</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-6 border-b border-surface-200">
                                                <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Account Number</span>
                                                <span className="font-black text-surface-950 font-outfit text-xl tracking-widest">009-1234567-001</span>
                                            </div>
                                            <div className="flex justify-between items-center pb-6 border-b border-surface-200">
                                                <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Swift / Branch</span>
                                                <span className="font-black text-surface-950 font-outfit uppercase tracking-tight">Kandy Main - 045</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Transfer Amount</span>
                                                <PriceDisplay amount={finalTotal} className="text-2xl font-black text-brand-600 font-outfit tracking-tighter" />
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                            <Link href="/products" className="apex-button px-12">
                                                Return to Catalog
                                            </Link>
                                            <Link href="/profile" className="px-12 py-5 bg-surface-950 hover:bg-black text-white font-black rounded-xl transition-all uppercase tracking-widest text-sm shadow-xl flex items-center justify-center gap-3">
                                                Order Status <Truck size={20} />
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}

                                {step === "success" && (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white rounded-3xl p-16 md:p-32 border border-surface-200 shadow-2xl text-center relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 inset-x-0 h-2 bg-emerald-500" />
                                        <div className="w-32 h-32 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-12 border border-emerald-100 shadow-inner">
                                            <CheckCircle2 size={64} className="animate-bounce" />
                                        </div>
                                        <h2 className="text-5xl md:text-7xl font-outfit font-black text-surface-950 uppercase tracking-tighter mb-6 leading-none">TRANSACTION <span className="text-emerald-600">SECURED</span></h2>
                                        <p className="text-surface-500 font-medium text-xl mb-16 max-w-sm mx-auto italic">Payment authorized successfully. Your order is now prioritized in the engineering queue. Amount: <PriceDisplay amount={finalTotal} /></p>

                                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                            <Link href="/products" className="apex-button px-12">
                                                Return to Shop
                                            </Link>
                                            <Link href="/profile" className="px-12 py-5 bg-surface-950 hover:bg-black text-white font-black rounded-xl transition-all uppercase tracking-widest text-sm shadow-xl flex items-center justify-center gap-3">
                                                Track Delivery <Truck size={20} />
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary Sidebar */}
                        {!["success", "bank_details"].includes(step) && (
                            <aside className="lg:col-span-4 sticky top-40">
                                <div className="bg-white rounded-3xl p-10 border border-surface-200 shadow-xl">
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
