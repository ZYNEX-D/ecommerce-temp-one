/* eslint-disable */
"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Hexagon, MessageSquare, Clock, Globe } from "lucide-react";
import { useState } from "react";
import { alerts } from "@/lib/alerts";

const m = motion as any;

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            alerts.success("Transmission Received", "Our engineering team will review your inquiry and respond within 24 hours.");
            (e.target as HTMLFormElement).reset();
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-surface-50 font-outfit pb-24">
            {/* Hero Section */}
            <div className="relative h-[500px] flex items-center justify-center overflow-hidden bg-surface-950">
                <div className="absolute inset-0 z-0 opacity-40">
                    <img 
                        src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=2000" 
                        alt="Engineering Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-surface-950/20 via-surface-950/60 to-surface-950" />
                </div>
                
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <m.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                            </span>
                            Direct Uplink
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                            CONTACT <span className="text-brand-600">APEX</span>
                        </h1>
                        <p className="text-surface-400 font-medium text-xl max-w-2xl mx-auto italic">
                            High-performance support for high-performance engineering. Our specialists are standing by.
                        </p>
                    </m.div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-24 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {[
                            { 
                                icon: MessageSquare, 
                                title: "Technical Support", 
                                detail: "tech-support@apexauto.parts", 
                                sub: "24/7 Diagnostics Assistance",
                                color: "brand" 
                            },
                            { 
                                icon: Phone, 
                                title: "Global Sales", 
                                detail: "+1 (800) APEX-AUTO", 
                                sub: "Mon-Fri: 08:00 - 18:00 EST",
                                color: "emerald" 
                            },
                            { 
                                icon: Mail, 
                                title: "General Inquiries", 
                                detail: "info@apexauto.parts", 
                                sub: "Typical response time: 2 hours",
                                color: "blue" 
                            }
                        ].map((item, idx) => (
                            <m.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-8 rounded-xl border border-surface-200 shadow-xl group hover:border-brand-500 transition-all duration-500"
                            >
                                <div className={`w-12 h-12 bg-${item.color}-50 rounded-xl flex items-center justify-center text-${item.color}-600 mb-6 group-hover:scale-110 transition-transform`}>
                                    <item.icon size={24} />
                                </div>
                                <h3 className="text-sm font-black text-surface-400 uppercase tracking-widest mb-1">{item.title}</h3>
                                <div className="text-xl font-black text-surface-950 mb-2 truncate">{item.detail}</div>
                                <p className="text-xs font-bold text-surface-400 uppercase tracking-tight">{item.sub}</p>
                            </m.div>
                        ))}

                        {/* Global Presence */}
                        <div className="bg-surface-950 p-10 rounded-2xl text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600/20 blur-3xl rounded-full" />
                            <h3 className="text-2xl font-black tracking-tighter uppercase mb-8 flex items-center gap-3">
                                <Globe className="text-brand-500" />
                                HQ Inventory
                            </h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <MapPin className="text-brand-600 shrink-0" size={20} />
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-surface-400 mb-1">Global Head Office</p>
                                        <p className="font-bold">721 Performance Drive, Detroit, MI 48201, United States</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Clock className="text-brand-600 shrink-0" size={20} />
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-surface-400 mb-1">Operating Hours</p>
                                        <p className="font-bold">24/7 Digital Terminal Availability</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <m.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl border border-surface-200 shadow-2xl overflow-hidden"
                        >
                            <div className="p-12 border-b border-surface-100 flex justify-between items-center bg-surface-50">
                                <div>
                                    <h2 className="text-3xl font-black text-surface-950 uppercase tracking-tight">HOW CAN <span className="text-brand-600">APEX</span> HELP YOU?</h2>
                                    <p className="text-surface-500 font-medium italic mt-1 text-lg">Send your query directly to our engineering queue.</p>
                                </div>
                                <Hexagon size={48} className="text-brand-600/20" />
                            </div>

                            <form onSubmit={handleSubmit} className="p-12 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Full Name</label>
                                        <input 
                                            required
                                            type="text"
                                            className="w-full bg-surface-50 border border-surface-200 rounded-xl px-6 py-4 focus:outline-none focus:border-brand-500 transition-all font-bold placeholder:text-surface-300"
                                            placeholder="e.g. Lewis Hamilton"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Email Address</label>
                                        <input 
                                            required
                                            type="email"
                                            className="w-full bg-surface-50 border border-surface-200 rounded-xl px-6 py-4 focus:outline-none focus:border-brand-500 transition-all font-bold placeholder:text-surface-300"
                                            placeholder="driver@apexauto.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Inquiry Type</label>
                                    <select className="w-full bg-surface-50 border border-surface-200 rounded-xl px-6 py-4 focus:outline-none focus:border-brand-500 transition-all font-bold text-surface-900 appearance-none cursor-pointer">
                                        <option>Technical Product Specification</option>
                                        <option>Bulk/Trade Order Inquiry</option>
                                        <option>International Shipping Logistics</option>
                                        <option>Warranty & Returns Claim</option>
                                        <option>Partnership/Sponsorship</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">Message Detail</label>
                                    <textarea 
                                        required
                                        rows={6}
                                        className="w-full bg-surface-50 border border-surface-200 rounded-xl px-6 py-4 focus:outline-none focus:border-brand-500 transition-all font-bold placeholder:text-surface-300 resize-none"
                                        placeholder="Describe your technical requirement or order inquiry..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-6 bg-brand-600 hover:bg-brand-700 disabled:bg-surface-300 text-white font-black rounded-xl transition-all active:scale-[0.98] shadow-xl shadow-brand-600/30 uppercase tracking-[0.2em] flex items-center justify-center gap-3 group"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <span className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></span>
                                            SENDING...
                                        </span>
                                    ) : (
                                        <>
                                            SEND QUERY <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </m.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
