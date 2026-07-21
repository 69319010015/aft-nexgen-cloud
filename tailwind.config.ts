import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // 60% Dominant — Backgrounds
        dominant: {
          light: "#FFFFFF",
          "light-alt": "#F8FAFC",
          dark: "#0F172A",
          "dark-alt": "#1E293B",
        },
        // 30% Secondary — Structural, Text, Navigation
        secondary: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E3A8A",
          900: "#0F172A",
        },
        // 10% Accent — Tech Yellow (CTAs, Statuses, Alerts)
        accent: {
          50: "#FEFCE8",
          100: "#FEF9C3",
          200: "#FEF08A",
          300: "#FDE047",
          400: "#FACC15",
          500: "#EAB308",
          600: "#CA8A04",
          700: "#A16207",
          800: "#854D0E",
          900: "#713F12",
        },
      },
      fontFamily: {
        sans: ["var(--font-noto-sans-thai)", "Noto Sans Thai", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
        noto: ["Noto Sans Thai", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;