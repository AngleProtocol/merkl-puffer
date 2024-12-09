import { Dropdown, Group, PrimitiveTag, Value } from "packages/dappkit/src";
import type { ReactNode } from "react";

export type LiquidityRuleProps = { value: { label: ReactNode; percentage: number } };

export default function LiquidityRule({ value, ...props }: LiquidityRuleProps) {
  return (
    <Dropdown size="lg" padding="xs" content={<Group className="flex-col" />}>
      <PrimitiveTag look="soft" {...props}>
        {value.label}
        <Value format="0.#%">{value.percentage / 10000}</Value>
      </PrimitiveTag>
    </Dropdown>
  );
}
