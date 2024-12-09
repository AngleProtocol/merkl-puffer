import type { Campaign } from "@merkl/api";
import moment from "moment";
import { Divider, Group, Icon, Text } from "packages/dappkit/src";

export type IProps = {
  campaign: Campaign;
};

export default function CampaignTooltipDates({ campaign }: IProps) {
  return (
    <>
      <Group>
        <Icon remix={"RiCalendar2Line"} />
        <Text look="bold">Campaign dates</Text>
        <Divider look="soft" horizontal />
        <Group className="flex-col">
          <Group>
            <Text size="sm" look={"bold"}>
              Start
            </Text>
            <Text size="sm">
              {moment.unix(Number(campaign.startTimestamp)).format("DD MMMM YYYY ha (UTC Z)").replace("+", "+ ")}
            </Text>
          </Group>
          <Group>
            <Text size="sm" look={"bold"}>
              End
            </Text>
            <Text size="sm">{moment.unix(Number(campaign.endTimestamp)).format("DD MMMM YYYY ha (UTC Z)")}</Text>
          </Group>
        </Group>
      </Group>
    </>
  );
}
