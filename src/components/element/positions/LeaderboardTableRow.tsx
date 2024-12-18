import type { Campaign } from "@merkl/api";
import { type Component, Group, PrimitiveTag, Text, Value, mergeClass } from "dappkit";
import { useWalletContext } from "packages/dappkit/src/context/Wallet.context";
import { useMemo } from "react";
import type { IRewards } from "src/api/services/reward.service";
import { formatUnits, parseUnits } from "viem";
import Token from "../token/Token";
import User from "../user/User";
import { LeaderboardRow } from "./LeaderboardTable";

export type CampaignTableRowProps = Component<{
  row: IRewards;
  total: bigint;
  rank: number;
  campaign: Campaign;
}>;

export default function LeaderboardTableRow({ row, rank, total, className, ...props }: CampaignTableRowProps) {
  const { campaign } = props;
  const { chains } = useWalletContext();

  const share = useMemo(() => {
    const amount = formatUnits(BigInt(row?.amount), campaign.rewardToken.decimals);
    const all = formatUnits(total, campaign.rewardToken.decimals);

    return Number.parseFloat(amount) / Number.parseFloat(all);
  }, [row, total, campaign]);

  const chain = useMemo(() => {
    return chains?.find(c => c.id === campaign.computeChainId);
  }, [chains, campaign]);

  return (
    <LeaderboardRow
      {...props}
      className={mergeClass("cursor-pointer", className)}
      rankColumn={
        <Group className="flex-nowrap">
          <PrimitiveTag className="pointer-events-none" look="bold">
            #{rank}
          </PrimitiveTag>
          <PrimitiveTag size="xs" className="pointer-events-none" look="soft">
            <Value format="0.#%">{share}</Value>
          </PrimitiveTag>
        </Group>
      }
      addressColumn={<User chain={chain} address={row.recipient} />}
      rewardsColumn={<Token token={campaign.rewardToken} format="amount_price" amount={parseUnits(row?.amount, 0)} />}
      protocolColumn={<Text>{row?.reason?.split("_")[0]}</Text>}
    />
  );
}
