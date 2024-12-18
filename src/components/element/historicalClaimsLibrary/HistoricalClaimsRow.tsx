import { Button, type Component, Icon, Value, mergeClass } from "dappkit";
import Time from "packages/dappkit/src/components/primitives/Time";
import { useWalletContext } from "packages/dappkit/src/context/Wallet.context";
import { FormatterService } from "packages/dappkit/src/utils/formatter.service";
import { useMemo } from "react";
import type { ClaimsService } from "src/api/services/claims.service";
import Token from "../token/Token";
import { HistoricalClaimsRow } from "./HistoricalClaimsTable";

export type HistoricalClaimsRowProps = Component<{
  claim: Awaited<ReturnType<typeof ClaimsService.getForUser>>[0];
}>;

export default function HistoricalClaimsTableRow({ claim, className, ...props }: HistoricalClaimsRowProps) {
  const { chains } = useWalletContext();

  const chain = useMemo(() => {
    return chains?.find(c => c.id === claim.token.chainId);
  }, [chains, claim]);

  const value = useMemo(() => {
    const amount = FormatterService.toNumber(BigInt(claim.amount), claim.token.decimals);
    return amount * (claim.token.price ?? 0);
  }, [claim]);

  return (
    <HistoricalClaimsRow
      {...props}
      className={mergeClass("cursor-pointer", className)}
      tokenColumn={<Token token={claim.token} format="amount" amount={BigInt(claim.amount)} />}
      valueColumn={<Value format="currency">{value}</Value>}
      dateColumn={<Time timestamp={claim.timestamp} />}
      transactionColumn={
        claim.txHash &&
        chain?.explorers &&
        chain.explorers.map(explorer => (
          <Button
            key={`${explorer.url}`}
            to={`${explorer.url}/transaction/${claim.txHash}`}
            external
            size="xs"
            look="soft">
            <Icon remix="RiArrowRightLine" />
            Inspect
          </Button>
        ))
      }
    />
  );
}
