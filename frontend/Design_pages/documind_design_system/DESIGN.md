---
name: DocuMind Design System
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#464555'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#4648d4'
  on-secondary: '#ffffff'
  secondary-container: '#6063ee'
  on-secondary-container: '#fffbff'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  huge: 80px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
---

## Brand & Style
The design system is anchored in a **Corporate / Modern** aesthetic, emphasizing clarity, efficiency, and intelligence. As an AI-driven tool for report generation, the interface must feel like a high-performance workspace—minimizing cognitive load while maximizing the sense of professional reliability.

The visual narrative is built on the principle of "Invisible Intelligence," where the UI recedes to highlight user content and AI-generated insights. This is achieved through a rigorous commitment to minimalism, high-quality typography, and a "SaaS-classic" palette that signals stability and enterprise-grade security.

## Colors
The palette is intentionally restrained to maintain focus on the generated documents. 

- **Primary Indigo (#4f46e5):** Used exclusively for primary actions, active states, and critical brand touchpoints. It represents the "intelligence" layer of the product.
- **Deep Slate (#1e293b):** Provides high-contrast legibility for all body text and headings, ensuring an authoritative tone.
- **Pure White (#ffffff):** The foundational canvas. All work surfaces are pure white to mimic the paper-like quality of the reports being generated.
- **Neutral Accents:** Light grays (`#f8fafc`, `#e2e8f0`) are used for secondary surfaces, borders, and UI scaffolding to provide subtle structure without introducing visual noise.

## Typography
The system utilizes **Inter** for its exceptional legibility and systematic feel. The type hierarchy is designed to mirror the structure of a formal report:

- **Headings:** Utilize tighter letter spacing and heavier weights to feel "grounded."
- **Body Text:** Uses a generous 1.5–1.6 line-height ratio to ensure long-form AI reports remain readable and approachable.
- **Labels:** Set in Medium or SemiBold weights for quick scanning of metadata and status indicators.

## Layout & Spacing
This design system employs a **Fixed Grid** philosophy for dashboard content and a **Fluid Grid** for landing pages. 

- **Desktop Layout:** 12-column grid with a 1200px max-width. Large sections of the report editor should utilize `huge` (80px) vertical spacing to maintain an "airy" and premium feel.
- **Rhythm:** An 8px linear scale is used for all spatial relationships. 
- **Adaptive Rules:** On mobile, side margins collapse to 16px. Component padding (e.g., within cards) remains consistent at 24px across devices to preserve the spacious aesthetic.

## Elevation & Depth
The system prioritizes a flat, architectural feel, using elevation only for specific interactions:

- **Low-Contrast Outlines:** Standard cards and containers use a 1px border (`#e2e8f0`) rather than shadows.
- **Subtle Shadows:** For the login card and floating modals, use a multi-layered, low-opacity shadow (e.g., `0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)`).
- **Tonal Layers:** The main workspace uses `#f8fafc` for the background and pure white for the active document, creating a natural stacked hierarchy.

## Shapes
The shape language is "Soft-Modern." An 8px (0.5rem) corner radius is the standard for all primary UI elements including buttons, inputs, and cards. This radius strikes a balance between professional precision and modern accessibility.

- **Standard (8px):** Buttons, Text Inputs, Select Menus.
- **Large (16px):** Main containers and high-level cards.
- **Full (Pill):** Used only for status tags (e.g., "Draft", "Complete") to distinguish them from actionable buttons.

## Components
- **Buttons:** Primary buttons use a solid indigo fill with white text. Secondary buttons use an indigo outline or ghost style. All buttons share the 8px radius and horizontal padding of 24px.
- **Input Fields:** 1px border (`#e2e8f0`) with a 48px height. On focus, the border transitions to indigo with a subtle 2px glow.
- **Cards:** White background with a 1px slate-200 border. For the Login card specifically, remove the border and apply the "Subtle Shadow" defined in Elevation.
- **Chips/Status:** Low-saturation backgrounds with high-saturation text (e.g., Light Indigo background with Deep Indigo text) for a refined, professional look.
- **AI-Specific Components:** Use a very subtle indigo-to-violet linear gradient border (1px) for elements specifically generated by AI to distinguish them from user-inputted content.