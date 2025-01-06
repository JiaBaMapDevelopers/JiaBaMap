/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        index_searchBG: "url('/src/assets/index/index_searchBG.jpg')",
        index_btns_f: "url('/src/assets/index/index_fineDining.jpg')",
        index_btns_b: "url('/src/assets/index/index_brunch.jpg')",
        index_btns_h: "url('/src/assets/index/index_hotPot.jpg')",
        index_btns_j: "url('/src/assets/index/index_japan.jpg')",
        index_btns_q: "url('/src/assets/index/index_bbq.jpg')",
        index_btns_d: "url('/src/assets/index/index_dessert.jpg')",
        index_btns_c: "url('/src/assets/index/index_chinese.jpg')",
        index_btns_k: "url('/src/assets/index/index_korean.jpg')",
        index_btns_a: "url('/src/assets/index/index_alchol.jpg')",
        index_btns_i: "url('/src/assets/index/index_izayaka.jpg')",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
