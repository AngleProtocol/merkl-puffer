import { useOutletContext } from "@remix-run/react";
import { Box, Container, Divider, Group, Space, Title } from "dappkit";
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
      <Group>
        <Group className="flex-grow">
          <CampaignLibrary opportunity={opportunity} chain={chain} />
        </Group>
        {/* <Group className="grid grid-cols-1 gap-md md:grid-cols-[1fr,300px]"> */}
        {merklConfig.deposit && (
          <Group className="flex-col">
            <Box className="w-full">
              <Group className="p-md">
                <Title className="!text-main-11" h={5}>
                  Supply
                </Title>
              </Group>
              <Divider horizontal look="hype" />
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
