/* eslint-disable */
"use client";

import { motion } from "framer-motion";
import { Search, Eye, MoreHorizontal, CheckCircle2, Clock, XCircle, Truck, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

// Mock Data
const initialOrders = [
    { id: "ORD-8925", customer: "Alex Mercer", email: "a.mercer@citadel.net", date: "2026-03-08", total: 1799.98, status: "Completed", items: 2 },
    { id: "ORD-8924", customer: "Sarah Kerrigan", email: "ghost@dominion.gov", date: "2026-03-07", total: 4999.99, status: "Processing", items: 1 },
    { id: "ORD-8923", customer: "David Bowman", email: "dbowman@discovery.space", date: "2026-03-07", total: 899.99, status: "Shipped", items: 1 },
    { id: "ORD-8922", customer: "Motoko Kusanagi", email: "major@section9.jp", date: "2026-03-06", total: 249.99, status: "Cancelled", items: 1 },
    { id: "ORD-8921", customer: "Neo", email: "neo@zion.matrix", date: "2026-03-05", total: 1299.99, status: "Completed", items: 1 },
];

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                // Optimistic update
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED':
            case 'Completed': return <CheckCircle2 size={14} />;
            case 'PROCESSING':
            case 'Processing': return <Clock size={14} />;
            case 'SHIPPED':
            case 'Shipped': return <Truck size={14} />;
            case 'CANCELLED':
            case 'Cancelled': return <XCircle size={14} />;
            default: return <AlertCircle size={14} />;
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status.toUpperCase()) {
            case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'PROCESSING': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'SHIPPED': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-100';
            case 'CANCELLATION_REQUESTED': return 'bg-purple-50 text-purple-600 border-purple-100';
            default: return 'bg-surface-50 text-surface-500 border-surface-100';
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 font-outfit">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-surface-950 uppercase">
                        SALES <span className="text-brand-600">LEDGER</span>
                    </h1>
                    <p className="text-surface-500 font-medium">Monitor system transactions and order fulfillment status.</p>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-96">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                    <input
                        type="text"
                        placeholder="Search IDs, customers, or emails..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-surface-50 border border-surface-200 rounded-xl py-3 pl-12 pr-6 text-surface-900 focus:outline-none focus:border-brand-500 transition-all font-bold placeholder:text-surface-300"
                    />
                </div>

                <div className="flex gap-3">
                    <select className="bg-surface-50 border border-surface-200 rounded-xl py-3 px-6 text-surface-600 font-bold focus:outline-none hover:border-surface-400 cursor-pointer transition-colors">
                        <option value="all">Every Status</option>
                        <option value="completed">Completed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 className="w-10 h-10 text-brand-600 animate-spin" />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-24">
                            <p className="text-surface-400 font-black uppercase tracking-widest text-lg">No transactions found.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-surface-50/50 border-b border-surface-200 text-surface-500 font-black text-[10px] uppercase tracking-[0.2em]">
                                    <th className="py-6 px-8">Transaction ID</th>
                                    <th className="py-6 px-8">Customer Data</th>
                                    <th className="py-6 px-8">Date Initiated</th>
                                    <th className="py-6 px-8">Total Revenue</th>
                                    <th className="py-6 px-8">Status / Workflow</th>
                                    <th className="py-6 px-8 text-right">Inspect</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                {orders.map((order, i) => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="hover:bg-surface-50/50 transition-colors group"
                                    >
                                        <td className="py-5 px-8">
                                            <span className="font-black text-surface-950 group-hover:text-brand-600 transition-colors">
                                                {order.id.substring(0, 8).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="font-bold text-surface-950 text-sm">{order.shippingFirstName} {order.shippingLastName}</div>
                                            <div className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">{order.user?.email || 'Guest User'}</div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <span className="text-sm font-bold text-surface-500 uppercase tracking-tighter">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="py-5 px-8">
                                            <span className="font-black text-surface-950">${parseFloat(order.total).toFixed(2)}</span>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="flex flex-col gap-1.5 items-start">
                                                <select
                                                    value={order.status.toUpperCase()}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border cursor-pointer outline-none transition-all ${getStatusStyle(order.status)}`}
                                                >
                                                    <option value="PENDING">Pending</option>
                                                    <option value="PROCESSING">Processing</option>
                                                    <option value="SHIPPED">Shipped</option>
                                                    <option value="DELIVERED">Delivered</option>
                                                    <option value="CANCELLED">Cancelled</option>
                                                    <option value="CANCELLATION_REQUESTED">Cancellation Requested</option>
                                                </select>
                                                <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">{order.orderItems?.length || 0} UNIT(S)</span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-8">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2.5 text-surface-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all border border-transparent hover:border-brand-100 shadow-sm">
                                                    <Eye size={18} />
                                                </button>
                                                <button className="p-2.5 text-surface-400 hover:text-surface-900 hover:bg-surface-50 rounded-xl transition-all border border-transparent hover:border-surface-200">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
