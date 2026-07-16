import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1591DC",
          dark: "#0E6CA6",
          light: "#4FACE3",
          accent: "#0EA5E9",
        },
      },
    },
  },
  plugins: [],
};

export default config;
