import type { PositionT } from "@merkl/api/dist/src/modules/v4/liquidity";
import { type Component, Divider, Group, Text, mergeClass } from "dappkit";
import OpportuntiyButton from "../opportunity/OpportunityButton";
import Token from "../token/Token";
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
                  <Group key={index.toString()}>
                    <Token
                      token={token.token}
                      format="amount_price"
                      amount={BigInt(breakdown.value * 10 ** token.token.decimals)}
                    />
                  </Group>
                ))}
              </Group>
            ))}
          </Group>
        }
      />
    </>
  );
}
