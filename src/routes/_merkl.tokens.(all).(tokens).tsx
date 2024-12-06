import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Container, Space } from "packages/dappkit/src";
import { TokenService } from "src/api/services/token.service";
import TokenLibrary from "src/components/element/token/TokenLibrary";

export async function loader({ request }: LoaderFunctionArgs) {
  const { tokens, count } = await TokenService.getManyFromRequest(request);

  return json({ tokens, count });
}

export default function Index() {
  const { tokens, count } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Space size="xl" />
      <TokenLibrary tokens={tokens} count={count} />
    </Container>
  );
}
