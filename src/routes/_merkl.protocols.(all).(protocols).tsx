import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Container, Space } from "packages/dappkit/src";
import { Cache } from "src/api/services/cache.service";
import { ProtocolService } from "src/api/services/protocol.service";
import ProtocolLibrary from "src/components/element/protocol/ProtocolLibrary";

export async function loader({ request }: LoaderFunctionArgs) {
  const { protocols, count } = await ProtocolService.getManyFromRequest(request);

  return json({ protocols, count });
}

export const clientLoader = Cache.wrap("protocols", 300);

export default function Index() {
  const { protocols, count } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Space size="xl" />
      <ProtocolLibrary protocols={protocols} count={count} />
    </Container>
  );
}
