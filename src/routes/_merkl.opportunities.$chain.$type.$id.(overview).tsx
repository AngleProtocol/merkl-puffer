import { useOutletContext } from "@remix-run/react";
import { Container, Space } from "packages/dappkit/src";
import CampaignLibrary from "src/components/element/campaign/CampaignLibrary";
import { ErrorContent } from "src/components/layout/ErrorContent";
import type { OutletContextOpportunity } from "./_merkl.opportunities.$chain.$type.$id";

export default function Index() {
  const { opportunity, chain } = useOutletContext<OutletContextOpportunity>();

  return (
    <Container>
      <Space size="md" />
      <CampaignLibrary opportunity={opportunity} chain={chain} />
      {/* <Group className="grid grid-cols-1 gap-md md:grid-cols-[1fr,300px]"> */}
      {/* <Group className="flex-col">
          <Participate opportunity={opportunity as Opportunity} />
        </Group> */}
      {/* </Group> */}
    </Container>
  );
}

export function ErrorBoundary() {
  return <ErrorContent />;
}
