import { useOutletContext } from "@remix-run/react";
import { Box, Container, Group, Space } from "dappkit";
import merklConfig from "merkl.config";
import CampaignLibrary from "src/components/element/campaign/CampaignLibrary";
import Participate from "src/components/element/participate/Participate";
import { ErrorContent } from "src/components/layout/ErrorContent";
import type { OutletContextOpportunity } from "./_merkl.opportunities.$chain.$type.$id";

export default function Index() {
  const { opportunity, chain } = useOutletContext<OutletContextOpportunity>();

  return (
    <Container>
      <Space size="md" />
      <Group className="grid grid-wrap grid-cols-[1fr] lg:grid-cols-[minmax(400px,1fr),minmax(300px,360px)]">
        <Group>
          <CampaignLibrary opportunity={opportunity} chain={chain} />
        </Group>
        {/* <Group className="grid grid-cols-1 gap-md md:grid-cols-[1fr,300px]"> */}
        {merklConfig.deposit && (
          <Group className="flex-col">
            <Box className="w-full">
              <Participate displayMode={"deposit"} opportunity={opportunity} />
            </Box>
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
