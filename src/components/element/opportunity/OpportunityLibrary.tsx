import type { Chain } from "@merkl/api";
import { Box, Group, type Order, Title } from "dappkit";
import { useMemo } from "react";
import type { Opportunity } from "src/api/services/opportunity/opportunity.model";
import useSearchParamState from "src/hooks/filtering/useSearchParamState";
import OpportunityFilters, { type OpportunityFilterProps } from "./OpportunityFilters";
import OpportunityPagination from "./OpportunityPagination";
import { OpportunityTable, type opportunityColumns } from "./OpportunityTable";
import OpportunityTableRow from "./OpportunityTableRow";

export type OpportunityLibrary = {
  opportunities: Opportunity[];
  count?: number;
  chains?: Chain[];
} & OpportunityFilterProps;

export default function OpportunityLibrary({
  opportunities,
  count,
  only,
  exclude,
  chains,
  protocols,
}: OpportunityLibrary) {
  const rows = useMemo(
    () =>
      opportunities?.map(o => <OpportunityTableRow key={`${o.chainId}_${o.type}_${o.identifier}`} opportunity={o} />),
    [opportunities],
  );

  const sortable = ["apr", "tvl", "rewards"] as const satisfies typeof opportunityColumns;

  const [sortIdAndOrder, setSortIdAndOrder] = useSearchParamState<[id: (typeof sortable)[number], order: Order]>(
    "sort",
    v => v?.join("-"),
    v => v?.split("-") as [(typeof sortable)[number], order: Order],
  );

  function onSort(column: (typeof opportunityColumns)[number], order: Order) {
    if (!sortable.some(s => s === column)) return;

    setSortIdAndOrder([column as (typeof sortable)[number], order]);
  }

  return (
    <Group className="flex-col">
      <Box content="sm" className="justify-between w-full overflow-x-scroll">
        <OpportunityFilters {...{ only, exclude, chains, protocols }} />
      </Box>
      <OpportunityTable
        opportunityHeader={
          <Title className="!text-main-11" h={5}>
            Opportunities
          </Title>
        }
        dividerClassName={index => (index < 2 ? "bg-accent-8" : "bg-main-8")}
        sortable={sortable}
        order={(sortIdAndOrder ?? [])?.[1]}
        sort={(sortIdAndOrder ?? [])?.[0] ?? "rewards"}
        onSort={onSort}
        footer={count !== undefined && <OpportunityPagination count={count} />}>
        {rows}
      </OpportunityTable>
    </Group>
  );
}
