/* eslint-disable */
"use client";

import { useSettingsStore } from "@/store/settingsStore";
import { useMemo, useEffect, useState } from "react";

interface PriceDisplayProps {
    amount: number | string;
    className?: string;
    showCode?: boolean;
}

export function PriceDisplay({ amount, className = "", showCode = false }: PriceDisplayProps) {
    const { currency } = useSettingsStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    const formattedPrice = useMemo(() => {
        // We assume the amount in DB is in the base currency set by Admin
        // If we had a real exchange rate system, we'd multiply by currency.rate
        const converted = numericAmount;
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(converted);
    }, [numericAmount, currency]);

    if (!mounted) {
        return <span className={className}>${numericAmount.toFixed(2)}</span>;
    }

    return (
        <span className={className}>
            <span className="text-[0.7em] mr-0.5 align-top mt-1 inline-block">{currency.symbol}</span>
            {formattedPrice}
            {showCode && <span className="ml-1 text-[0.7em] opacity-70 uppercase font-mono">{currency.code}</span>}
        </span>
    );
}
