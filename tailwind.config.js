/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0f172a',
          card: '#1e293b',
          dark: '#0a0f1a',
          hover: '#263349',
        },
        accent: {
          red: '#E94560',
          gold: '#F5A623',
          teal: '#14B8A6',
          green: '#10B981',
          blue: '#3B82F6',
          pink: '#EC4899',
          purple: '#8B5CF6',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
