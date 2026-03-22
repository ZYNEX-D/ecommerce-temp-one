/* eslint-disable */
"use client";

import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, UserPlus, LogIn, AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { alerts } from "@/lib/alerts";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CustomerLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                alerts.error("Invalid credentials. Please try again.");
            } else {
                alerts.success("Welcome back to Apex Auto!");
                router.push("/");
                router.refresh();
            }
        } catch (err) {
            alerts.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4 font-outfit pt-24">
            <div className="w-full max-w-lg">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl p-8 md:p-12 border border-surface-200 shadow-2xl relative overflow-hidden"
                >
                    <div className="mb-10 text-center">
                        <div className="w-20 h-20 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mx-auto mb-6">
                            <LogIn size={40} />
                        </div>
                        <h1 className="text-4xl font-black text-surface-950 uppercase tracking-tighter mb-2">Welcome <span className="text-brand-600">Back</span></h1>
                        <p className="text-surface-500 font-medium">Access your orders and member-only pricing.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-surface-500 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-surface-50 border border-surface-200 rounded-lg px-6 py-4 focus:outline-none focus:border-brand-500 transition-all font-bold placeholder:text-surface-300"
                                placeholder="name@email.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-black text-surface-500 uppercase tracking-widest">Password</label>
                                <button type="button" className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors">Forgot Password?</button>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-surface-50 border border-surface-200 rounded-lg px-6 py-4 focus:outline-none focus:border-brand-500 transition-all font-bold placeholder:text-surface-300"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            disabled={loading}
                            className="w-full py-5 bg-brand-600 hover:bg-brand-700 disabled:bg-surface-300 text-white font-black rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-brand-600/20 uppercase tracking-widest flex items-center justify-center gap-3 text-lg"
                        >
                            {loading ? "Signing In..." : "Log In"}
                        </button>
                    </form>

                    <div className="mt-10 pt-10 border-t border-surface-100 text-center">
                        <p className="text-surface-500 font-medium mb-6">Don't have an account yet?</p>
                        <Link
                            href="/auth/register"
                            className="inline-flex items-center gap-2 text-brand-600 font-black uppercase tracking-widest hover:text-brand-700 transition-colors group"
                        >
                            Create Account <UserPlus size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
