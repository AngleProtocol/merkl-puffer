import { Button, type Component, Icon, Value, mergeClass } from "dappkit";
import Time from "packages/dappkit/src/components/primitives/Time";
import { useWalletContext } from "packages/dappkit/src/context/Wallet.context";
import { useMemo } from "react";
import type { ClaimsService } from "src/api/services/claims.service";
import Token from "../token/Token";
import { HistoricalClaimsRow } from "./HistoricalClaimsTable";
import Chain from "../chain/Chain";

export type HistoricalClaimsRowProps = Component<{
  claim: Awaited<ReturnType<typeof ClaimsService.getForUser>>[0];
}>;

export default function HistoricalClaimsTableRow({
  claim,
  className,
  ...props
}: HistoricalClaimsRowProps) {
  const { chains } = useWalletContext();

  const chain = useMemo(() => {
    return chains?.find((c) => c.id === claim.token.chainId);
  }, [chains, claim]);

  const value = useMemo(() => {
    return Number(claim.amount) * (claim.token.price ?? 0);
  }, [claim]);

  return (
    <HistoricalClaimsRow
      {...props}
      className={mergeClass("cursor-pointer", className)}
      chainColumn={<Chain chain={chain} size="md" />}
      tokenColumn={
        <Token
          token={claim.token}
          format="amount"
          amount={BigInt(Number(claim.amount) * 10 ** claim.token.decimals)}
        />
      }
      valueColumn={
        <Value value format="$0.00a">
          {value}
        </Value>
      }
      dateColumn={<Time timestamp={claim.timestamp * 1000} />}
      transactionColumn={
        claim.txHash &&
        chain?.explorers &&
        chain.explorers.map((explorer) => (
          <Button
            key={`${explorer.url}`}
            to={`${explorer.url}/tx/${claim.txHash}`}
            external
            size="xs"
            look="soft"
          >
            <Icon remix="RiArrowRightLine" />
            Inspect
          </Button>
        ))
      }
    />
  );
}
