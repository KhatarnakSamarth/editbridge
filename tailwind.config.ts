import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: "#00f5ff",
          blue: "#3b82f6",
          purple: "#a855f7",
          violet: "#8b5cf6",
          emerald: "#10b981",
          pink: "#f43f5e",
          amber: "#f59e0b",
        },
        dark: {
          bg: "#070a13",
          card: "#0e1424",
          surface: "#141c30",
          border: "#1e293b",
        },
      },
      fontFamily: {
        mono: ["Consolas", "Monaco", "'Courier New'", "monospace"],
        sans: ["-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      boxShadow: {
        "neon-cyan": "0 0 15px rgba(0, 245, 255, 0.35), 0 0 30px rgba(0, 245, 255, 0.15)",
        "neon-purple": "0 0 15px rgba(168, 85, 247, 0.35), 0 0 30px rgba(168, 85, 247, 0.15)",
        "neon-blue": "0 0 15px rgba(59, 130, 246, 0.35), 0 0 30px rgba(59, 130, 246, 0.15)",
        "neon-emerald": "0 0 15px rgba(16, 185, 129, 0.35), 0 0 30px rgba(16, 185, 129, 0.15)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glass-light": "0 8px 24px 0 rgba(0, 0, 0, 0.06)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(0, 245, 255, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(0, 245, 255, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
