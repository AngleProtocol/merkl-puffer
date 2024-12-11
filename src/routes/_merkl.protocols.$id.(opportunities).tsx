import { json } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { Container, Space } from "dappkit/src";
import { ChainService } from "src/api/services/chain.service";
import OpportunityLibrary from "src/components/element/opportunity/OpportunityLibrary";
import type { OutletContextProtocol } from "./_merkl.protocols.$id";

export async function loader() {
  const chains = await ChainService.getAll();
  return json({ chains });
}

export default function Index() {
  const { chains } = useLoaderData<typeof loader>();
  const { opportunities, count } = useOutletContext<OutletContextProtocol>();

  return (
    <Container>
      <Space size="md" />
      <OpportunityLibrary opportunities={opportunities} count={count} chains={chains} />
    </Container>
  );
}
