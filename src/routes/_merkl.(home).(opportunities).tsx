import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Container, Space } from "dappkit";
import config from "merkl.config";
import { Cache } from "src/api/services/cache.service";
import { ChainService } from "src/api/services/chain.service";
import type { Opportunity } from "src/api/services/opportunity/opportunity.model";
import { OpportunityService } from "src/api/services/opportunity/opportunity.service";
import { ProtocolService } from "src/api/services/protocol.service";
import OpportunityLibrary from "src/components/element/opportunity/OpportunityLibrary";
import { ErrorContent } from "src/components/layout/ErrorContent";

export async function loader({ request }: LoaderFunctionArgs) {
  const { opportunities, count } = await OpportunityService.getManyFromRequest(request);
  let featuredOpportunities: Opportunity[] = [];

  if (config.opportunity.featured.enabled)
    featuredOpportunities = (await OpportunityService.getMany({ items: 10 })).opportunities;

  const chains = await ChainService.getAll();
  const protocols = await ProtocolService.getAll();
  return json({ opportunities, chains, count, protocols, featuredOpportunities: featuredOpportunities });
}

export const clientLoader = Cache.wrap("opportunities", 300);

export default function Index() {
  const { opportunities, chains, count, protocols, featuredOpportunities } = useLoaderData<typeof loader>();
  return (
    <Container>
      <Space size="xl" />
      <OpportunityLibrary
        opportunities={opportunities}
        chains={chains}
        count={count}
        protocols={protocols}
        featuredOpportunities={featuredOpportunities}
      />
    </Container>
  );
}

export function ErrorBoundary() {
  return <ErrorContent />;
}
