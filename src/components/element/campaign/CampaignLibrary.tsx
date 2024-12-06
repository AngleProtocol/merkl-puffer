import { Button, Group, Icon, Text } from "dappkit";
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
    return campaignsSorted?.map(c => <CampaignTableRow key={c.id} campaign={c} startsOpen={startsOpen} />);
  }, [opportunity, showInactive]);

  return (
    <CampaignTable
      header={
        <Group className="justify-between items-center w-full">
          <Text>Campaigns</Text>
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
        <Group className="flex-col text-center">
          <Text>No active campaign</Text>
          <div className="w-full">
            <Button onClick={() => setShowInactive(r => !r)} look="soft" className="m-auto">
              <Icon remix={showInactive ? "RiEyeLine" : "RiEyeOffLine"} />
              {!showInactive ? "Show" : "Hide"} Inactive
            </Button>
          </div>
        </Group>
      )}
    </CampaignTable>
  );
}
