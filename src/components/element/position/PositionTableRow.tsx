import type { PositionT } from "@merkl/api/dist/src/modules/v4/liquidity";
import { type Component, Space, Text, mergeClass } from "dappkit";
import Collapsible from "packages/dappkit/src/components/primitives/Collapsible";
import { useCallback, useMemo, useState } from "react";
import OpportuntiyButton from "../opportunity/OpportunityButton";
import { PositionRow } from "./PositionTable";
import { SubPositionTable } from "./subPosition/SubPositionTable";
import SubPositionTableRow from "./subPosition/SubPositionTableRow";

export type PositionRowProps = Component<{
  row: PositionT;
}>;

export default function PositionTableRow({ row, className, ...props }: PositionRowProps) {
  const [open, setOpen] = useState(false);

  const subPositions = useMemo(() => {
    return <SubPositionTableRow key={crypto.randomUUID()} row={row} />;
  }, [row]);

  const toggleOpen = useCallback(() => setOpen(o => !o), []);
  return (
    <PositionRow
      {...props}
      onClick={toggleOpen}
      className={mergeClass("cursor-pointer", className)}
      sourceColumn={<OpportuntiyButton opportunity={row.opportunity} />}
      liquidityColumn={<Text className="flex-nowrap">1230</Text>}
      supplyShareColumn={<Text>20.5%</Text>}>
      <Collapsible state={[open, setOpen]}>
        <Space size="md" />
        <SubPositionTable dividerClassName={() => "!bg-main-8"} className="[&>*]:bg-main-4" look="soft">
          {subPositions}
        </SubPositionTable>
      </Collapsible>
    </PositionRow>
  );
}
