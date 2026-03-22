/* eslint-disable */
"use client";

import { motion } from "framer-motion";
import { Save, Globe, DollarSign, RefreshCw, AlertCircle, Tag } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        storeName: "Apex Auto Parts",
        currencyCode: "USD",
        currencySymbol: "$",
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            if (data && !data.error) {
                setSettings({
                    storeName: data.storeName,
                    currencyCode: data.currencyCode,
                    currencySymbol: data.currencySymbol,
                });
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            if (res.ok) {
                // Success feedback could be added here
                alert("Settings updated successfully!");
            }
        } catch (error) {
            console.error("Failed to update settings:", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <RefreshCw className="w-10 h-10 text-brand-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12 font-outfit">
            <div className="flex items-center justify-between border-b border-surface-200 pb-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-surface-950 uppercase">
                        SYSTEM <span className="text-brand-600">SETTINGS</span>
                    </h1>
                    <p className="text-surface-500 font-bold text-sm tracking-widest uppercase">Configure global site parameters</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 disabled:bg-surface-300 text-white font-black rounded-xl transition-all active:scale-95 shadow-xl shadow-brand-600/20 uppercase tracking-widest text-sm"
                >
                    {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Branding Section */}
                <section className="bg-white p-8 rounded-3xl border border-surface-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                            <Tag size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-surface-950 uppercase tracking-tight">Store Identity</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Store Name</label>
                            <input
                                value={settings.storeName}
                                onChange={e => setSettings({ ...settings, storeName: e.target.value })}
                                className="w-full bg-surface-50 border border-surface-200 rounded-xl py-4 px-6 font-bold text-surface-950 focus:border-brand-500 outline-none transition-all"
                                placeholder="e.g. Apex Auto Spares"
                            />
                        </div>
                    </div>
                </section>

                {/* Currency Section */}
                <section className="bg-white p-8 rounded-3xl border border-surface-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                            <Globe size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-surface-950 uppercase tracking-tight">Currency Configuration</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Currency Code (ISO)</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-surface-300 font-black">CODE</span>
                                <input
                                    value={settings.currencyCode}
                                    onChange={e => setSettings({ ...settings, currencyCode: e.target.value.toUpperCase() })}
                                    className="w-full bg-surface-50 border border-surface-200 rounded-xl py-4 pl-20 pr-6 font-bold text-surface-900 focus:border-brand-500 outline-none transition-all"
                                    placeholder="USD, LKR, EUR"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest pl-1">Currency Symbol</label>
                            <div className="relative">
                                <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-surface-300" size={18} />
                                <input
                                    value={settings.currencySymbol}
                                    onChange={e => setSettings({ ...settings, currencySymbol: e.target.value })}
                                    className="w-full bg-surface-50 border border-surface-200 rounded-xl py-4 pl-14 pr-6 font-bold text-surface-900 focus:border-brand-500 outline-none transition-all"
                                    placeholder="$, Rs, €"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-6 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-4">
                        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                        <div>
                            <p className="text-sm font-black text-amber-900 uppercase tracking-tight mb-1">Exchange Rate Reminder</p>
                            <p className="text-sm text-amber-700 font-medium">Changing the currency symbol will update the storefront display immediately. Ensure your product prices are set relative to this default currency.</p>
                        </div>
                    </div>
                </section>

                {/* System Stats Section */}
                <section className="bg-white p-8 rounded-3xl border border-surface-200 shadow-sm opacity-60 grayscale pointer-events-none">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-surface-50 rounded-xl flex items-center justify-center text-surface-400">
                            <RefreshCw size={24} />
                        </div>
                        <h2 className="text-2xl font-black text-surface-950 uppercase tracking-tight">Advanced Maintenance</h2>
                    </div>
                    <p className="text-surface-500 font-medium">Coming soon: Automated backups and system health monitoring.</p>
                </section>
            </div>
        </div>
    );
}
