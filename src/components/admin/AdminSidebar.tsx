"use client";

import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Settings,
    LogOut,
    Hexagon,
    Grid
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const m = motion as any;

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Package, label: "Products", href: "/admin/products" },
    { icon: Grid, label: "Categories", href: "/admin/categories" },
    { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-white border-r border-surface-200 h-screen fixed left-0 top-0 flex flex-col z-50 shadow-sm font-outfit">
            {/* Brand */}
            <div className="h-20 flex items-center px-6 border-b border-surface-200">
                <Link href="/admin" className="flex items-center gap-2 group">
                    <m.div
                        whileHover={{ rotate: 90 }}
                        className="text-brand-600"
                    >
                        <Hexagon size={28} />
                    </m.div>
                    <span className="font-black text-xl tracking-tight text-surface-950 group-hover:text-brand-600 transition-colors uppercase">
                        APEX ADMIN
                    </span>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold ${isActive
                                ? "bg-brand-50 text-brand-700 border border-brand-200 shadow-sm"
                                : "text-surface-600 hover:text-brand-600 hover:bg-surface-50"
                                }`}
                        >
                            <item.icon size={20} className={isActive ? "text-brand-600" : ""} />
                            {item.label}
                            {isActive && (
                                <m.div
                                    layoutId="activeTab"
                                    className="absolute left-0 w-1.5 h-8 bg-brand-600 rounded-r-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-surface-200">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-surface-600 font-bold hover:text-brand-600 hover:bg-brand-50 transition-colors"
                >
                    <LogOut size={20} />
                    Exit to Frontend
                </Link>
            </div>
        </div>
    );
}
