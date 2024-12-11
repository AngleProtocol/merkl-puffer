import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, json, useLoaderData, useRouteError } from "@remix-run/react";
import { DAppProvider, Group, Icon, Title } from "dappkit";
import config from "../merkl.config";
import dappkitStyles from "../packages/dappkit/src/style.css?url";
import { ChainService } from "./api/services/chain.service";
import LoadingIndicator from "./components/layout/LoadingIndicator";
import styles from "./index.css?url";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: dappkitStyles,
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

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <DAppProvider
      chains={data.chains}
      modes={config.modes}
      themes={config.themes}
      sizing={config.sizing}
      config={config.wagmi}>
      <LoadingIndicator />
      <Outlet />
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: needed for browser ENV
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(data?.ENV)}`,
        }}
      />
    </DAppProvider>
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

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  return (
    <DAppProvider chains={[]} modes={config.modes} themes={config.themes} sizing={config.sizing} config={config.wagmi}>
      <Group className="h-full flex-col justify-center m-auto w-min">
        <Icon size="xl" className="!w-[100px] h-[100px]" remix="RiAlertFill" />
        <Title h={1} className="text-nowrap">
          Service unavailable
        </Title>
      </Group>
    </DAppProvider>
  );
}
