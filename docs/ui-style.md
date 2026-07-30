# TaskFlow Engineering Standard: UI/UX Guidelines (`ui-style.md`)

This document defines the design system tokens, responsive layout rules, visual aesthetics, component guidelines, and accessibility standards for **TaskFlow**.

---

## # Design Principles

1. **Dark Glassmorphic Aesthetics**: Sleek, modern dark-mode experience featuring translucent glass surfaces (`backdrop-filter: blur(12px)`), vibrant neon accent glows, and subtle borders.
2. **Visual Hierarchy & Contrast**: High-contrast typography and clear spatial separation ensure effortless visual scanning during complex productivity workflows.
3. **Responsive & Fluid**: Interfaces dynamically adapt across mobile devices, tablets, and desktop workstations.
4. **Interactive Feedback**: Micro-animations and instant visual states provide feedback for user interactions.

---

## # Color Palette & Tokens

TaskFlow uses HSL and Tailwind CSS color tokens anchored around a dark theme.

| Token | Hex / Value | Purpose |
| :--- | :--- | :--- |
| **Background Deep** | `#090d16` | Main application backdrop |
| **Surface Dark** | `#111827` | Cards, sidebars, modal containers |
| **Surface Glass** | `rgba(17, 24, 39, 0.7)` | Translucent containers with `backdrop-blur-md` |
| **Border Glass** | `rgba(255, 255, 255, 0.08)`| Subtle structural borders |
| **Accent Primary** | `#6366f1` (Indigo 500) | Primary actions, focused states, main buttons |
| **Accent Secondary** | `#8b5cf6` (Purple 500) | Secondary highlights, badges, active tabs |
| **Text Main** | `#f9fafb` | Primary headings and body copy |
| **Text Muted** | `#9ca3af` | Subtitles, metadata, placeholder text |
| **Destructive** | `#ef4444` (Red 500) | Delete actions, error alerts |
| **Success** | `#10b981` (Emerald 500)| Task completions, positive status tags |

---

## # Typography & Spacing System

### Fonts
- **Primary Body Font**: `Inter`, sans-serif
- **Heading Font**: `Outfit`, sans-serif
- **Monospace Font**: `JetBrains Mono`, monospace (for code snippets & identifiers)

### Spacing Grid
Built on a strict **4px base grid system**:

| Token | Pixels | Usage |
| :--- | :--- | :--- |
| `space-1` | 4px | Micro padding, icon gaps |
| `space-2` | 8px | Button inline padding, tight list item gap |
| `space-3` | 12px | Input padding, badge margins |
| `space-4` | 16px | Standard card inner padding, grid gap |
| `space-6` | 24px | Section margins, container padding |
| `space-8` | 32px | Header margins, modal padding |
| `space-12`| 48px | Major layout block separation |

---

## # Responsive Strategy & Breakpoints

TaskFlow adheres to a mobile-first responsive layout grid built with Tailwind breakpoints:

```
sm: 640px    (Mobile Landscape)
md: 768px    (Tablets)
lg: 1024px   (Laptops / Small Desktops)
xl: 1280px   (Standard Workstations)
2xl: 1536px  (Ultra-wide Displays)
```

---

## # Component Design Rules

### 1. Icons (`Lucide Icons`)
- Use Lucide Icons (`lucide-react`) exclusively.
- Standard sizes: `16px` (small/inline), `20px` (default buttons/lists), `24px` (headers).
- Always include `aria-hidden="true"` or an accompanying `sr-only` span for screen readers.

### 2. Buttons
- Primary buttons use `bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg`.
- Loading buttons MUST render a spinner (`Loader2`) and disable pointer events.
- Destructive actions MUST require a secondary confirmation modal or popover trigger.

### 3. Form Rules
- All input fields must be wrapped with Zod + React Hook Form.
- Error messages render directly beneath the input in `text-red-400 text-sm font-medium`.
- Focused inputs display a subtle Indigo ring (`focus:ring-2 focus:ring-indigo-500/50`).

### 4. Modals & Drawers
- Backdrop blur: `backdrop-blur-md bg-black/60`.
- Trap focus automatically using `shadcn/ui Dialog` or `Drawer` primitives.
- Must support `Escape` key dismissal and clicking outside backdrop to close.

### 5. Toasts (`Sonner` / `shadcn/ui Toast`)
- Render toasts in the top-right corner.
- Status variants: `success` (green indicator), `error` (red indicator), `info` (indigo indicator).

---

## # Application States (Loading, Empty, Error)

1. **Loading State**:
   - Use Skeleton loaders (`@/components/ui/skeleton`) matching the content layout.
   - Never display blank white or empty black screens during data queries.
2. **Empty State**:
   - Render a centered container featuring a relevant Lucide icon, heading, descriptive text, and a primary Action CTA button (e.g., "Create First Project").
3. **Error State**:
   - Render an alert container with a retry button (`Query.refetch()`) to recover from network or API glitches gracefully.

---

## # Accessibility (a11y) & Animations

1. **WCAG 2.1 AA Compliance**:
   - Minimum text contrast ratio of **4.5:1** for standard text.
   - Interactive controls must have a target size of at least **44x44px** on touch devices.
2. **Keyboard Navigation**:
   - Visible focus rings (`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500`).
   - Modal and menu navigation must respond to standard `Tab`, `Shift+Tab`, `Arrow Keys`, and `Enter`/`Space`.
3. **Animation Guidelines**:
   - Keep transitions fast and responsive (`transition-all duration-200 ease-in-out`).
   - Use Framer Motion (`framer-motion`) for layout list reordering and modal scale animations.
   - Respect `prefers-reduced-motion` media queries.
