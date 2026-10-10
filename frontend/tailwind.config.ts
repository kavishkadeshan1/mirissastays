import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: "#f7f4ee",
          100: "#eeebe3",
          200: "#ddd8ce",
          300: "#bfc6bc",
          400: "#77877c",
          500: "#627168",
          600: "#4e6257",
          700: "#364f42",
          800: "#253d31",
          900: "#182d29",
          950: "#10231e",
        },
        brand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#155e52",
          700: "#124c42",
          800: "#103f37",
          900: "#182d29",
          950: "#042f2e",
          dark: "#182d29",
        },
        sand: {
          50: "#fdfbf7",
          100: "#f8f5ee",
          200: "#eee6d8",
          300: "#dfd2be",
          400: "#cbb69c",
          500: "#b59c7f",
        },
        coral: {
          500: "#f97316",
          600: "#ea580c",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        card: "0 2px 8px -2px rgba(15, 23, 42, 0.08), 0 1px 4px -1px rgba(15, 23, 42, 0.04)",
        elevated:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
