"use client";

import { motion } from "framer-motion";
import {
    Hexagon,
    Facebook,
    Twitter,
    Instagram,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useSettingsStore } from "@/store/settingsStore";

export function Footer() {
    const storeName = useSettingsStore(state => state.storeName);

    return (
        <footer className="bg-surface-950 text-white font-outfit pt-24 pb-12 overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600/10 blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <motion.div
                                whileHover={{ rotate: 180, scale: 1.1 }}
                                className="text-brand-600"
                            >
                                <Hexagon size={32} />
                            </motion.div>
                            <span className="font-black text-2xl tracking-tighter uppercase">
                                {storeName}
                            </span>
                        </Link>
                        <p className="text-surface-400 font-medium leading-relaxed max-w-xs">
                            Premium automotive spare parts and performance components. Engineered for excellence, delivered with precision.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram].map((Icon, i) => (
                                <Link key={i} href="#" className="p-2.5 bg-white/5 hover:bg-brand-600 rounded-lg transition-all border border-white/10 hover:border-brand-500">
                                    <Icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-brand-500">Categories</h4>
                        <ul className="space-y-4">
                            {['Brake Systems', 'Engine Components', 'Suspension & Steering', 'Performance Mods', 'Lighting & Electrical'].map((link) => (
                                <li key={link}>
                                    <Link href="/products" className="text-surface-400 hover:text-white font-bold transition-colors flex items-center gap-2 group">
                                        <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-600" />
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-brand-500">Company</h4>
                        <ul className="space-y-4">
                            {['About Apex', 'Quality Standards', 'Store Locations', 'Shipping Policy', 'Contact Support'].map((link) => (
                                <li key={link}>
                                    <Link href="/about" className="text-surface-400 hover:text-white font-bold transition-colors flex items-center gap-2 group">
                                        <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-600" />
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter / Contact */}
                    <div className="space-y-8">
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-4 text-brand-500">Contact Us</h4>
                            <div className="space-y-4 text-surface-400 font-medium">
                                <div className="flex items-start gap-3">
                                    <MapPin size={20} className="text-brand-600 shrink-0" />
                                    <span>721 Performance Drive, Detroit, MI 48201</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone size={20} className="text-brand-600 shrink-0" />
                                    <span>+1 (800) APEX-AUTO</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail size={20} className="text-brand-600 shrink-0" />
                                    <span>support@apexauto.parts</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-surface-500 text-xs font-bold uppercase tracking-widest">
                        © {new Date().getFullYear()} {storeName}. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck size={16} />
                            SECURE SSL ENCRYPTED
                        </div>
                        <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                            {/* Simple payment icons as placeholders */}
                            <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center font-black text-[8px]">VISA</div>
                            <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center font-black text-[8px]">MC</div>
                            <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center font-black text-[8px]">AMEX</div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
