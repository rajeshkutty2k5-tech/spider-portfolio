import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0,0,0,0.05)",
        subtle: "0 2px 8px rgba(0,0,0,0.25)",
        /* Strengthened neon shadows */
        "neon-cyan":
          "0 0 24px rgba(0, 255, 255, 0.7), 0 0 48px rgba(0, 255, 255, 0.4), 0 0 80px rgba(0, 255, 255, 0.15), inset 0 0 24px rgba(0, 255, 255, 0.12)",
        "neon-red":
          "0 0 24px rgba(255, 0, 0, 0.7), 0 0 48px rgba(255, 0, 0, 0.4), 0 0 80px rgba(255, 0, 0, 0.15), inset 0 0 24px rgba(255, 0, 0, 0.12)",
        /* Card states */
        elevated: "0 8px 32px rgba(0, 0, 0, 0.5)",
        "card-hover":
          "0 20px 56px rgba(255, 0, 0, 0.2), 0 0 32px rgba(0, 255, 255, 0.1)",
        "card-glow-cyan":
          "0 0 20px rgba(0, 255, 255, 0.12), 0 4px 24px rgba(0, 0, 0, 0.4)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "pulse-glow": {
          "0%, 100%": {
            opacity: "1",
            boxShadow:
              "0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(0, 255, 255, 0.3)",
          },
          "50%": {
            opacity: "0.75",
            boxShadow:
              "0 0 50px rgba(0, 255, 255, 1), 0 0 90px rgba(0, 255, 255, 0.65), 0 0 140px rgba(0, 255, 255, 0.3)",
          },
        },
        "pulse-glow-red": {
          "0%, 100%": {
            boxShadow:
              "0 0 16px rgba(255, 0, 0, 0.5), 0 0 32px rgba(255, 0, 0, 0.25)",
          },
          "50%": {
            boxShadow:
              "0 0 40px rgba(255, 0, 0, 0.9), 0 0 80px rgba(255, 0, 0, 0.5)",
          },
        },
        "heading-pulse": {
          "0%, 100%": {
            textShadow:
              "0 0 20px rgba(255,255,255,0.15), 0 0 40px rgba(0,255,255,0.1)",
          },
          "50%": {
            textShadow:
              "0 0 30px rgba(255,255,255,0.25), 0 0 60px rgba(0,255,255,0.2), 0 0 100px rgba(0,255,255,0.08)",
          },
        },
        "breathe-glow": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.08)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(-18px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
        "pulse-glow-red": "pulse-glow-red 2.5s ease-in-out infinite",
        "heading-pulse": "heading-pulse 4s ease-in-out infinite",
        "breathe-glow": "breathe-glow 3.5s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in-right": "slide-in-right 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        "spin-slow": "spin-slow 20s linear infinite",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
