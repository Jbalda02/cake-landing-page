/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Ensure that your content includes the right file extensions
  ],
  theme: {
    extend: {
      colors:{
        'white-background': '#D2CDD3'
      }
    },
  },
  plugins: [],
};