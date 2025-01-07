import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Container, Group, Space, Title } from "dappkit/src";
import config from "merkl.config";
import { useWalletContext } from "packages/dappkit/src/context/Wallet.context";
import { OpportunityService } from "src/api/services/opportunity/opportunity.service";
import { ProtocolService } from "src/api/services/protocol.service";
import OpportunityLibrary from "src/components/element/opportunity/OpportunityLibrary";

export async function loader({ params: { id }, request }: LoaderFunctionArgs) {
  const opportunityFilters = { mainProtocolId: id } as const;

  const { opportunities, count } = await OpportunityService.getManyFromRequest(request, opportunityFilters);
  const { opportunities: featuredOpportunities } = await OpportunityService.getFeatured(request, opportunityFilters);

  //TODO: embed this in client/service
  const { protocols } = await ProtocolService.getManyFromRequest(request);

  return json({ opportunities, count, protocols, featuredOpportunities });
}

export default function Index() {
  const { chains } = useWalletContext();
  const { opportunities, count, featuredOpportunities } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Space size="xl" />
      <Group size="xl" className="py-xl flex-col">
        {config.opportunity.featured.enabled && (
          <>
            <Title className="!text-main-11" h={3}>
              BEST OPPORTUNITIES
            </Title>
            <OpportunityLibrary forceView={"cells"} hideFilters opportunities={featuredOpportunities} />
            <Space size="xl" />
            <Title className="!text-main-11" h={3}>
              ALL OPPORTUNITIES
            </Title>
          </>
        )}
        <OpportunityLibrary exclude={["protocol"]} opportunities={opportunities} count={count} chains={chains} />
      </Group>
    </Container>
  );
}
