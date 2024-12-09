import type { Campaign } from "@merkl/api";
import {
  type Component,
  Divider,
  Dropdown,
  Group,
  Hash,
  Icon,
  OverrideTheme,
  PrimitiveTag,
  Text,
  mergeClass,
} from "dappkit";
import moment from "moment";
import { useCallback, useState } from "react";
import useCampaign from "src/hooks/resources/useCampaign";
import Chain from "../chain/Chain";
import Token from "../token/Token";
import { CampaignRow } from "./CampaignTable";
import CampaignTooltipDates from "./CampaignTooltipDates";
import RestrictionsCollumn from "./tableCollumns/RestrictionsCollumn";

export type CampaignTableRowProps = Component<{
  campaign: Campaign;
  startsOpen?: boolean;
}>;

export default function CampaignTableRow({ campaign, startsOpen, className, ...props }: CampaignTableRowProps) {
  const { time, profile, dailyRewards, active, amount } = useCampaign(campaign);
  const [isOpen, setIsOpen] = useState(startsOpen);

  const toggleIsOpen = useCallback(() => setIsOpen(o => !o), []);

  return (
    <CampaignRow
      {...props}
      className={mergeClass("cursor-pointer py-4", className)}
      onClick={toggleIsOpen}
      chainColumn={<Chain chain={campaign.chain} />}
      restrictionsColumn={<RestrictionsCollumn campaign={campaign} />}
      dailyRewardsColumn={
        <Group className="align-middle items-center">
          <OverrideTheme accent={"good"}>
            <Icon className={active ? "text-accent-10" : "text-main-10"} remix="RiCircleFill" />
          </OverrideTheme>
          <Token token={campaign.rewardToken} amount={dailyRewards} format="amount_price" />
        </Group>
      }
      timeRemainingColumn={
        <Dropdown content={<CampaignTooltipDates campaign={campaign} />}>
          <PrimitiveTag look="base">{time}</PrimitiveTag>
        </Dropdown>
      }
      arrowColumn={<Icon remix={!isOpen ? "RiArrowDownSLine" : "RiArrowUpSLine"} />}>
      {isOpen && (
        <div className="animate-drop">
          <Group className="flex-nowrap p-lg" size="lg">
            <Group className="justify-between flex-col size-full">
              <Text size="md">Campaign information</Text>
              <div className="flex justify-between">
                <Text size="sm">Total</Text>
                <Token token={campaign.rewardToken} amount={amount} format="amount_price" />
              </div>
              <div className="flex justify-between">
                <Text size="sm">Dates</Text>
                <span className="flex">
                  <Dropdown content={<CampaignTooltipDates campaign={campaign} />}>
                    <Text size="sm" className="flex">
                      {moment.unix(Number(campaign.startTimestamp)).format("DD MMMM YYYY")}
                      <Icon remix="RiArrowRightLine" />
                      {moment.unix(Number(campaign.endTimestamp)).format("DD MMMM YYYY")}
                    </Text>
                  </Dropdown>
                </span>
              </div>
              {/* <div className="flex justify-between">
                <Text size="sm">Last snapshot</Text>
                <Time timestamp={BigInt(campaign.) * BigInt(1000)} />
              </div> */}
              <div className="flex justify-between">
                <Text size="sm">Campaign creator</Text>
                <Hash size="sm" format="short" copy>
                  {campaign.creatorAddress}
                </Hash>
              </div>
              <div className="flex justify-between">
                <Text size="sm">Campaign id</Text>
                <Hash format="short" size="sm" copy>
                  {campaign.campaignId}
                </Hash>
              </div>
            </Group>
            <Divider vertical={true} />
            <Group className="justify-between flex-col size-full">
              <Group className="flex justify-between item-center">
                <Text size="sm">Incentivized Liquidity</Text>
                {profile}
              </Group>

              {/* Todo: Need to be refacto @Clement */}
              <Group>
                {campaign.params.blacklist.length > 0 && (
                  <Dropdown
                    content={campaign.params.blacklist.map((address: string) => <Text key={address}>{address}</Text>)}>
                    <PrimitiveTag look="soft" size="sm">
                      Blacklist ({campaign.params.blacklist.length} address)
                    </PrimitiveTag>
                  </Dropdown>
                )}

                {campaign.params.whitelist.length > 0 && (
                  <Dropdown
                    content={campaign.params.whitelist.map((address: string) => <Text key={address}>{address}</Text>)}>
                    <PrimitiveTag look="soft" size="sm">
                      Whitelist ({campaign.params.whitelist.length} address)
                    </PrimitiveTag>
                  </Dropdown>
                )}
              </Group>
            </Group>
          </Group>
        </div>
      )}
    </CampaignRow>
  );
}
