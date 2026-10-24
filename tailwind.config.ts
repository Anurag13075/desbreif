import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wispr: {
          cream: "#FAF8F5",
          sand: "#F4EFE6",
          "sand-dark": "#EAE3D2",
          ink: "#141413",
          "ink-light": "#2A2926",
          muted: "#75726B",
          border: "#E2DCD0",
          "border-dark": "#141413",
          lavender: "#DDD0F7",
          "lavender-hover": "#D1BFF2",
          "lavender-light": "#F2EDFC",
          green: "#154032",
          "green-light": "#E9F2ED",
          terracotta: "#E05D38",
          amber: "#F59E0B",
          "amber-light": "#FEF3C7",
        },
      },
      fontFamily: {
        serif: ["Newsreader", "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "Courier New", "monospace"],
      },
      boxShadow: {
        tactile: "0 2px 0 0 #141413",
        "tactile-hover": "0 3px 0 0 #141413",
        "tactile-active": "0 0 0 0 #141413",
        "tactile-lg": "0 4px 0 0 #141413",
        card: "0 1px 3px rgba(20, 20, 19, 0.05), 0 10px 24px -8px rgba(20, 20, 19, 0.06)",
        dropdown: "0 10px 30px -4px rgba(20, 20, 19, 0.12), 0 2px 6px -1px rgba(20, 20, 19, 0.08)",
      },
      borderRadius: {
        "3xl": "24px",
        "4xl": "32px",
      },
    },
  },
  plugins: [],
};

export default config;
