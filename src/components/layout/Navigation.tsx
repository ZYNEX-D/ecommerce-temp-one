"use client";

import { Hexagon, ShoppingCart, Menu, X, LogOut, LayoutDashboard, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useSettingsStore } from "@/store/settingsStore";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

const m = motion as any;

export function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const cartItems = useCartStore((state) => state.items);
    const setCartOpen = useCartStore((state) => state.setCartOpen);
    const { data: session, status: sessionStatus } = useSession();
    const user = session?.user as any;
    const storeName = useSettingsStore(state => state.storeName);

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <>
            <header className="fixed top-0 left-0 w-full z-50 glass border-b border-surface-200 shadow-sm px-4">
                <div className="container mx-auto h-24 flex items-center justify-between">

                    <Link href="/" className="flex items-center gap-3 group">
                    <m.div
                        whileHover={{ rotate: 180, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className="w-12 h-12 bg-surface-950 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:bg-brand-600 transition-colors duration-500"
                    >
                        <Hexagon size={24} />
                    </m.div>
                        <span className="font-outfit font-black text-3xl tracking-tighter text-surface-950 group-hover:text-brand-600 transition-all duration-300 uppercase leading-none">
                            {storeName}
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-12">
                        {['Catalog', 'Categories', 'Performance', 'Logistics'].map((item) => (
                            <Link 
                                key={item} 
                                href={`/${item.toLowerCase()}`} 
                                className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400 hover:text-brand-600 transition-all relative group/link"
                            >
                                {item}
                                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-brand-600 group-hover/link:w-full transition-all duration-300" />
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-6">
                        {/* Auth Status */}
                        <div className="hidden md:flex items-center gap-6">
                            {sessionStatus === "authenticated" ? (
                                <div className="flex items-center gap-6">
                                    <Link
                                        href={user?.role === "admin" ? "/admin/dashboard" : "/profile"}
                                        className="flex items-center gap-3 px-2 py-2 pr-6 bg-white hover:bg-surface-50 rounded-full transition-all border border-surface-200 group shadow-sm hover:shadow-xl active:scale-95"
                                    >
                                        <div className="w-10 h-10 bg-surface-950 rounded-full flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:bg-brand-600 transition-colors">
                                            {user?.name?.[0]?.toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-surface-950 uppercase tracking-tight group-hover:text-brand-600 transition-colors">{user?.name}</span>
                                            <span className="text-[8px] font-black text-surface-400 uppercase tracking-widest leading-none">Authorized Client</span>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="w-10 h-10 flex items-center justify-center text-surface-300 hover:text-red-600 transition-all hover:bg-red-50 rounded-xl"
                                        title="Log Out"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link
                                        href="/auth/login"
                                        className="px-8 py-3.5 bg-surface-950 hover:bg-black text-white font-black rounded-xl transition-all shadow-xl shadow-black/10 active:scale-95 text-[10px] uppercase tracking-[0.2em]"
                                    >
                                        Authenticate
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="h-8 w-px bg-surface-200 hidden md:block" />

                        <m.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCartOpen(true)}
                            className="relative flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-surface-200 group hover:border-brand-600 transition-all shadow-sm"
                        >
                            <ShoppingCart size={22} className="text-surface-950 group-hover:text-brand-600 transition-colors" />
                            <div className="hidden sm:flex flex-col items-start leading-none gap-1">
                                <span className="text-[8px] font-black uppercase tracking-widest text-surface-400">Cart</span>
                                <span className="text-[10px] font-black text-surface-950 group-hover:text-brand-600">{totalItems} UNITS</span>
                            </div>
                            {totalItems > 0 && (
                                <m.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-brand-600 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-xl"
                                >
                                    {totalItems}
                                </m.div>
                            )}
                        </m.button>
                        
                        <button 
                            className="md:hidden w-12 h-12 flex items-center justify-center bg-surface-50 rounded-xl text-surface-950" 
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Nav Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <m.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="fixed inset-0 z-40 bg-white pt-32 px-8 md:hidden"
                    >
                        <nav className="flex flex-col gap-10">
                            {['Catalog', 'Categories', 'Performance', 'Logistics', 'Profile'].map((item) => (
                                <Link 
                                    key={item} 
                                    href={`/${item.toLowerCase()}`} 
                                    onClick={() => setIsOpen(false)} 
                                    className="text-5xl font-outfit font-black text-surface-950 uppercase tracking-tighter hover:text-brand-600 transition-all"
                                >
                                    {item}
                                </Link>
                            ))}
                            {sessionStatus === "authenticated" && (
                                <button 
                                    onClick={() => signOut()}
                                    className="text-left text-red-600 text-3xl font-black uppercase tracking-widest mt-12 bg-red-50 p-6 rounded-[2rem]"
                                >
                                    DISCONNECT
                                </button>
                            )}
                        </nav>
                    </m.div>
                )}
            </AnimatePresence>
        </>
    );
}
