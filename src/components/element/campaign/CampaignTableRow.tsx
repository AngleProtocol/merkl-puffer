import { type Component, Group, Hash, Icon, OverrideTheme, Text, Value, mergeClass } from "dappkit";
import moment from "moment";
import Tooltip from "packages/dappkit/src/components/primitives/Tooltip";
import { useCallback, useMemo, useState } from "react";
import type { Campaign } from "src/api/services/campaigns/campaign.model";
import useCampaign from "src/hooks/resources/useCampaign";
import { formatUnits, parseUnits } from "viem";
import Chain from "../chain/Chain";
import Token from "../token/Token";
import { CampaignRow } from "./CampaignTable";
import RestrictionsCollumn from "./tableCollumns/RestrictionsCollumn";

export type CampaignTableRowProps = Component<{
  campaign: Campaign;
  startsOpen?: boolean;
}>;

export default function CampaignTableRow({ campaign, startsOpen, className, ...props }: CampaignTableRowProps) {
  const { time, profile, dailyRewards, active } = useCampaign(campaign);
  const [isOpen, setIsOpen] = useState(startsOpen);

  const toggleIsOpen = useCallback(() => setIsOpen(o => !o), []);

  const campaignAmount = useMemo(
    () => formatUnits(parseUnits(campaign.amount, 0), campaign.rewardToken.decimals),
    [campaign],
  );

  return (
    <CampaignRow
      {...props}
      className={mergeClass("cursor-pointer", className)}
      onClick={toggleIsOpen}
      chainColumn={<Chain chain={campaign.chain} />}
      restrictionsColumn={<RestrictionsCollumn campaign={campaign} />}
      dailyRewardsColumn={
        <Group className="align-middle items-center">
          <OverrideTheme accent={"good"}>
            <Icon className={active ? "text-accent-10" : "text-main-10"} remix="RiCircleFill" size="xs" />
          </OverrideTheme>
          <Token token={campaign.rewardToken} amount={dailyRewards} />
        </Group>
      }
      timeRemainingColumn={
        <Group className="py-xl">
          <Text>{time}</Text>
        </Group>
      }
      arrowColumn={<Icon remix={!isOpen ? "RiArrowDownSLine" : "RiArrowUpSLine"} />}>
      {isOpen && (
        <div className="animate-drop">
          <Group className="flex-nowrap" size="lg">
            <Group className="justify-between flex-col size-full">
              <Text size="md">Campaign information</Text>
              <div className="flex justify-between">
                <Text size="sm">Total</Text>
                <Value className="text-right" look={campaignAmount === "0" ? "soft" : "base"} format="$0,0.#">
                  {campaignAmount}
                </Value>
              </div>
              <div className="flex justify-between">
                <Text size="sm">Dates</Text>
                <span className="flex">
                  <Text size="sm">
                    {moment.unix(Number(campaign.startTimestamp)).format("DD MMMM YYYY")}-
                    {moment.unix(Number(campaign.endTimestamp)).format("DD MMMM YYYY")}
                  </Text>
                </span>
              </div>
              {/* <div className="flex justify-between">
                <Text size="sm">Last snapshot</Text>
                <Time timestamp={BigInt(campaign.) * BigInt(1000)} />
              </div> */}
              <div className="flex justify-between">
                <Text size="sm">Campaign creator</Text>
                <Hash size="sm" format="short">
                  {campaign.creatorAddress}
                </Hash>
              </div>
              <div className="flex justify-between">
                <Text size="sm">Campaign id</Text>
                <Hash format="short" size="sm">
                  {campaign.campaignId}
                </Hash>
              </div>
            </Group>
            <Group className="justify-between flex-col size-full">
              <Text size={"md"}>Conditions</Text>
              <Group className="flex justify-between item-center">
                <Text size="sm">Incentivized Liquidity</Text>
                {profile}
              </Group>
              <span className="flex justify-between">
                <Text size="sm">Blacklisted for</Text>
                <Tooltip
                  helper={
                    <div>
                      {campaign.params.blacklist.length > 0
                        ? campaign.params.blacklist.map((blacklist: string) => blacklist)
                        : "No address"}
                    </div>
                  }>
                  <Text size="sm">{campaign.params.blacklist.length} address</Text>
                </Tooltip>
              </span>
              <span className="flex justify-between">
                <Text size="sm">Whitelisted for</Text>
                <Tooltip
                  helper={
                    <div>
                      {campaign.params.whitelist.length > 0
                        ? campaign.params.whitelist.map((blacklist: string) => blacklist)
                        : "No address"}
                    </div>
                  }>
                  <Text size="sm">{campaign.params.whitelist.length} address</Text>
                </Tooltip>
              </span>
            </Group>
          </Group>
        </div>
      )}
    </CampaignRow>
  );
}
