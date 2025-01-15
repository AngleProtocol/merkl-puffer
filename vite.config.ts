import { ecsstatic } from "@acab/ecsstatic/vite";
import { vitePlugin as remix } from "@remix-run/dev";
import svgr from "@svgr/rollup";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    svgr(),
    remix({
      appDirectory: "src",
      ignoredRouteFiles: ["*"],
      routes(defineRoutes) {
        return defineRoutes(set => {
          function route(
            url: string,
            routeFile: string,
            indexRoute: (routeFile: string) => string,
            subRoutes: [(url: string) => string, (routeFile: string) => string][],
          ) {
            return set(url, `${indexRoute(routeFile)}.tsx`, () => {
              subRoutes.map(([_url, _route]) => set(_url(url), `${_route(routeFile)}.tsx`));
            });
          }

          //Header + Footer on each page
          set(undefined, "./packages/merkl-app-core/src/layout.tsx", () => {
            route("/", "./packages/merkl-app-core/src/modules/opportunity/routes/opportunities", file => `${file}.header`, [
              [url => url, file => `${file}.list`],
            ]);

            route(
              "/opportunities/:chain/:type/:id",
              "./packages/merkl-app-core/src/modules/opportunity/routes/opportunity.$chain.$type.$id",
              file => `${file}.header`,
              [
                [url => url, file => `${file}.campaigns`],
                [url => `${url}/leaderboard`, file => `${file}.leaderboard`],
              ],
            );

            route("/tokens/:symbol", "./packages/merkl-app-core/src/modules/token/routes/token.$symbol", tokens => `${tokens}.header`, [
              [tokens => tokens, tokens => `${tokens}.opportunities`],
            ]);

            route("/tokens", "./packages/merkl-app-core/src/modules/token/routes/tokens", tokens => `${tokens}.header`, [
              [tokens => tokens, tokens => `${tokens}.list`],
            ]);

            route("/chains", "./packages/merkl-app-core/src/modules/chain/routes/chains", chains => `${chains}.header`, [
              [chains => chains, chains => `${chains}.list`],
            ]);

            route("/chains/:id", "./packages/merkl-app-core/src/modules/chain/routes/chain.$id", chains => `${chains}.header`, [
              [chains => chains, chains => `${chains}.opportunities`],
            ]);

            route("/protocols", "./packages/merkl-app-core/src/modules/protocol/routes/protocols", protocols => `${protocols}.header`, [
              [protocols => protocols, protocols => `${protocols}.list`],
            ]);

            route("/protocols/:id", "./packages/merkl-app-core/src/modules/protocol/routes/protocol.$id", protocol => `${protocol}.header`, [
              [protocol => protocol, protocol => `${protocol}.opportunities`],
            ]);

            route("/users/:address", "./packages/merkl-app-core/src/modules/user/routes/user.$address", users => `${users}.header`, [
              [users => users, users => `${users}.rewards`],
              [users => `${users}/liquidity`, users => `${users}.liquidity`],
              [users => `${users}/claims`, users => `${users}.claims`],
            ]);

            route("/users", "./packages/merkl-app-core/src/modules/user/routes/user.none", users => `${users}.header`, [
              [users => users, users => `${users}.connect`],
            ]);

            route(
              "/transaction/:name",
              "./packages/merkl-app-core/src/modules/interaction/routes/transaction.$name",
              interaction => interaction,
              []
            );

            route(
              "/claim/:address",
              "./packages/merkl-app-core/src/modules/claim/routes/claim.$address",
              claim => claim,
              []
            );
          });
        });
      },
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
    ecsstatic(),
  ],
});
