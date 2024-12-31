import type { PositionT } from "@merkl/api/dist/src/modules/v4/liquidity";
import { Text, Title } from "dappkit";
import { useMemo } from "react";
import OpportunityPagination from "../opportunity/OpportunityPagination";
import { PositionTable } from "./PositionTable";
import PositionTableRow from "./PositionTableRow";

export type IProps = {
  positions: PositionT[];
  count?: number;
};

export default function PositionLibrary(props: IProps) {
  const { positions, count } = props;

  const rows = useMemo(() => {
    return positions?.map(row => <PositionTableRow key={crypto.randomUUID()} row={row} />);
  }, [positions]);

  return (
    <PositionTable
      dividerClassName={index => (index < 2 ? "bg-accent-8" : "bg-main-8")}
      header={
        <Title h={5} className="!text-main-11 w-full">
          Your Liquidity
        </Title>
      }
      footer={count !== undefined && <OpportunityPagination count={count} />}>
      {!!rows.length ? rows : <Text className="p-xl">No position detected</Text>}
    </PositionTable>
  );
}
