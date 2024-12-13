import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Container, Space } from "dappkit";
import { Cache } from "src/api/services/cache.service";
import { ChainService } from "src/api/services/chain.service";
import { OpportunityService } from "src/api/services/opportunity/opportunity.service";
import { ProtocolService } from "src/api/services/protocol.service";
import OpportunityLibrary from "src/components/element/opportunity/OpportunityLibrary";
import { ErrorContent } from "src/components/layout/ErrorContent";

export async function loader({ request }: LoaderFunctionArgs) {
  const { opportunities, count } = await OpportunityService.getManyFromRequest(request);

  const chains = await ChainService.getAll();
  const protocols = await ProtocolService.getAll();

  return json({ opportunities, chains, count, protocols });
}

export const clientLoader = Cache.wrap("opportunities", 300);

export default function Index() {
  const { opportunities, chains, count, protocols } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Space size="md" />
      <OpportunityLibrary opportunities={opportunities} chains={chains} count={count} protocols={protocols} />
    </Container>
  );
}

export function ErrorBoundary() {
  return <ErrorContent />;
}
