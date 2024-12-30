import type { Chain, Token as TokenType } from "@merkl/api";
import { Button, Dropdown, Group, Icon, type IconProps, PrimitiveTag, Value, sizeScale } from "packages/dappkit/src";
import { useMemo } from "react";
import { formatUnits } from "viem";
import TokenTooltip from "./TokenTooltip";

export type TokenProps = {
  token: TokenType;
  format?: "amount" | "price" | "amount_price";
  amount?: bigint;
  value?: boolean;
  symbol?: boolean;
  icon?: boolean;
  size?: IconProps["size"];
  chain?: Chain;
};

export default function Token({
  size,
  token,
  amount,
  format = "amount",
  value,
  icon = true,
  symbol = true,
  chain,
}: TokenProps) {
  const amoutFormated = amount ? formatUnits(amount, token.decimals) : undefined;
  const amountUSD = !amount ? 0 : (token.price ?? 0) * Number.parseFloat(amoutFormated ?? "0");

  const display = useMemo(
    () => (
      <>
        {format === "amount" ||
          (format === "amount_price" && !!amount && (
            <Value
              fallback={v => (v as string).includes("0.000") && "< 0.001"}
              className="text-right items-center flex font-title"
              look={"bold"}
              size={size}
              format="0,0.###a">
              {amoutFormated}
            </Value>
          ))}{" "}
        {icon && <Icon size={size} rounded src={token?.icon} />}
        {symbol && token?.symbol}
        {format === "price" ||
          (format === "amount_price" && !!amount && (
            <Group className="shrink block">
              <PrimitiveTag size={sizeScale[Math.max(sizeScale.indexOf(size ?? "md") - 1, 0)]}>
                <Value
                  className="text-right"
                  look={"soft"}
                  size={sizeScale[Math.max(sizeScale.indexOf(size ?? "md") - 1, 0)]}
                  format="$0,0.#">
                  {amountUSD}
                </Value>
              </PrimitiveTag>
            </Group>
          ))}
      </>
    ),
    [token, format, amoutFormated, amountUSD, amount, symbol, icon, size],
  );

  if (value) return display;

  return (
    <Dropdown content={<TokenTooltip {...{ token, amount, chain, size }} />}>
      <Button size={size} look="soft">
        {display}
      </Button>
    </Dropdown>
  );
}
