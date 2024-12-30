import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { useNavigate } from "@remix-run/react";
import config from "merkl.config";
import { Container, Space } from "packages/dappkit/src";
import { useEffect } from "react";
import { Cache } from "src/api/services/cache.service";
import { TokenService } from "src/api/services/token.service";
import TokenLibrary from "src/components/element/token/TokenLibrary";

export async function loader({ request }: LoaderFunctionArgs) {
  const { tokens, count } = await TokenService.getManyFromRequest(request);

  return json({ tokens, count });
}

export const clientLoader = Cache.wrap("tokens", 300);

export default function Index() {
  const { tokens, count } = useLoaderData<typeof loader>();

  const isSingleChain = config?.chains?.length === 1;
  const navigate = useNavigate();

  // TODO: need to be refacto when we refactor the custom router
  useEffect(() => {
    if (!isSingleChain) return;
    navigate("/");
  }, [isSingleChain, navigate]);

  return (
    <Container>
      <Space size="xl" />
      <TokenLibrary tokens={tokens} count={count} />
    </Container>
  );
}
