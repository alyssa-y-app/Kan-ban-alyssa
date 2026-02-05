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
        bg: {
          primary: '#0B0F14',
          surface: '#121826',
          elevated: '#161D2F',
        },
        accent: {
          primary: '#4F8CFF',
          success: '#22C55E',
          warning: '#F59E0B',
        },
        text: {
          primary: '#E5E7EB',
          secondary: '#9CA3AF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
