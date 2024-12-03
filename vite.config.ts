import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { ecsstatic } from '@acab/ecsstatic/vite';
import svgr from "@svgr/rollup";

export default defineConfig({
  
  plugins: [
    svgr(),
    remix({
      appDirectory: "src",
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      
    }),
    tsconfigPaths(),
    ecsstatic()
  ],
});
