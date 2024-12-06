import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Container, Space } from "dappkit";
import { ChainService } from "src/api/services/chain.service";
import { OpportunityService } from "src/api/services/opportunity/opportunity.service";
import OpportunityLibrary from "src/components/element/opportunity/OpportunityLibrary";

export async function loader({ params: { symbol } }: LoaderFunctionArgs) {
  const { opportunities, count } = await OpportunityService.getMany({ tokens: symbol });
  const chains = await ChainService.getAll();

  return json({ opportunities, chains, count });
}

export default function Index() {
  const { opportunities, chains, count } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Space size="md" />
      <OpportunityLibrary opportunities={opportunities} count={count} chains={chains} />
    </Container>
  );
}
