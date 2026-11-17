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
        retro: {
          bg: "#008080", // Classic Windows 95 Teal desktop background
          canvas: "#0a2430", // Deep dark retro slate
          desktop: "#006666",
          gray: {
            light: "#dfdfdf",
            main: "#c0c0c0",
            mid: "#a0a0a0",
            dark: "#808080",
            darker: "#404040",
            darkest: "#1e1e1e",
          },
          panel: "#c5c5c5",
          panelLight: "#e4e4e4",
          blue: {
            title: "#000080",
            titleGradEnd: "#1084d0",
            light: "#00a2ed",
            dark: "#000050",
          },
          amber: {
            DEFAULT: "#ff9900",
            glow: "#ffaa22",
            dark: "#b87000",
          },
          green: {
            terminal: "#00ff66",
            crt: "#33ff33",
            dark: "#008833",
          },
          cyan: "#00f0ff",
        },
      },
      fontFamily: {
        mono: ["Consolas", "Monaco", "'Courier New'", "monospace"],
        sans: ["'Segoe UI'", "Tahoma", "Geneva", "Verdana", "sans-serif"],
        pixel: ["'Courier New'", "monospace"],
      },
      boxShadow: {
        "bevel-out": "inset 1px 1px 0px #ffffff, inset -1px -1px 0px #404040, inset 2px 2px 0px #dfdfdf, inset -2px -2px 0px #808080",
        "bevel-in": "inset 1px 1px 0px #404040, inset -1px -1px 0px #ffffff, inset 2px 2px 0px #808080, inset -2px -2px 0px #dfdfdf",
        "bevel-raised": "inset 2px 2px 0px #ffffff, inset -2px -2px 0px #000000, 3px 3px 10px rgba(0,0,0,0.35)",
        "win-window": "3px 3px 0px rgba(0,0,0,0.4), 8px 8px 24px rgba(0,0,0,0.35)",
        "glow-green": "0 0 10px rgba(0,255,102,0.5)",
        "glow-amber": "0 0 10px rgba(255,176,0,0.5)",
      },
    },
  },
  plugins: [],
};
export default config;
