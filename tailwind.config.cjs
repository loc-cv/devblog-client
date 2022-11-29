/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Cabin', 'sans-serif'],
      mono: ['"IBM Plex Mono"', 'monospace'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
