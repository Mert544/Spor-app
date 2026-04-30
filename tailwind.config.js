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
        'fadeInUp': 'fadeInUp 0.22s ease-out',
        'fadeIn':   'fadeIn 0.18s ease-out',
        'scaleIn':  'scaleIn 0.15s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
