# Technical Architecture & Developer Guide: Apex Auto Spares

## 🚀 Project Overview
Apex Auto Spares is a high-performance, premium e-commerce platform built with **Next.js 15 (Turbopack)**, **Prisma**, **MySQL**, and **Tailwind CSS**. This document outlines the technical design, architectural patterns, and development protocols to ensure the platform maintains its "State-of-the-art" status.

---

## 🎨 Design System: "Apex Premium"
Our design language focuses on **Glassmorphism**, **High-Contrast Typography**, and **Fluid Micro-animations**.

### Visual Language Tokens
- **Borders**: All primary containers use `rounded-2xl` or `rounded-3xl` with `border-surface-200`.
- **Interactions**: Every actionable element must have an `active:scale-95` and a smooth `transition-all` (duration-300+).
- **Typography**: Primary font is **Outfit** (Black weights for headers) and **Inter** for body text.
- **Color Palette**: 
  - `brand-600`: #2563eb (Apex Primary)
  - `surface-950`: #030712 (Deep Cinematic Black)
  - `surface-50`: #f9fafb (Clean Porcelain)

---

## 🏗️ Architectural Core

### 1. Component Composition
We utilize **Atomic Design** principles adapted for Next.js Server/Client component boundaries:
- `components/common`: Reusable, low-level UI elements (Buttons, Inputs, Modals).
- `components/layout`: Global navigation, sidebar, and footer.
- `components/home`: Domain-specific components for the landing page.
- `components/admin`: Specialized dashboard controls.

### 2. State Management
- **Cart**: Managed via `Zustand` (`src/store/cartStore.ts`) for high-performance, persistent state.
- **Auth**: `Next-Auth v5 (Beta)` for secure, edge-ready session handling.
- **Server State**: Prisma Client (`lib/prisma`) handles all MySQL interactions with strict type safety.

---

## 🔧 Critical Workflow: Custom Dropdowns
One of the most complex UI challenges solved was the **Overflow Clipping** in the Admin Dashboard.
- **The Problem**: Standard dropdowns inside `overflow-hidden` table rows or cards would get cut off.
- **The Solution**: The `CustomSelect` component utilizes **React Portals** (`createPortal`) to teleport the dropdown list to `document.body`.
- **Positioning**: Uses `getBoundingClientRect()` to dynamically calculate `fixed` coordinates, ensuring perfectly anchored placement regardless of parent styling.

---

## 🛠️ Developer Protocol (The "Apex Way")

### Committing Code
1. **Atomic Commits**: Every commit should serve a single objective.
2. **Clear Messaging**: Use prefixes like `feat:`, `fix:`, or `perf:`.
3. **Verification**: Always run `npm run dev` and check the Admin Dashboard for visual regressions before pushing.

### Rendering Performance
- Heavily utilize `framer-motion` for entrances.
- **Caution**: To avoid vertical scrollbar "flickering" during page loads, use `scale` and `opacity` instead of `y` translations that push page boundaries.

---

## 📈 Future Infrastructure
Planned upgrades include:
- **Image CDN Integration**: Moving Unsplash placeholders to a dedicated bucket.
- **Real-time Logistics**: Integration with shipping APIs for the Manifest system.
- **AI-Powered Diagnostics**: A tool for users to identify spare parts via images.

---
*Created by the Apex Intelligence Team.*
