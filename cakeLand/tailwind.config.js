/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Ensure that your content includes the right file extensions
  ],
  theme: {
    extend: {
      fontFamily:{
        "playwrite":['Playwrite GB S', 'sans-serif']
      },
      colors:{
        'white-background': '#D2CDD3'
      }
    },
  },
  plugins: [],
};