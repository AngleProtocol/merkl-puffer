import type { Reward } from "@merkl/api";
import { Group } from "dappkit";
import { ClaimRewardsChainTable } from "./ClaimRewardsChainTable";
import ClaimRewardsChainTableRow from "./ClaimRewardsChainTableRow";

export type ClaimRewardsLibraryProps = {
  rewards: Reward[];
  from: string;
};

export default function ClaimRewardsLibrary({ from, rewards }: ClaimRewardsLibraryProps) {
  return (
    <Group className="flex-row w-full [&>*]:flex-grow">
      <ClaimRewardsChainTable dividerClassName={index => (index === 1 ? "bg-accent-10" : "bg-main-7")}>
        {rewards?.map((reward, index) => (
          <ClaimRewardsChainTableRow {...{ from, reward }} key={reward.chain?.id ?? index} />
        ))}
      </ClaimRewardsChainTable>
    </Group>
  );
}
