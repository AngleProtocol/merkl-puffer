import type { Reward } from "@merkl/api";
import { useMemo } from "react";
import { encodeFunctionData, parseAbi } from "viem";

export default function useReward(reward?: Reward, userAddress?: string, tokenAddresses?: Set<string>) {
  const claimTransaction = useMemo(() => {
    if (!userAddress || !reward) return;

    const abi = parseAbi(["function claim(address[],address[],uint256[],bytes32[][]) view returns (uint256)"]);

    const rewards = reward.rewards.filter(({ token: { address } }) => !tokenAddresses || tokenAddresses?.has(address));
    const addresses = rewards.map(({ token }) => token.address as `0x${string}`);
    const accumulatedRewards = rewards.map(({ amount }) => amount);
    const proofs = rewards.map(({ proofs }) => proofs as `0x${string}`[]);

    if (!reward) return;
    return {
      to: reward.distributor,
      data: encodeFunctionData({
        abi,
        functionName: "claim",
        args: [addresses.map(() => userAddress as `0x${string}`), addresses, accumulatedRewards, proofs],
      }),
    };
  }, [reward, userAddress, tokenAddresses]);

  return { claimTransaction };
}
