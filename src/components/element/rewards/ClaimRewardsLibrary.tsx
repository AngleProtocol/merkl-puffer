import type { Reward } from "@merkl/api";
import { Group } from "dappkit";
import { useMemo } from "react";
import ClaimRewardsByOpportunity from "./byOpportunity/ClaimRewardsByOpportunity";

export type ClaimRewardsLibraryProps = {
  rewards: Reward[];
  from: string;
};

export default function ClaimRewardsLibrary({ from, rewards }: ClaimRewardsLibraryProps) {
  const flatenedRewards = useMemo(
    () =>
      rewards.flatMap(({ chain, rewards, distributor }) =>
        rewards.flatMap(reward =>
          reward.breakdowns.flatMap(breakdown => ({ chain, distributor, breakdown, token: reward.token })),
        ),
      ),
    [rewards],
  );
  return (
    <Group className="flex-row w-full [&>*]:flex-grow">
      {/* Todo need to be config implemented for subprojects */}
      <ClaimRewardsByOpportunity from={from} rewards={flatenedRewards} />
      {/* {rewards?.map((reward, index) => (
        <ClaimRewardsChainTableRow {...{ from, reward }} key={reward.chain?.id ?? index} />
      ))} */}
    </Group>
  );
}
