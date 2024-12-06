import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Container, Space } from "dappkit";
import { ChainService } from "src/api/services/chain.service";
import { OpportunityService } from "src/api/services/opportunity/opportunity.service";
import OpportunityLibrary from "src/components/element/opportunity/OpportunityLibrary";
import { getStatus } from "src/config/status";

export async function loader({ params: { status: _status }, request }: LoaderFunctionArgs) {
  const status = getStatus(_status ?? "");
  if (!status) throw new Error("Unknown status");

  const { opportunities, count } = await OpportunityService.getManyFromRequest(request, { status });
  const chains = await ChainService.getAll();

  return json({ opportunities, chains, count });
}

export default function Index() {
  const { opportunities, chains, count } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Space size="md" />
      <OpportunityLibrary exclude={["status"]} count={count} opportunities={opportunities} chains={chains} />
    </Container>
  );
}
