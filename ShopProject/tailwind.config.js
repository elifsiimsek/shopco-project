/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
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
          white: "#FFFFFF",
          slate: "#31344F",
          green: "#00C12B",
          red: "#F50606",
          yellow: "#F5DD06",
          orange: "#F57906",
          cyan: "#06CAF5",
          blue: "#063AF5",
          purple: "#7D06F5",
          pink: "#F506A4",
          gray: "#504A41",
        },
      },

      fontFamily: {
        satoshi: ["Satoshi", "sans-serif"],
      },

      keyframes: {
        "marquee-fixed": {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(-50%, 0, 0)" },
        },

        "fade-in-up": {
          "0%": { opacity: "0", transform: "translate3d(0, 20px, 0)" },
          "100%": { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
      },

      animation: {
        "marquee-fast": "marquee-fixed 20s linear infinite",
        "marquee-normal": "marquee-fixed 35s linear infinite",
        "marquee-slow": "marquee-fixed 50s linear infinite",
        "marquee-infinite": "marquee-fixed 30s linear infinite",
        "marquee-brands": "marquee-fixed 25s linear infinite", 
        
        "fade-in-up": "fade-in-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
        "bounce-slow": "bounce 3s infinite",
      },
    },
  },

  safelist: [
    "bg-vault-slate",
    "bg-vault-green",
    "bg-vault-red",
    "bg-vault-yellow",
    "bg-vault-orange",
    "bg-vault-cyan",
    "bg-vault-blue",
    "bg-vault-purple",
    "bg-vault-pink",
    "bg-vault-gray",
    "bg-black",
    "bg-white"
  ],

  plugins: [],
};