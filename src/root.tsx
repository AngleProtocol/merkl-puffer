import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration, json,
  useLoaderData
} from "@remix-run/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DAppProvider } from "dappkit";
import dappkitStyles from "dappkit/src/style.css?url";
import LoadingIndicator from "merkl-app-core/src/components/layout/LoadingIndicator";
import merklConfig from "merkl-app-core/src/config";
import styles from "merkl-app-core/src/index.css?url";
import { Cache } from "merkl-app-core/src/modules/cache/cache.service";
import { ChainService } from "merkl-app-core/src/modules/chain/chain.service";
import clientStyles from "./index.css?url";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: dappkitStyles,
    as: "style",
  },
  {
    rel: "stylesheet",
    href: clientStyles,
    as: "style",
  },
  {
    rel: "stylesheet",
    href: styles,
    as: "style",
  },
];

export async function loader(_args: LoaderFunctionArgs) {
  const chains = await ChainService.getAll();

  if (!chains) throw new Response("Unable to fetch chains", { status: 500 });

  return json({ ENV: { API_URL: process.env.API_URL }, chains });
}

export const clientLoader = Cache.wrap("root", 300);
const queryClient = new QueryClient();

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <QueryClientProvider client={queryClient}>
      <DAppProvider
        walletOptions={merklConfig.walletOptions}
        chains={data.chains}
        modes={merklConfig.modes}
        themes={merklConfig.themes}
        sizing={merklConfig.sizing}
        config={merklConfig.wagmi}>
        <LoadingIndicator />
        <Outlet />
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: needed for browser ENV
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data?.ENV)}`,
          }}
        />
      </DAppProvider>
    </QueryClientProvider>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
