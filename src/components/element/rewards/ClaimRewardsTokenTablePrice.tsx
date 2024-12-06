import { Group, Value } from "dappkit";
import type { PropsWithChildren } from "react";
import { formatUnits } from "viem";

export type ClaimRewardsTokenTablePriceProps = PropsWithChildren & {
  price: number | null;
  amount: bigint;
  decimals: number;
};

export default function ClaimRewardsTokenTablePrice({ amount, price, decimals }: ClaimRewardsTokenTablePriceProps) {
  const value = formatUnits(amount, decimals);

  return (
    <Group size="xs" className="flex-col items-end">
      <Value
        fallback={v => (v as string).includes("0.000") && "< 0.001"}
        className="text-right items-center flex"
        look={"bold"}
        format="0,0.###">
        {value}
      </Value>
      <Value
        fallback={v => {
          if (price === 0) return "-";
          return (v.toString() as string).includes("0.0") && "< $0.1";
        }}
        className="text-right items-center flex"
        look={"soft"}
        format="$0,0.#">
        {Number.parseFloat(value) * (price ?? 0)}
      </Value>
    </Group>
  );
}
