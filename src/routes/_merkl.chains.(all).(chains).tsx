import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { useNavigate } from "@remix-run/react";
import { Container, Space } from "packages/dappkit/src";
import { useEffect } from "react";
import { Cache } from "src/api/services/cache.service";
import { ChainService } from "src/api/services/chain.service";
import ChainLibrary from "src/components/element/chain/ChainLibrary";
import useChains from "src/hooks/resources/useChains";

export async function loader(_args: LoaderFunctionArgs) {
  const chains = await ChainService.getAll();
  return json({ chains, count: chains.length });
}

export const clientLoader = Cache.wrap("chains", 300);

export default function Index() {
  const { chains, count } = useLoaderData<typeof loader>();
  const { isSingleChain } = useChains(chains);
  const navigate = useNavigate();

  // TODO: need to be refacto when we refactor the custom router
  useEffect(() => {
    if (!isSingleChain) return;
    navigate("/");
  }, [isSingleChain, navigate]);

  return (
    <Container>
      <Space size="xl" />
      <ChainLibrary chains={chains} count={count} />
    </Container>
  );
}
