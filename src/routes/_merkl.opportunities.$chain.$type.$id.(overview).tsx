import { useOutletContext } from "@remix-run/react";
import merklConfig from "merkl.config";
import { Container, Group, Space } from "packages/dappkit/src";
import { Suspense } from "react";
import CampaignLibrary from "src/components/element/campaign/CampaignLibrary";
import Participate from "src/components/element/participate/Participate.client";
import { ErrorContent } from "src/components/layout/ErrorContent";
import type { OutletContextOpportunity } from "./_merkl.opportunities.$chain.$type.$id";

export default function Index() {
  const { opportunity, chain } = useOutletContext<OutletContextOpportunity>();

  return (
    <Container>
      <Space size="md" />
      <Group>
        <Group className="flex-grow">
          <CampaignLibrary opportunity={opportunity} chain={chain} />
        </Group>
        {/* <Group className="grid grid-cols-1 gap-md md:grid-cols-[1fr,300px]"> */}
        {merklConfig.deposit && (
          <Group className="flex-col">
            <Suspense>
              <Participate opportunity={opportunity} />
            </Suspense>
          </Group>
        )}
      </Group>
      {/* </Group> */}
    </Container>
  );
}

export function ErrorBoundary() {
  return <ErrorContent />;
}
