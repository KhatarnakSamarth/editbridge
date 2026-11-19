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
          bg: "#0D0618",
          surface: "#170B29",
          card: "#211038",
          cardElevated: "#2D154B",
          pink: "#FF2E93",
          pinkHover: "#FF52A8",
          coral: "#FF7B54",
          gold: "#FFD166",
          mint: "#00F5A0",
          text: "#FFF5F9",
          muted: "#C8A8C9",
          dim: "#7E5B82",
          border: "rgba(255, 46, 147, 0.25)",
          borderHover: "rgba(255, 123, 84, 0.55)",
        },
        neon: {
          pink: "#FF2E93",
          coral: "#FF7B54",
          gold: "#FFD166",
          mint: "#00F5A0",
          cyan: "#FF2E93",
          blue: "#FF7B54",
          purple: "#d946ef",
          violet: "#a855f7",
          emerald: "#00F5A0",
          amber: "#FFD166",
        },
        dark: {
          bg: "#0D0618",
          card: "#170B29",
          surface: "#211038",
          border: "rgba(255, 46, 147, 0.25)",
        },
      },
      backgroundImage: {
        "vice-gradient": "linear-gradient(135deg, #FF2E93 0%, #FF7B54 55%, #FFD166 100%)",
        "vice-gradient-h": "linear-gradient(90deg, #FF2E93 0%, #FF7B54 50%, #FFD166 100%)",
        "vice-glass": "linear-gradient(180deg, rgba(33, 16, 56, 0.85) 0%, rgba(23, 11, 41, 0.95) 100%)",
        "vice-glow": "radial-gradient(circle at top center, rgba(255, 46, 147, 0.15) 0%, rgba(255, 123, 84, 0.08) 45%, transparent 70%)",
      },
      fontFamily: {
        mono: ["Consolas", "Monaco", "'Courier New'", "monospace"],
        sans: ["-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      boxShadow: {
        "neon-pink": "0 0 16px rgba(255, 46, 147, 0.4), 0 0 32px rgba(255, 46, 147, 0.2)",
        "neon-coral": "0 0 16px rgba(255, 123, 84, 0.4), 0 0 32px rgba(255, 123, 84, 0.2)",
        "neon-gold": "0 0 16px rgba(255, 209, 102, 0.4), 0 0 32px rgba(255, 209, 102, 0.2)",
        "vice-glow": "0 0 20px rgba(255, 46, 147, 0.35), 0 0 40px rgba(255, 123, 84, 0.15)",
        "glass-dark": "0 8px 32px 0 rgba(13, 6, 24, 0.55)",
        "glass-light": "0 8px 24px 0 rgba(255, 46, 147, 0.08)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 8px rgba(255, 46, 147, 0.3)" },
          "100%": { boxShadow: "0 0 24px rgba(255, 123, 84, 0.7)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
