/* eslint-disable */
"use client";

import { useState, useRef, useEffect, useId } from "react";
import { ChevronDown, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const m = motion as any;

export interface SelectOption {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
    /** Extra classes applied to the trigger button */
    triggerClassName?: string;
    /** Extra classes applied to the dropdown list panel */
    listClassName?: string;
    /** Colour variant for the selected badge inside the list */
    getOptionStyle?: (value: string) => string;
    placeholder?: string;
    disabled?: boolean;
}

export function CustomSelect({
    options,
    value,
    onChange,
    className = "",
    triggerClassName = "",
    listClassName = "",
    getOptionStyle,
    placeholder = "Select…",
    disabled = false,
}: CustomSelectProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const id = useId();

    const selected = options.find((o) => o.value === value);

    // Close on outside click
    useEffect(() => {
        function handler(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Keyboard: Escape closes
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Trigger */}
            <button
                id={id}
                type="button"
                disabled={disabled}
                onClick={() => setOpen((p) => !p)}
                className={`w-full flex items-center justify-between gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none ${triggerClassName}`}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className="truncate">
                    {selected ? selected.label : <span className="text-surface-400">{placeholder}</span>}
                </span>
                <m.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} className="shrink-0 text-surface-400" />
                </m.span>
            </button>

            {/* Dropdown list */}
            <AnimatePresence>
                {open && (
                    <m.ul
                        role="listbox"
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className={`absolute z-[999] left-0 right-0 mt-2 rounded-xl border border-surface-200 bg-white shadow-2xl shadow-surface-950/10 overflow-hidden ${listClassName}`}
                        style={{ minWidth: "100%" }}
                    >
                        {options.map((opt) => {
                            const isActive = opt.value === value;
                            const optStyle = getOptionStyle?.(opt.value) ?? "";
                            return (
                                <li
                                    key={opt.value}
                                    role="option"
                                    aria-selected={isActive}
                                    onClick={() => { onChange(opt.value); setOpen(false); }}
                                    className={`
                                        flex items-center justify-between gap-3 px-4 py-3 
                                        text-sm font-bold cursor-pointer select-none
                                        transition-colors duration-100
                                        ${isActive
                                            ? "bg-brand-50 text-brand-700"
                                            : "text-surface-800 hover:bg-surface-50"
                                        }
                                    `}
                                >
                                    <span className={`${optStyle ? `px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wide border ${optStyle}` : ""}`}>
                                        {opt.label}
                                    </span>
                                    {isActive && <Check size={14} className="text-brand-600 shrink-0" />}
                                </li>
                            );
                        })}
                    </m.ul>
                )}
            </AnimatePresence>
        </div>
    );
}
