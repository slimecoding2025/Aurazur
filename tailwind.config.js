/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2A7D6F',
          50: '#E8F5F3',
          100: '#C5E8E2',
          200: '#8DD0C6',
          300: '#56B8AA',
          400: '#2A9E8E',
          500: '#2A7D6F',
          600: '#216358',
          700: '#184941',
          800: '#10302A',
          900: '#081814',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
};
