/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        shopBlack: "#000000",
        shopRed: "#FF3333",
        shopYellow: "#FFC633",
        shopGreen: "#01AB31",
        darkRed: "#8B0000",
        mud: "#4F4631",
        slateCustom: "#31344F",

        brandGreen: "#00C12B",
        brandRed: "#F50606",
        brandYellow: "#F5DD06",
        brandOrange: "#F57906",
        brandCyan: "#06CAF5",
        brandBlue: "#063AF5",
        brandPurple: "#7D06F5",
        brandPink: "#F506A4",
        brandGray: "#504A41",

        shopGray: {
          light: "#F0F0F0",
          muted: "#F9F9F9",
          border: "rgba(0, 0, 0, 0.1)",
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
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        ".tabular-nums": {
          "font-variant-numeric": "tabular-nums",
        },
      });
    },
  ],
};