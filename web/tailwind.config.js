/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#faf6f0",
        "warm-white": "#fdf9f4",
        rust: "#c4502a",
        amber: "#d4823a",
        "deep-brown": "#2c1810",
        "mid-brown": "#6b3f2a",
        "soft-gold": "#e8c068",
        sage: "#8a9e7f",
        charcoal: "#3a3230",
      },
      fontFamily: {
        playfair: ['"Playfair Display"', "serif"],
        lora: ['"Lora"', "serif"],
        dm: ['"DM Sans"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
