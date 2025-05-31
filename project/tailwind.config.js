/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E53935',
        'primary-dark': '#C62828',
        background: '#121212',
        'surface-1': '#1E1E1E',
        'surface-2': '#2A2A2A',
      },
    },
  },
  plugins: [],
};