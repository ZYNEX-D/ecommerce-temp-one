"use client";

import { Navigation } from "./Navigation";
import { CartDrawer } from "./CartDrawer";
import { Footer } from "./Footer";
import { usePathname } from 'next/navigation';
import { useEffect } from "react";
import { useSettingsStore } from "@/store/settingsStore";

import { AuthProvider } from "./AuthProvider";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');
    const syncSettings = useSettingsStore(state => state.syncSettings);

    useEffect(() => {
        syncSettings();
    }, [syncSettings]);

    return (
        <AuthProvider>
            {isAdmin ? (
                <>{children}</>
            ) : (
                <>
                    <Navigation />
                    <CartDrawer />
                    <main className="pt-20 min-h-screen">
                        {children}
                    </main>
                    <Footer />
                </>
            )}
        </AuthProvider>
    );
}
