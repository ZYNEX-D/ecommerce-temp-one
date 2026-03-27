/* eslint-disable */
"use client";

import { motion } from "framer-motion";
import {
    TrendingUp,
    Users,
    CreditCard,
    Package,
    Activity,
    ArrowUpRight
} from "lucide-react";

import { useState, useEffect } from "react";

const m = motion as any;

const iconMap: Record<string, any> = {
    CreditCard,
    Users,
    Package,
    Activity
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<any[]>([]);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                const data = await res.json();
                if (data.stats) {
                    setStats(data.stats);
                    setRecentOrders(data.recentOrders || []);
                }
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-surface-400 font-bold uppercase tracking-widest text-xs">Accessing Terminal Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12 font-outfit">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-surface-950 mb-2 uppercase">
                        DASHBOARD <span className="text-brand-600">OVERVIEW</span>
                    </h1>
                    <p className="text-surface-500 font-bold text-sm tracking-widest uppercase">TERMINAL STATUS: ONLINE</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => {
                    const Icon = iconMap[stat.icon] || stats[0].icon;
                    return (
                        <m.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            className="bg-white p-6 rounded-xl border border-surface-200 shadow-sm relative overflow-hidden group hover:border-brand-300 transition-all"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Icon size={64} className="text-brand-600" />
                            </div>

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <p className="text-surface-500 font-bold uppercase tracking-wider text-xs">{stat.label}</p>
                                <span className="flex items-center text-emerald-600 text-xs font-black gap-1 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                                    <ArrowUpRight size={14} /> {stat.change}
                                </span>
                            </div>
                            <h3 className="text-3xl font-black text-surface-950 relative z-10 tracking-tight font-outfit">{stat.value}</h3>
                        </m.div>
                    );
                })}
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-surface-200 shadow-sm min-h-[400px] flex flex-col">
                    <h3 className="text-xl font-black text-surface-950 mb-6 border-b border-surface-100 pb-4 uppercase tracking-tight font-outfit">Sales Analytics</h3>
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-surface-100 rounded-xl relative overflow-hidden group bg-surface-50">
                        <svg viewBox="0 0 100 100" className="w-full h-full opacity-10 text-brand-600 group-hover:opacity-20 transition-opacity absolute inset-0" preserveAspectRatio="none">
                            <m.path
                                d="M 0 80 Q 20 60 40 70 T 80 40 T 100 20 L 100 100 L 0 100"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                            />
                        </svg>
                        <p className="text-surface-400 font-bold text-sm uppercase tracking-widest relative z-10 select-none">Generating Market Insights...</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-surface-200 shadow-sm h-[400px]">
                    <h3 className="text-xl font-black text-surface-950 mb-6 border-b border-surface-100 pb-4 uppercase tracking-tight font-outfit">Recent Orders</h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {recentOrders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full py-12 text-center opacity-40">
                                <Package size={48} className="mb-4" />
                                <p className="text-xs font-black uppercase tracking-widest">No Recent Activity</p>
                            </div>
                        ) : (
                            recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-50 transition-colors border border-transparent hover:border-surface-100 group">
                                    <div className="w-2.5 h-2.5 rounded-full bg-brand-600 shadow-[0_0_8px_rgba(220,38,38,0.4)]" />
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-surface-800 uppercase tracking-tight truncate">
                                            {order.user?.name || "Member"}: Order #{order.id.substring(0, 4)}
                                        </p>
                                        <p className="text-[10px] text-surface-500 font-black uppercase tracking-widest mt-0.5">
                                            {new Date(order.createdAt).toLocaleDateString()} • ${order.total.toLocaleString()}
                                        </p>
                                    </div>
                                    <ArrowUpRight size={16} className="text-surface-300 group-hover:text-brand-600 transition-colors" />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
