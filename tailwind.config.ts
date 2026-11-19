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
        vice: {
          bg: "var(--bg-canvas)",
          surface: "var(--bg-surface)",
          card: "var(--bg-card)",
          cardElevated: "var(--bg-card-elevated)",
          input: "var(--bg-input)",
          hover: "var(--bg-hover)",
          pink: "var(--accent-pink)",
          pinkHover: "var(--accent-pink-hover)",
          coral: "var(--accent-coral)",
          gold: "var(--accent-gold)",
          mint: "var(--accent-mint)",
          text: "var(--text-primary)",
          muted: "var(--text-secondary)",
          dim: "var(--text-muted)",
          border: "var(--border-subtle)",
          borderHover: "var(--border-hover)",
        },
        neon: {
          pink: "var(--accent-pink)",
          coral: "var(--accent-coral)",
          gold: "var(--accent-gold)",
          mint: "var(--accent-mint)",
          cyan: "var(--accent-pink)",
          blue: "var(--accent-coral)",
          purple: "#d946ef",
          violet: "#a855f7",
          emerald: "var(--accent-mint)",
          amber: "var(--accent-gold)",
        },
        dark: {
          bg: "var(--bg-canvas)",
          card: "var(--bg-card)",
          surface: "var(--bg-surface)",
          border: "var(--border-subtle)",
        },
      },
      backgroundImage: {
        "vice-gradient": "linear-gradient(135deg, #E11D74 0%, #F97316 100%)",
        "vice-gradient-h": "linear-gradient(90deg, #E11D74 0%, #F97316 100%)",
        "vice-glass": "linear-gradient(180deg, var(--bg-card) 0%, var(--bg-surface) 100%)",
        "vice-glow": "radial-gradient(circle at top center, rgba(225, 29, 116, 0.08) 0%, transparent 60%)",
      },
      fontFamily: {
        mono: ["Consolas", "Monaco", "'Courier New'", "monospace"],
        sans: ["-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      boxShadow: {
        "neon-pink": "0 2px 10px rgba(225, 29, 116, 0.18)",
        "neon-coral": "0 2px 10px rgba(249, 115, 22, 0.18)",
        "neon-gold": "0 2px 10px rgba(245, 158, 11, 0.18)",
        "vice-glow": "0 4px 16px rgba(225, 29, 116, 0.12)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.35)",
        "glass-light": "0 4px 20px 0 rgba(0, 0, 0, 0.04)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
