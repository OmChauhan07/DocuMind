/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "tertiary-fixed": "#ffdbcc",
        "error": "#ba1a1a",
        "surface-container-highest": "#d8e3fb",
        "on-primary-container": "#dad7ff",
        "error-container": "#ffdad6",
        "on-secondary-container": "#fffbff",
        "on-primary-fixed": "#0f0069",
        "primary-fixed-dim": "#c3c0ff",
        "secondary-container": "#6063ee",
        "primary-fixed": "#e2dfff",
        "background": "#f9f9ff",
        "surface-container-lowest": "#ffffff",
        "tertiary": "#7e3000",
        "on-primary-fixed-variant": "#3323cc",
        "on-primary": "#ffffff",
        "on-secondary-fixed-variant": "#2f2ebe",
        "on-secondary-fixed": "#07006c",
        "inverse-surface": "#263143",
        "surface": "#f9f9ff",
        "on-tertiary-fixed": "#351000",
        "inverse-primary": "#c3c0ff",
        "on-error-container": "#93000a",
        "primary-container": "#4f46e5",
        "surface-container": "#e7eeff",
        "outline": "#777587",
        "outline-variant": "#c7c4d8",
        "on-tertiary-fixed-variant": "#7b2f00",
        "on-tertiary-container": "#ffd2be",
        "secondary-fixed-dim": "#c0c1ff",
        "secondary-fixed": "#e1e0ff",
        "surface-container-low": "#f0f3ff",
        "surface-bright": "#f9f9ff",
        "secondary": "#4648d4",
        "tertiary-container": "#a44100",
        "inverse-on-surface": "#ecf1ff",
        "primary": "#3525cd",
        "on-surface": "#111c2d",
        "tertiary-fixed-dim": "#ffb695",
        "surface-variant": "#d8e3fb",
        "on-tertiary": "#ffffff",
        "surface-dim": "#cfdaf2",
        "on-secondary": "#ffffff",
        "on-background": "#111c2d",
        "on-surface-variant": "#464555",
        "surface-container-high": "#dee8ff",
        "surface-tint": "#4d44e3",
        "on-error": "#ffffff"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "xs": "4px",
        "xl": "32px",
        "xxl": "48px",
        "huge": "80px",
        "lg": "24px",
        "unit": "4px",
        "sm": "8px",
        "margin-mobile": "16px",
        "gutter": "24px",
        "container-max": "1200px",
        "md": "16px"
      },
      fontFamily: {
        "body-lg": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "headline-lg": ["Inter", "sans-serif"],
        "display-lg": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"]
      },
      fontSize: {
        "body-lg": ["18px", {"lineHeight": "1.6", "fontWeight": "400"}],
        "headline-lg-mobile": ["24px", {"lineHeight": "1.2", "fontWeight": "600"}],
        "body-md": ["16px", {"lineHeight": "1.5", "fontWeight": "400"}],
        "headline-lg": ["32px", {"lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "600"}],
        "display-lg": ["48px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "body-sm": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}],
        "headline-md": ["24px", {"lineHeight": "1.3", "fontWeight": "600"}],
        "label-md": ["14px", {"lineHeight": "1", "letterSpacing": "0.01em", "fontWeight": "500"}],
        "label-sm": ["12px", {"lineHeight": "1", "fontWeight": "600"}]
      },
      keyframes: {
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        progressShimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeCycle: {
          '0%, 20%': { opacity: '1', content: '"Analyzing data structures..."' },
          '25%, 45%': { opacity: '1', content: '"Extracting insights..."' },
          '50%, 70%': { opacity: '1', content: '"Formatting visual layouts..."' },
          '75%, 95%': { opacity: '1', content: '"Finalizing report..."' },
          '100%': { opacity: '1', content: '"Analyzing data structures..."' },
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'progress-shimmer': 'progressShimmer 2s infinite',
        'fade-cycle': 'fadeCycle 8s infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries')
  ],
}
