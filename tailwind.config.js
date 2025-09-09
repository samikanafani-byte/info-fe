/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      containers: {
        sm: "600px",
        md: "650px",
        lg: "700px",
        xl: "800px",
        "2xl": "1000px",
        "3xl": "1200px",
        "4xl": "1400px",
        "5xl": "1600px",
        "6xl": "1800px",
        "7xl": "2100px",
        "8xl": "2400px",
        "9xl": "2700px",
        "10xl": "3000px",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "var(--color-primary-blue)",
          darker: "var(--color-primary-blue-darker)",
          foreground: "var(--color-text-on-primary)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "var(--color-text-secondary)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "background-main": "var(--color-background-main)",
        "background-subtle": "var(--color-background-subtle)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-on-primary": "var(--color-text-on-primary)",
        "custom-border": "var(--color-border)",
      },
      boxShadow: {
        custom: "0 4px 8px var(--color-shadow)",
        "custom-lg": "0 8px 16px var(--color-shadow)",
        glow: "0 0 0 0px var(--color-primary-blue)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        "pulse-glow": {
          "0%": {
            transform: "scale(1)",
            opacity: 0.7,
            boxShadow: "0 0 0 0px var(--color-primary-blue)",
          },
          "100%": {
            transform: "scale(1.5)",
            opacity: 0,
            boxShadow: "0 0 0 15px var(--color-primary-blue)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
}
