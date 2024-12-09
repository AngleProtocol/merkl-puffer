import type { Campaign } from "@merkl/api";
import { type Component, Hash, Text, mergeClass } from "dappkit";
import type { IRewards } from "src/api/services/reward.service";
import { parseUnits } from "viem";
import Token from "../token/Token";
import { LeaderboardRow } from "./LeaderboardTable";

export type CampaignTableRowProps = Component<{
  row: IRewards;
  rank: number;
  campaign: Campaign;
}>;

export default function LeaderboardTableRow({ row, rank, className, ...props }: CampaignTableRowProps) {
  const { campaign } = props;

  return (
    <LeaderboardRow
      {...props}
      className={mergeClass("cursor-pointer", className)}
      rankColumn={<Text>#{rank}</Text>}
      addressColumn={
        <Hash format="short" copy>
          {row?.recipient}
        </Hash>
      }
      rewardsColumn={<Token token={campaign.rewardToken} format="amount_price" amount={parseUnits(row?.amount, 0)} />}
      protocolColumn={<Text>{row?.reason?.split("_")[0]}</Text>}
    />
  );
}
