/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#09111f',
          card: '#111c2d',
          dark: '#060d18',
          hover: '#1a2840',
          surface: '#0e1929',
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
