/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      aria: {
        'sort-none': 'sort="none"',
        asc: 'sort="ascending"',
        desc: 'sort="descending"',
      },
      colors: {
        'primary': {
          DEFAULT: '#EE761C',
            50: '#FCEADC',
            100: '#FBDDC7',
            200: '#F8C39C',
            300: '#F4AA71',
            400: '#F19047',
            500: '#EE761C',
            600: '#C35C0F',
            700: '#8F430B',
            800: '#5B2B07',
            900: '#271203',
            950: '#0D0601'
          },
          'secondary': '#2B2A29'
      },
      fontFamily: {
        "sans": ["Poppins", defaultTheme.fontFamily.sans],
        "barlow": ["Barlow Semi Condensed", defaultTheme.fontFamily.sans]
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar'),
  ],
}