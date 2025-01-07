import { generateTailwindConfig } from "dappkit/src/utils/tailwind";
import type { Config } from "tailwindcss";
// import config from 'merkl.Config'

export default {
  content: [
    "./{src,packages}/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
    "!./packages/**/node_modules/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    
    ...generateTailwindConfig({
      title: ["Recoleta", "serif"],
      text: ["Inter", "sans-serif"],
      mono: ["Space Mono", "monospace"],
    }),
    extend: {
      colors: {
        main: {
          1: "#E0E1E0",
          2: "#E6EAE8",
          3: "#FAFAFA",
        },
      },
    },
    // isOverrideEnabled
    //   ? {
    // colors: {
    //   main: {
    //     1: "#ffffff",
    //     2: "#ffffff",
    //     3: "#ffffff",
    //   },
    // },
    //   }
    // : {},
  },
  plugins: [],
} satisfies Config;
