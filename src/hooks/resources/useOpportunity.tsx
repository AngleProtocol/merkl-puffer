import { Icon } from "dappkit";
import { useMemo } from "react";
import type { Opportunity } from "src/api/services/opportunity/opportunity.model";
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

    return [protocol, action, chain, ...tokens, status].filter(a => a);
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

  return { link, icons, description, ...opportunity, tags };
}
