import type { Campaign } from "@merkl/api";
import { Button, Divider, Group, Icon, Text, Value } from "packages/dappkit/src";
import useCampaign from "src/hooks/resources/useCampaign";

export type IProps = {
  campaign: Campaign;
};

export default function CampaignTooltipToken({ campaign }: IProps) {
  const { amount, amountUsd } = useCampaign(campaign);

  return (
    <>
      <Group>
        <Group>
          <Icon remix={"RiMoneyDollarCircleLine"} />
          <Text look="bold">Total rewards</Text>
          <Group>
            <Icon src={campaign.rewardToken.icon} />
            <Value look={"base"} format="0,0a">
              {amount}
            </Value>
            <Value look={"base"} format="$0,0.#">
              {amountUsd}
            </Value>
          </Group>
        </Group>
      </Group>
      <Divider look="soft" horizontal />
      <Group className="flex-col" size="sm">
        <Button to={`/token/${campaign.rewardToken.symbol}`} size="sm" look="bold">
          {campaign.rewardToken.symbol} on Merkl
        </Button>
        <Button size="sm" look="bold">
          {campaign.rewardToken.symbol} on Etherscan
        </Button>
      </Group>
    </>
  );
}
