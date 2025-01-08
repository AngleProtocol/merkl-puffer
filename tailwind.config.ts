import { generateTailwindConfig } from "dappkit/src/utils/tailwind";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./{src,packages}/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
    "!./packages/**/node_modules/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: generateTailwindConfig({
    title: ["Recoleta", "serif"],
    text: ["Inter", "sans-serif"],
    mono: ["Space Mono", "monospace"],
  }),
  plugins: [],
} satisfies Config;
