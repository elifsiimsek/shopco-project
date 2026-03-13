/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shopBlack: "#000000",       
        shopRed: "#FF3333",         
        shopYellow: "#FFC633",      
        shopGreen: "#01AB31",       
        shopGray: {
          light: "#F0F0F0",
          muted: "#F9F9F9",
          border: "rgba(0, 0, 0, 0.1)",
        },
      },
      keyframes: {
        'marquee-fixed': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'marquee-infinite': 'marquee-fixed 25s linear infinite',
        'marquee-slow': 'marquee-fixed 40s linear infinite',
        'fade-in-up': 'fade-in-up 0.7s ease-out forwards',
        'bounce-slow': 'bounce 3s infinite',
      }
    },
  },
  plugins: [],
}