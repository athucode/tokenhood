import type { Config } from "tailwindcss";
import containerQueries from "@tailwindcss/container-queries";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        asphalt: "#000000", // page background
        concrete: "#0E0E10", // cards
        curb: "#222226", // borders
        chalk: "#F4F4F2", // text
        smoke: "#8B8B90", // secondary text
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
  plugins: [containerQueries],
};
export default config;
