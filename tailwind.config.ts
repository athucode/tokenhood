import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        asphalt: "#17181C", // page background
        concrete: "#25272D", // cards
        curb: "#3A3D45", // borders
        chalk: "#F1EEE4", // text
        spray: "#FF3EA5", // primary accent (spray-paint magenta)
        tag: "#3DE3FF", // secondary accent (tag cyan)
        caution: "#FFD21F", // warnings / prices
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        block: "4px 4px 0 0 #FF3EA5",
        blockTag: "4px 4px 0 0 #3DE3FF",
      },
    },
  },
  plugins: [],
};
export default config;
