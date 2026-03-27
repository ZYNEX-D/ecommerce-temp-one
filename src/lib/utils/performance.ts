/**
 * APEX PERFORMANCE UTILITIES
 * High-performance helper functions for the Apex Auto Parts frontend.
 */

/**
 * Debounce a function call to prevent excessive execution.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

/**
 * Throttle a function call to ensure it only runs once per interval.
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Currency Formatter for Apex Premium Display.
 */
export const formatApexCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Clean Object for API payloads.
 */
export function removeEmptyKeys<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null && v !== '')
  ) as Partial<T>;
}

/**
 * Absolute URL generator for OG images and metadata.
 */
export function getAbsoluteUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * High-Performance Viewport Observer.
 */
export function createApexObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) {
  if (typeof window === 'undefined') return null;
  return new IntersectionObserver((entries) => {
    entries.forEach((entry) => callback(entry));
  }, options);
}

/**
 * Precision Math for Logistics Calculations.
 */
export const apexMath = {
  calculateTax: (subtotal: number, rate = 0.08) => Number((subtotal * rate).toFixed(2)),
  calculateShipping: (weight: number, distance: number) => {
    const base = 5.00;
    const perKg = 0.50;
    const perKm = 0.10;
    return Number((base + (weight * perKg) + (distance * perKm)).toFixed(2));
  },
  applyDiscount: (total: number, percent: number) => Number((total * (1 - percent / 100)).toFixed(2))
};
