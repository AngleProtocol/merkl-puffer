import type { PositionT } from "@merkl/api/dist/src/modules/v4/liquidity";
import { type Component, Divider, Group, Icon, Text, Value, mergeClass } from "dappkit";
import OpportuntiyButton from "../opportunity/OpportunityButton";
import { PositionRow } from "./PositionTable";

export type PositionRowProps = Component<{
  row: PositionT;
}>;

export default function PositionTableRow({ row, className, ...props }: PositionRowProps) {
  return (
    <>
      <Divider look="soft" />
      <PositionRow
        {...props}
        className={mergeClass("cursor-pointer", className)}
        sourceColumn={<OpportuntiyButton opportunity={row.opportunity} />}
        flagsColumn={
          <Text className="flex-nowrap">
            todo
            {/* <PrimitiveTag size="xs" className="pointer-events-none" look="soft">
              <Text>{row.flags?.id}</Text>
            </PrimitiveTag>
            <PrimitiveTag size="xs" className="pointer-events-none" look="soft">
              <Text>{row.flags?.range}</Text>
            </PrimitiveTag> */}
          </Text>
        }
        tokensColumn={
          <Group className="flex-nowrap">
            {row.tokens.map((token, index) => (
              <Group key={index.toString()}>
                {token.breakdown.map((breakdown, index) => (
                  <Text key={index.toString()} className="flex-nowrap flex gap-md">
                    {/* <Token
                      token={token.token}
                      format="amount_price"
                      amount={BigInt(breakdown.value * 10 ** token.token.decimals)}
                    /> */}
                    <Icon src={token.token.icon} />
                    {token.token.symbol}
                    <Value format="0.00a">{breakdown.value}</Value>
                  </Text>
                ))}
              </Group>
            ))}
          </Group>
        }
      />
    </>
  );
}
