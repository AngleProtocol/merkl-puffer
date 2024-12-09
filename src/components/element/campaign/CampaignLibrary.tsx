import { Box, Button, Group, Icon, Text, Title } from "dappkit";
import moment from "moment";
import { useMemo, useState } from "react";
import type { OpportunityWithCampaigns } from "src/api/services/opportunity/opportunity.model";
import { CampaignTable } from "./CampaignTable";
import CampaignTableRow from "./CampaignTableRow";

export type IProps = {
  opportunity: OpportunityWithCampaigns;
};

export default function CampaignLibrary(props: IProps) {
  const { opportunity } = props;
  const [showInactive, setShowInactive] = useState(false);

  const rows = useMemo(() => {
    if (!opportunity?.campaigns) return null;
    const now = moment().unix();
    const shownCampaigns = opportunity.campaigns.filter(c => showInactive || Number(c.endTimestamp) > now);
    const startsOpen = shownCampaigns.length < 3;

    const campaignsSorted = shownCampaigns.sort((a, b) => Number(b.endTimestamp) - Number(a.endTimestamp));
    return campaignsSorted?.map(c => (
      <CampaignTableRow key={c.id} campaign={c} opportunity={opportunity} startsOpen={startsOpen} />
    ));
  }, [opportunity, showInactive]);

  return (
    <CampaignTable
      dividerClassName={index => (index < 2 ? "bg-accent-8" : "bg-main-8")}
      hideLabels={!rows?.length}
      header={
        <Group className="justify-between items-center w-full">
          <Title className="!text-main-11" h={5}>
            Campaigns
          </Title>
          <Group>
            <Button onClick={() => setShowInactive(r => !r)} look="soft">
              <Icon remix={showInactive ? "RiEyeLine" : "RiEyeOffLine"} />
              {!showInactive ? "Show" : "Hide"} Inactive
            </Button>
          </Group>
        </Group>
      }>
      {!!rows?.length ? (
        rows
      ) : (
        <Box look="base" className="py-xl*2 flex-col text-center">
          <Text>No active campaigns</Text>
          <div className="w-full">
            <Button onClick={() => setShowInactive(r => !r)} look="soft" className="m-auto">
              <Icon remix={showInactive ? "RiEyeLine" : "RiEyeOffLine"} />
              {!showInactive ? "Show" : "Hide"} Inactive
            </Button>
          </div>
        </Box>
      )}
    </CampaignTable>
  );
}
