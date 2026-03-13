"use client";

import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import { User, Package, MapPin, Clock, ArrowRight, LogOut, Loader2, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PriceDisplay } from "@/components/common/PriceDisplay";
import Link from "next/link";

const m = motion as any;

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const user = session?.user as any;
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    useEffect(() => {
        const fetchUserOrders = async () => {
            if (!user?.id) return;
            try {
                const res = await fetch(`/api/orders?userId=${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setOrders(data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user orders:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) fetchUserOrders();
    }, [user?.id]);

    const handleSignOut = () => {
        toast.promise(signOut({ callbackUrl: "/" }), {
            loading: "Logging out of security session...",
            success: "Session terminated successfully.",
            error: "Failed to logout. Please try again."
        });
    };

    if (status === "loading" || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-50">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="w-16 h-16 text-brand-600 animate-spin" />
                    <span className="font-black uppercase tracking-[0.4em] text-surface-400 text-xs animate-pulse">Synchronizing Profile</span>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-surface-50 pt-40 pb-24">
            <div className="container mx-auto px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

                        {/* Sidebar / Info */}
                        <aside className="lg:col-span-4 space-y-12">
                            <m.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-[3rem] p-10 border border-surface-200 shadow-xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600" />
                                
                                <div className="flex flex-col items-center text-center mb-10">
                                    <div className="w-32 h-32 bg-surface-950 rounded-[2.5rem] flex items-center justify-center text-white font-black text-5xl mb-6 relative shadow-2xl group transition-transform hover:scale-105 duration-500">
                                        {user.name ? user.name[0].toUpperCase() : "U"}
                                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 border-[6px] border-white rounded-full shadow-lg"></div>
                                        <div className="absolute inset-0 rounded-[2.5rem] bg-brand-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center text-6xl">
                                            {user.name ? user.name[0].toUpperCase() : "U"}
                                        </div>
                                    </div>
                                    <h1 className="text-3xl font-black text-surface-950 uppercase tracking-tighter leading-none mb-2 font-outfit">{user.name}</h1>
                                    <div className="text-brand-600 font-black text-[10px] uppercase tracking-[0.2em] bg-brand-50 px-4 py-1 rounded-full mb-4">Apex Premium Member</div>
                                    <p className="text-surface-400 font-bold lowercase tracking-tight italic">{user.email}</p>
                                </div>

                                <div className="space-y-4 pt-8 border-t border-surface-100">
                                    <div className="flex items-center gap-4 p-5 bg-surface-50 rounded-2xl border border-surface-100 transition-all hover:border-surface-200 group">
                                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-surface-200 shadow-sm group-hover:text-brand-600 group-hover:rotate-12 transition-all">
                                            <Package size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-surface-400">Inventory Orders</div>
                                            <div className="font-black text-xl text-surface-950 font-outfit">{orders.length} Units</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-5 text-surface-400 px-8">
                                        <Clock size={16} />
                                        <div className="text-[10px] font-black uppercase tracking-widest flex-1">Registration Date</div>
                                        <div className="text-[10px] font-black text-surface-950">MAR 2024</div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSignOut}
                                    className="w-full mt-10 py-5 bg-surface-50 hover:bg-black hover:text-white text-surface-950 font-black rounded-2xl transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[10px] border border-surface-200 group active:scale-95 shadow-sm"
                                >
                                    <LogOut size={16} className="group-hover:translate-x-1 transition-transform" /> TERMINATE SESSION
                                </button>
                            </m.div>

                            <div className="bg-surface-950 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl">
                                <div className="absolute -top-10 -right-10 p-12 opacity-5 transform rotate-12 group-hover:scale-125 transition-transform duration-1000">
                                    <Package size={240} />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-500">Tier Status: Apex Silver</span>
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 font-outfit">PERFORMANCE LOYALTY</h3>
                                    <p className="text-surface-400 text-sm font-medium mb-10 leading-relaxed italic">You are currently <span className="text-white font-bold">2 orders</span> away from unlocking <span className="text-brand-500 font-bold uppercase">Pro Tier</span> discounts on logistics.</p>
                                    <button className="w-full py-4 bg-brand-600 hover:bg-brand-700 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-lg shadow-brand-600/20 active:scale-95">VIEW TIOR BENEFITS</button>
                                </div>
                            </div>
                        </aside>

                        {/* Order History */}
                        <div className="lg:col-span-8">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
                                <div>
                                    <div className="text-brand-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4">Transaction Hub</div>
                                    <h2 className="text-5xl font-black text-surface-950 uppercase tracking-tighter flex items-center gap-4 font-outfit">
                                        ORDER <span className="text-brand-600">HISTORY</span>
                                    </h2>
                                </div>
                                <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-surface-200 shadow-sm text-surface-400">
                                    <Clock size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Sort: Latency Order</span>
                                </div>
                            </div>

                            {orders.length === 0 ? (
                                <m.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-[3rem] p-24 border border-surface-200 shadow-sm text-center flex flex-col items-center group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-surface-50 opacity-0 group-hover:opacity-50 transition-opacity duration-1000" />
                                    <div className="w-32 h-32 bg-surface-50 rounded-[2.5rem] flex items-center justify-center text-surface-200 mb-10 border border-surface-100 shadow-inner group-hover:scale-110 transition-transform duration-700">
                                        <Package size={56} />
                                    </div>
                                    <h3 className="text-3xl font-black text-surface-950 uppercase mb-4 tracking-tighter font-outfit">No Transactions Found</h3>
                                    <p className="text-surface-500 font-medium mb-12 max-w-sm text-lg leading-relaxed italic">Your logistical dashboard is currently vacant. Initiate your first performance component acquisition.</p>
                                    <Link href="/products" className="apex-button px-10">
                                        BROWSE INVENTORY
                                    </Link>
                                </m.div>
                            ) : (
                                <div className="space-y-8">
                                    {orders.map((order, idx) => (
                                        <m.div
                                            key={order.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="bg-white rounded-[2.5rem] p-10 border border-surface-200 shadow-sm hover:shadow-2xl hover:border-brand-600/20 transition-all duration-500 group relative"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-10">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-[10px] font-black text-brand-600 uppercase tracking-[0.2em] bg-brand-50 px-3 py-1 rounded-md">ID: {order.id.substring(0, 12).toUpperCase()}</span>
                                                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${order.status === 'DELIVERED' ? 'bg-emerald-500 text-white' :
                                                                order.status === 'CANCELLED' ? 'bg-surface-950 text-white' :
                                                                    'bg-brand-600 text-white'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <div className="text-2xl font-black text-surface-950 uppercase tracking-tighter font-outfit flex items-center gap-3">
                                                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="md:text-right">
                                                    <div className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] mb-2 leading-none">Total Investment</div>
                                                    <PriceDisplay amount={order.total} className="text-4xl font-black text-surface-950 font-outfit tracking-tighter" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-surface-100 items-end">
                                                <div>
                                                    <h4 className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] mb-6">Dispatch Manifest</h4>
                                                    <div className="flex -space-x-4 overflow-hidden">
                                                        {order.orderItems.map((item: any, i: number) => (
                                                            <m.div 
                                                                whileHover={{ scale: 1.2, zIndex: 10, rotate: 6 }}
                                                                key={i} 
                                                                className="relative w-14 h-14 rounded-2xl border-[3px] border-white overflow-hidden bg-white shadow-xl cursor-help" 
                                                                title={item.product?.name}
                                                            >
                                                                <img src={item.product?.image} className="w-full h-full object-cover" alt={item.product?.name} />
                                                            </m.div>
                                                        ))}
                                                        {order.orderItems.length > 5 && (
                                                            <div className="w-14 h-14 rounded-2xl border-[3px] border-white bg-surface-950 text-white flex items-center justify-center text-[10px] font-black shadow-xl">
                                                                +{order.orderItems.length - 5}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-4">
                                                    <button className="flex-1 sm:flex-none px-8 py-4 bg-surface-50 hover:bg-surface-950 hover:text-white rounded-2xl text-surface-950 font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 border border-surface-200 group/btn active:scale-95">
                                                        MANIFEST DETAILS <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                                    </button>
                                                </div>
                                            </div>
                                        </m.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
