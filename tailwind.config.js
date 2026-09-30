/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#040E1C',
          900: '#071A33', // Primary dark background
          850: '#0D223F',
          800: '#10294A', // Card background
          750: '#143158',
          700: '#16355E', // Hover / lighter surface
          600: '#1E477A',
          500: '#2A5D9E',
        },
        bardo: {
          membership: '#EF4444',
          membershipHover: '#DC2626',
          exchange: '#0EA5E9',
          exchangeHover: '#0284C7',
          external: '#F59E0B',
          externalHover: '#D97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
