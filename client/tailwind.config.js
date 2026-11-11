
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        awadh: {
          navy: "#071C3A",
          gold: "#B88632",
          light: "#F8FAFC",
        },
      },
    },
  },
  plugins: [],
};
