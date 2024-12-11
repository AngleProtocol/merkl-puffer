import type { Opportunity } from "@merkl/api";
import type { Token } from "@merkl/api";
import { Icon, Value } from "dappkit";
import { useMemo } from "react";
import type { TagType } from "src/components/element/Tag";

export default function useOpportunity(opportunity: Opportunity) {
  const tags = useMemo(() => {
    const tokens: TagType<"token">[] = opportunity.tokens.map(t => ({
      type: "token",
      value: t,
    }));
    const action: TagType<"action"> = {
      type: "action",
      value: opportunity.action,
    };
    const protocol: TagType<"protocol"> | undefined = opportunity?.protocol && {
      type: "protocol",
      value: opportunity.protocol,
    };
    const chain: TagType<"chain"> = {
      type: "chain",
      value: opportunity?.chain,
    };
    const status: TagType<"status"> = {
      type: "status",
      value: opportunity?.status,
    };

    return [protocol, chain, action, ...tokens, status].filter(a => a);
  }, [opportunity]);

  const link = useMemo(
    () => `/opportunities/${opportunity.chain?.name?.toLowerCase?.()}/${opportunity.type}/${opportunity.identifier}`,
    [opportunity],
  );

  const icons = useMemo(
    () => opportunity.tokens.map(({ icon, address }) => <Icon key={address} rounded src={icon} />),
    [opportunity],
  );

  const description = useMemo(() => {
    const tokenSymbols = opportunity?.tokens?.reduce((str, token, index, tokens) => {
      const noSeparator = index === tokens.length || index === 0;
      const separator = index === tokens.length - 1 ? " and " : ", ";

      return str + (noSeparator ? "" : separator) + token.symbol;
    }, "");

    switch (opportunity.action) {
      case "POOL":
        return `Earn rewards by providing ${tokenSymbols} in the pool through ${opportunity.protocol?.name} or one of the liquidity management solutions related to the pool supported by Merkl.`;
      case "HOLD":
        return `Earn rewards by holding ${tokenSymbols} or staking the token in one of the supported contracts.`;
      case "LEND":
        return `Earn rewards by lending ${tokenSymbols} through ${opportunity.protocol?.name}.`;
      case "BORROW":
        return `Earn rewards by lending ${tokenSymbols} through ${opportunity.protocol?.name}.`;
      case "DROP":
        return `Check you dashboard to see if you are elligible to claim ${tokenSymbols}.`;
      default:
        break;
    }
  }, [opportunity]);

  const herosData = useMemo(() => {
    switch (opportunity.type) {
      case "CLAMM":
        return [
          {
            label: "Daily rewards",
            data: (
              <Value format="$0.00a" size={4} className="!text-main-12">
                {opportunity.dailyRewards}
              </Value>
            ),
            key: crypto.randomUUID(),
          },
          {
            label: "Max APR",
            data: (
              <Value format="0.00%" size={4} className="!text-main-12">
                {opportunity.apr / 100}
              </Value>
            ),
            key: crypto.randomUUID(),
          },
          {
            label: "Total value locked",
            data: (
              <Value format="$0.00a" size={4} className="!text-main-12">
                {opportunity.tvl}
              </Value>
            ),
            key: crypto.randomUUID(),
          },
        ];
      default:
        return;
    }
  }, [opportunity]);

  const rewardsBreakdown = useMemo(() => {
    if (!opportunity?.rewardsRecord?.breakdowns) return [];

    const tokenAddresses = opportunity.rewardsRecord.breakdowns.reduce((addresses, breakdown) => {
      return addresses.add(breakdown.token.address);
    }, new Set<string>());

    return Array.from(tokenAddresses).map(address => {
      const breakdowns = opportunity.rewardsRecord.breakdowns.filter(({ token: t }) => t.address === address);
      const amount = breakdowns?.reduce((sum, breakdown) => sum + BigInt(breakdown.amount), 0n);

      return { token: breakdowns?.[0]?.token, amount } satisfies { token: Token; amount: bigint };
    });
  }, [opportunity]);

  return { link, icons, description, rewardsBreakdown, ...opportunity, tags, herosData };
}
