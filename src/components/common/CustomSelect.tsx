/* eslint-disable */
"use client";

import { useState, useRef, useEffect, useId, useCallback } from "react";
import { createPortal } from "react-dom";
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
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
    const [mounted, setMounted] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLUListElement>(null);
    const id = useId();

    const selected = options.find((o) => o.value === value);

    // Only render portal after mount (SSR safety)
    useEffect(() => { setMounted(true); }, []);

    // Compute dropdown position from trigger's bounding rect
    const computePosition = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = Math.min(options.length * 48, 300);

        // Flip upward if not enough space below
        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
            setDropdownStyle({
                position: "fixed",
                top: rect.top - dropdownHeight - 4,
                left: rect.left,
                width: Math.max(rect.width, 200),
                zIndex: 9999,
            });
        } else {
            setDropdownStyle({
                position: "fixed",
                top: rect.bottom + 4,
                left: rect.left,
                width: Math.max(rect.width, 200),
                zIndex: 9999,
            });
        }
    }, [options.length]);

    // Recompute on open / scroll / resize
    useEffect(() => {
        if (!open) return;
        computePosition();
        window.addEventListener("scroll", computePosition, true);
        window.addEventListener("resize", computePosition);
        return () => {
            window.removeEventListener("scroll", computePosition, true);
            window.removeEventListener("resize", computePosition);
        };
    }, [open, computePosition]);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        function handler(e: MouseEvent) {
            const target = e.target as Node;
            if (
                triggerRef.current && !triggerRef.current.contains(target) &&
                dropdownRef.current && !dropdownRef.current.contains(target)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    // Keyboard: Escape closes
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") setOpen(false);
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    const dropdownEl = (
        <AnimatePresence>
            {open && (
                <m.ul
                    ref={dropdownRef}
                    role="listbox"
                    initial={{ opacity: 0, y: -4, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.97 }}
                    transition={{ duration: 0.14, ease: "easeOut" }}
                    style={dropdownStyle}
                    className={`rounded-xl border border-surface-200 bg-white shadow-2xl shadow-surface-950/10 overflow-hidden overflow-y-auto max-h-[300px] ${listClassName}`}
                >
                    {options.map((opt) => {
                        const isActive = opt.value === value;
                        const optStyle = getOptionStyle?.(opt.value) ?? "";
                        return (
                            <li
                                key={opt.value}
                                role="option"
                                aria-selected={isActive}
                                onMouseDown={(e) => {
                                    e.preventDefault(); // prevent blur before onChange
                                    onChange(opt.value);
                                    setOpen(false);
                                }}
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
    );

    return (
        <div className={`relative ${className}`}>
            {/* Trigger */}
            <button
                ref={triggerRef}
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

            {/* Portal: renders outside all overflow-hidden parents */}
            {mounted && createPortal(dropdownEl, document.body)}
        </div>
    );
}
