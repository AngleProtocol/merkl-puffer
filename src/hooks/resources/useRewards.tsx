import type { Reward } from "@merkl/api";
import config from "merkl.config";
import { Fmt } from "packages/dappkit/src/utils/formatter.service";
import { useMemo } from "react";
import { getAddress, isAddress } from "viem";

function getValueOf(chainRewards: Reward["rewards"], amount: (t: Reward["rewards"][number]) => bigint) {
  return chainRewards.reduce((sum: number, reward) => {
    if (isAddress(config.rewardsTotalClaimableMode ?? "")) {
      if (reward.token.address === getAddress(config.rewardsTotalClaimableMode)) {
        return sum + amount(reward);
      }
      return sum;
    }
    return sum + Fmt.toPrice(amount(reward), reward.token);
  }, 0);
}

export default function useRewards(rewards: Reward[]) {
  const { earned, unclaimed } = useMemo(() => {
    return rewards.reduce(
      ({ earned, unclaimed }, chain) => {
        const valueUnclaimed = getValueOf(chain.rewards, token => token.amount - token.claimed);
        const valueEarned = getValueOf(chain.rewards, token => token.amount);

        return {
          earned: earned + valueEarned,
          unclaimed: unclaimed + valueUnclaimed,
        };
      },
      { earned: 0, unclaimed: 0 },
    );
  }, [rewards]);

  const sortedRewards = useMemo(() => {
    return rewards.sort((a, b) => {
      const unclaimedA = getValueOf(a.rewards, token => token.amount - token.claimed);
      const unclaimedB = getValueOf(b.rewards, token => token.amount - token.claimed);

      return unclaimedB - unclaimedA;
    });
  }, [rewards]);

  return { earned, unclaimed, sortedRewards };
}
