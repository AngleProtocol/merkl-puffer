import type { Token as TokenType } from "@merkl/api";
import { Button, Dropdown, Icon, Value } from "packages/dappkit/src";
import { useMemo } from "react";
import { formatUnits, parseUnits } from "viem";
import TokenTooltip from "./TokenTooltip";

export type TokenProps = {
  token: TokenType;
  format?: "amount" | "price" | "amount_price";
  amount?: bigint;
  value?: boolean;
};

export default function Token({ token, amount, format = "amount", value }: TokenProps) {
  const amoutFormated = amount ? formatUnits(amount, token.decimals) : undefined;

  const price = parseUnits(token.price?.toString() ?? "0", 0);

  const amountUSD = price * (amount ?? 0n);

  const display = useMemo(
    () => (
      <>
        {format === "amount" ||
          (format === "amount_price" && !!amount && <Value format="0.00a">{amoutFormated}</Value>)}{" "}
        <Icon rounded src={token.icon} />
        {token.symbol}
        {format === "price" ||
          (format === "amount_price" && !!amount && (
            <Value className="text-right" look={"soft"} format="$0,0.#">
              {formatUnits(amountUSD, token.decimals)}
            </Value>
          ))}
      </>
    ),
    [token, format, amoutFormated, amountUSD, amount],
  );

  if (value) return display;

  return (
    <Dropdown content={<TokenTooltip {...{ token, amount }} />}>
      <Button look="soft">{display}</Button>
    </Dropdown>
  );
}
