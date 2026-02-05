import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ytruck: {
          red: '#FF3B30',
          coral: '#FF6B5A',
          orange: '#FF9500',
          dark: '#0A0A0A',
          darker: '#050505',
          gray: '#1C1C1E',
          'gray-light': '#2C2C2E',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
