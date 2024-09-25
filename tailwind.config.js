/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}'
  ],
  theme: {
    extend: {
      height: {
        'minus-navbar': 'calc(100vh - 49px)',
      },
    },
  },
  plugins: [],
}

