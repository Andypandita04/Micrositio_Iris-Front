/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          light: '#ffffff',
          dark: '#121212',
        },
        primary: {
          purple: '#864080',
          yellow: '#FFD00F',
        },
        secondary: {
          purple: '#9336FF',
          red: '#802D4A',
          orange: '#FF5822',
        },
        tertiary: {
          green: '#AFD136',
        }
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'bounce-medium': 'bounce 2s infinite',
        'bounce-fast': 'bounce 1s infinite',
      },
    },
  },
  plugins: [],
};