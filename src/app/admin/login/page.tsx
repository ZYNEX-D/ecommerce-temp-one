/* eslint-disable */
"use client";

import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, Hexagon, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { alerts } from "@/lib/alerts";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            alerts.error("Access Denied", "The credentials provided do not have administrative clearance.");
            setLoading(false);
        } else {
            alerts.success("Security Clearance Verified");
            router.push("/admin/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4 font-outfit">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-10 border border-surface-200 shadow-xl shadow-brand-600/5 relative overflow-hidden"
                >
                    {/* Brand Header */}
                    <div className="flex flex-col items-center mb-10">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 mb-6"
                        >
                            <Hexagon size={32} />
                        </motion.div>
                        <h1 className="text-3xl font-black text-surface-950 uppercase tracking-tight">Admin <span className="text-brand-600">Terminal</span></h1>
                        <p className="text-surface-500 font-bold text-xs tracking-widest uppercase mt-2">Authorization Required</p>
                    </div>


                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-surface-500 uppercase tracking-widest ml-1">Secure Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-surface-50 border border-surface-200 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all font-bold placeholder:text-surface-300"
                                    placeholder="admin@apexauto.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-surface-500 uppercase tracking-widest ml-1">Access Key</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={20} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-surface-50 border border-surface-200 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all font-bold placeholder:text-surface-300"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full py-5 bg-brand-600 hover:bg-brand-700 disabled:bg-surface-300 text-white font-black rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-brand-600/20 uppercase tracking-widest flex items-center justify-center gap-3 group"
                        >
                            {loading ? (
                                "Initializing..."
                            ) : (
                                <>
                                    Log In <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-surface-100 flex justify-center">
                        <Link href="/" className="text-sm font-bold text-surface-400 hover:text-brand-600 transition-colors uppercase tracking-widest">
                            Return to Frontend
                        </Link>
                    </div>
                </motion.div>

                <p className="text-center mt-8 text-surface-400 text-xs font-bold uppercase tracking-[0.2em]">
                    Apex Auto Secure Management Protocol v4.0.1
                </p>
            </div>
        </div>
    );
}
