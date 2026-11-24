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
        canvas: "#F6F5F4",
        surface: "#FFFFFF",
        surfaceAlt: "#FFFFFE",
        pill: "#F1F0EF",
        borderSubtle: "#ECEBEA",
        brandDark: "#242424",
        textPrimary: "#242424",
        textSecondary: "rgb(55, 55, 55)",
        textMuted: "rgb(42, 42, 42)",
      },
      fontFamily: {
        otterco: ['"Otterco Regular"', "sans-serif"],
        ottercoMedium: ['"Otterco Medium"', "sans-serif"],
        ottercoLight: ['"Otterco Light"', "sans-serif"],
        ottercoDisplay: ['"Otterco Display Medium"', "sans-serif"],
        ottercoDisplaySemiBold: ['"Otterco Display SemiBold"', "sans-serif"],
        outfit: ['"Outfit"', "sans-serif"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 25s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
