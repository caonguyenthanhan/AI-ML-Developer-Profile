/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/**/*.html',
    './public/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#FFFBF7',
        gold: '#D4AF37',
        charcoal: '#242424',
        taupe: '#5D5C61',
        navy: '#03204C',
      },
      fontFamily: {
        sans: ['Inter','ui-sans-serif','system-ui'],
        serif: ['Playfair Display','ui-serif'],
        cursive: ['Great Vibes','cursive'],
      },
    },
  },
  plugins: [],
};