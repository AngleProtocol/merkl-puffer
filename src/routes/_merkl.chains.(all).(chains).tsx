import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Container, Space } from "packages/dappkit/src";
import { Cache } from "src/api/services/cache.service";
import { ChainService } from "src/api/services/chain.service";
import ChainLibrary from "src/components/element/chain/ChainLibrary";

export async function loader(_args: LoaderFunctionArgs) {
  const chains = await ChainService.getAll();

  return json({ chains, count: chains.length });
}

export const clientLoader = Cache.wrap("chains", 300);

export default function Index() {
  const { chains, count } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Space size="xl" />
      <ChainLibrary chains={chains} count={count} />
    </Container>
  );
}
