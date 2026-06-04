<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Acite Project Rules & Design System

This document outlines the design system, architecture rules, and coding standards for the Acite project. All AI agents working on this codebase must adhere strictly to these guidelines.

## 1. Design System & Aesthetics

### Typography
- **Primary Font**: Geist Sans (sans-serif) for body text and general interface.
- **Monospace Font**: Geist Mono / system monospace for code, metrics, and technical data.
- **Digital LCD Font**: `Share Tech Mono` (imported from Google Fonts). Used for stopwatch numbers and digital display readouts (`.font-digital`).
- **Sci-Fi Display Font**: `Orbitron` (imported from Google Fonts). Used for headers and technical badges (`.font-orbitron`).

### Border Radius & Shapes
- **Zero Rounding Rule**: **DO NOT use rounded corners on any UI elements.** All buttons, inputs, dialogs, cards, progress bars, and badges must have sharp, square corners.
  - Use `rounded-none` or omit the `rounded` utility class entirely.
  - Avoid `rounded-sm`, `rounded-md`, `rounded-lg`, etc.

### Colors & Themes
- **Dark Mode (Default)**:
  - Background: `#020617` (Deep space slate/black)
  - Foreground: `#f8fafc`
  - Secondary/Cards: `#0f172a`
  - Border: `#1e293b`
- **Light Mode**:
  - Background: `#ffffff`
  - Foreground: `#020617`
  - Secondary/Cards: `#f1f5f9`
  - Border: `#e2e8f0`
- **Brand Colors**:
  - **Primary**: Indigo (`#4f46e5` for light, `#818cf8` for dark)
  - **Gamification Accent**: Orange/Amber (`#f97316` / `#f59e0b`) for active rewards and challenges.
  - **Success/Complete Accent**: Emerald/Green (`#10b981` / `#22c55e`) for completed items.

### Animations & Motion
- **No Idle Pulsing**: Avoid looping animations such as `animate-pulse` or `animate-ping` on active status badges or pills to prevent visual clutter.
- **Transitions**: Keep page and state transitions subtle using Framer Motion (e.g. slight Y-axis slide or opacity transitions).

---

## 2. Architecture & Code Structure

### Clean Separation of Concerns
- **Logic vs View**: Do not bundle complex states, timers, event listeners, or storage reads/writes directly in UI view components.
  - Move state, timing, and progress checks to **custom React hooks** (e.g., `useDailyChallenge`).
  - Move storage keys, static constants, formatting helpers, and pure functions to **utility files** (e.g., `daily-challenge-utils.ts`).
  - Keep `.tsx` UI files focused purely on layout, styling, and rendering.

### React Hooks & ESLint Rules
- **Avoid setState in useEffect**: DO NOT call React state setters (`setState`) synchronously inside `useEffect` bodies to avoid cascading/redundant renders and trigger ESLint errors (`react-hooks/set-state-in-effect`).
  - For client-only setups (like hydration guards), check if state is actually required. If a component returns `null` or static markup on SSR and then executes DOM manipulations inside `useEffect`, it will not trigger hydration mismatches, eliminating the need for a `mounted` state wrapper.

### TypeScript Typings
- **No any type**: **DO NOT use the `any` type in TypeScript files.** Always define explicit types, interfaces, or generics. If the shape is truly dynamic or uncertain, use `unknown` instead to ensure full compiler type safety and comply with strict ESLint rules (like `@typescript-eslint/no-explicit-any`).

---

## 3. Product Rules & Features

### Authentication & Gating
- **Full Gating**: The user must be logged in to view any primary problem solving content or dashboard data. Use `RequireAuth` to wrap protected views.
- **Auth Dialog**: Trigger the global `AuthDialog` via `AuthDialogProvider` to prompt user login/registration when trying to view protected pages, and redirect the user to their target pathname upon successful authentication.
- **Account Deletion**: When a user profile is deleted:
  - Delete all records and progress associated with that user from the database.
  - Perform `localStorage.clear()` on the client side to wipe all local progress caches.

### Daily Challenge Mechanic
- **Timer Details**:
  - Requires **3 minutes (180 seconds)** of active page visibility to complete.
  - Must pause automatically if the user switches browser tabs (`document.hidden`). Use sub-second (50ms) intervals to render a fluid stopwatch (`HH:MM:SS:CC`) in the UI.
- **Checklist Requirements**:
  - Daily challenges are completed only if:
    1. The problem is unlocked/accessible for the user.
    2. The statement page is visited.
    3. Both optimal and brute-force solutions (if both exist) have been visited.
    4. The 3-minute active timer has finished.
