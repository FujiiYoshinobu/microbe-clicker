import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        lab: {
          background: "#0e1116",
          panel: "#1c1f26",
          accent: "#7fffd4",
          warning: "#ffb347"
        }
      },
      fontFamily: {
        mono: ["Share Tech Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"]
      },
      boxShadow: {
        glow: "0 0 15px rgba(127, 255, 212, 0.35)"
      },
      keyframes: {
        pulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" }
        },
        sparkle: {
          "0%": { opacity: 0, transform: "translateY(0)" },
          "50%": { opacity: 1, transform: "translateY(-8px)" },
          "100%": { opacity: 0, transform: "translateY(-15px)" }
        }
      },
      animation: {
        pulse: "pulse 2.5s ease-in-out infinite",
        sparkle: "sparkle 0.75s ease-out forwards"
      }
    }
  },
  plugins: []
};

export default config;
