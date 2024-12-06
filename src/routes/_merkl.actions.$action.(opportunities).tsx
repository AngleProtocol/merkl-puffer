import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Container, Space } from "dappkit";
import { ChainService } from "src/api/services/chain.service";
import { OpportunityService } from "src/api/services/opportunity/opportunity.service";
import OpportunityLibrary from "src/components/element/opportunity/OpportunityLibrary";
import { getAction } from "src/config/actions";

export async function loader({ params: { action: _action }, request }: LoaderFunctionArgs) {
  //TODo: isolate this elsewhere
  const action = getAction(_action ?? "");
  if (!action) throw new Error("Unknown action");

  const { opportunities, count } = await OpportunityService.getManyFromRequest(request, { action });
  const chains = await ChainService.getAll();

  return json({ opportunities, chains, count });
}

export default function Index() {
  const { opportunities, chains, count } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Space size="md" />
      <OpportunityLibrary
        exclude={["action"]}
        count={count}
        opportunities={opportunities.filter(o => o)}
        chains={chains}
      />
    </Container>
  );
}
