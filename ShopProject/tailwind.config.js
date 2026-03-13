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

        vault: {
          mud: "#4F4631",
          sage: "#314F4A",
          slate: "#31344F",
          green: "#00C12B",
          red: "#F50606",
          yellow: "#F5DD06",
          orange: "#F57906",
          cyan: "#06CAF5",
          blue: "#063AF5",
          purple: "#7D06F5",
          pink: "#F506A4",
        }
      },
      fontFamily: {
        satoshi: ["Satoshi", "sans-serif"],
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
  safelist: [
    'bg-vault-mud',
    'bg-vault-sage',
    'bg-vault-slate',
    'bg-vault-green',
    'bg-vault-red',
    'bg-vault-yellow',
    'bg-vault-orange',
    'bg-vault-cyan',
    'bg-vault-blue',
    'bg-vault-purple',
    'bg-vault-pink',
    'bg-black',
    'bg-white'
  ],
  plugins: [],
}