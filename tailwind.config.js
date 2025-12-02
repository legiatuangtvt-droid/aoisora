/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Quét tất cả các file HTML và JS trong thư mục public
    './public/**/*.html',
    './public/**/*.js',

    // Quét tất cả các file JSX và TSX trong thư mục src của ứng dụng React
    './react-app/src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
