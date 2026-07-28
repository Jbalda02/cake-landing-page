/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', lg: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        script: ['"Playwrite GB S"', 'cursive'],
        // legacy alias, kept so any stray class keeps rendering
        playwrite: ['"Playwrite GB S"', 'cursive'],
      },
      colors: {
        // Brand aubergine — carried over from the logo, deepened for contrast
        plum: {
          50: '#f8f5fb',
          100: '#f0e9f7',
          200: '#e0d2ef',
          300: '#c8afe0',
          400: '#a983cd',
          500: '#8d5eb6',
          600: '#74459b',
          700: '#5e377d',
          800: '#4a2c62',
          900: '#331f45',
          950: '#1e1129',
        },
        // Warm neutral canvas — reads as "bakery", not "dashboard"
        cream: {
          50: '#fdfbf9',
          100: '#faf5f0',
          200: '#f3e9e0',
          300: '#e8d8ca',
          400: '#d8bfab',
          500: '#c4a289',
        },
        blush: {
          100: '#fdeef1',
          200: '#fad7de',
          300: '#f4b3c1',
          400: '#e9899e',
          500: '#d9637d',
        },
        gold: {
          300: '#e8cf9a',
          400: '#d9b56d',
          500: '#c39a4a',
        },
        ink: {
          DEFAULT: '#241c26',
          soft: '#5a4f5e',
          muted: '#8b8091',
        },
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgb(51 31 69 / 0.08), 0 8px 24px -8px rgb(51 31 69 / 0.10)',
        lift: '0 8px 20px -6px rgb(51 31 69 / 0.16), 0 20px 44px -16px rgb(51 31 69 / 0.20)',
        inset: 'inset 0 1px 0 0 rgb(255 255 255 / 0.6)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      backgroundImage: {
        'plum-sheen': 'linear-gradient(135deg, #4a2c62 0%, #331f45 55%, #1e1129 100%)',
        'cream-fade': 'linear-gradient(180deg, #fdfbf9 0%, #faf5f0 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-800px 0' },
          '100%': { backgroundPosition: '800px 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};
