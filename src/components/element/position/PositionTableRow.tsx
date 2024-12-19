import type { PositionT } from "@merkl/api/dist/src/modules/v4/liquidity";
import { type Component, Group, PrimitiveTag, Text, mergeClass } from "dappkit";
import React from "react";
import Token from "../token/Token";
import { PositionRow } from "./PositionTable";

export type PositionRowProps = Component<{
  row: PositionT;
}>;

export default function PositionTableRow({ row, className, ...props }: PositionRowProps) {
  return (
    <PositionRow
      {...props}
      className={mergeClass("cursor-pointer", className)}
      sourceColumn={<Group className="flex-nowrap">{row.opportunity.name}</Group>}
      flagsColumn={
        <Group className="flex-nowrap">
          <PrimitiveTag size="xs" className="pointer-events-none" look="soft">
            <Text>{row.flags?.id}</Text>
          </PrimitiveTag>
          <PrimitiveTag size="xs" className="pointer-events-none" look="soft">
            <Text>{row.flags?.range}</Text>
          </PrimitiveTag>
        </Group>
      }
      tokensColumn={
        <Group className="flex-nowrap">
          {row.tokens.map((token, index) => (
            <>
              <Token token={token.token} key={index.toString()} />
              {token.breakdown.map((breakdown, index) => (
                <React.Fragment key={index.toString()}>
                  {breakdown.type} {breakdown.value}
                </React.Fragment>
              ))}
            </>
          ))}
        </Group>
      }
    />
  );
}
