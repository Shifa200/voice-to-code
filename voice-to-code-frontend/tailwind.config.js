/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eaf4f7',   // Light Baby Blue Tint
          100: '#c3e0e5',  // Baby Blue
          500: '#41729f',  // Midnight Blue
          600: '#366187',  // Darker Midnight Blue
          700: '#274472',  // Deep Dark Blue
        },
        secondary: {
          100: '#c3e0e5',  // Baby Blue
          500: '#5885af',  // Blue Gray
        },
        gradient: {
          from: '#41729f', // Midnight Blue
          to: '#274472',   // Dark Blue
        }
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'pulse-slow': 'pulse 3s infinite',
        'bounce-subtle': 'bounce 2s infinite',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
