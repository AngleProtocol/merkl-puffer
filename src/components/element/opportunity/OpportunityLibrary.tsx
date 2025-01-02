import type { Chain } from "@merkl/api";
import { useSearchParams } from "@remix-run/react";
import { Box, Group, type Order, Space, Title } from "dappkit";
import config from "merkl.config";
import { useCallback, useMemo, useState } from "react";
import type { Opportunity } from "src/api/services/opportunity/opportunity.model";
import useSearchParamState from "src/hooks/filtering/useSearchParamState";
import OpportunityCell from "./OpportunityCell";
import OpportunityFeatured from "./OpportunityFeatured";
import OpportunityFilters, { OpportunityDisplayingMode, type OpportunityFilterProps } from "./OpportunityFilters";
import OpportunityPagination from "./OpportunityPagination";
import { OpportunityTable, type opportunityColumns } from "./OpportunityTable";
import OpportunityTableRow from "./OpportunityTableRow";

export type Displays = "grid" | "list";

export type OpportunityLibrary = {
  opportunities: Opportunity[];
  count?: number;
  chains?: Chain[];
  featuredOpportunities?: Opportunity[];
} & Omit<OpportunityFilterProps, "displayState">;

export default function OpportunityLibrary({
  opportunities,
  count,
  only,
  exclude,
  chains,
  protocols,
  featuredOpportunities = [],
}: OpportunityLibrary) {
  const [displayingMode, setDisplayingMode] = useState<OpportunityDisplayingMode>(
    config.opportunityDisplayingDefault ?? OpportunityDisplayingMode.LIST,
  );

  const [searchParams] = useSearchParams();

  const rows = useMemo(() => {
    let opportunityToRender = [];
    // If there are more than 1 featured opportunities and the page is 0 or not set, render the rest of the opportunities - featured ones
    if (featuredOpportunities.length > 1 && (!searchParams.get("page") || searchParams.get("page") === "0"))
      opportunityToRender = opportunities.slice(config.opportunity.featured.length);
    else {
      opportunityToRender = opportunities;
    }

    return opportunityToRender?.map(o => (
      <OpportunityTableRow
        hideTags={["action", "chain", "status", "token", "tokenChain"]}
        navigationMode={config.opportunityNavigationMode}
        key={`${o.chainId}_${o.type}_${o.identifier}`}
        opportunity={o}
      />
    ));
  }, [opportunities, featuredOpportunities, searchParams]);

  const cells = useMemo(
    () =>
      opportunities?.map(o => (
        <OpportunityCell
          hideTags={["action", "chain", "status", "token", "tokenChain"]}
          key={`${o.chainId}_${o.type}_${o.identifier}`}
          opportunity={o}
        />
      )),
    [opportunities],
  );

  const sortable = ["apr", "tvl", "rewards"] as const satisfies typeof opportunityColumns;

  const [sortIdAndOrder, setSortIdAndOrder] = useSearchParamState<[id: (typeof sortable)[number], order: Order]>(
    "sort",
    v => v?.join("-"),
    v => v?.split("-") as [(typeof sortable)[number], order: Order],
  );

  const onSort = useCallback(
    (column: (typeof opportunityColumns)[number], order: Order) => {
      if (!sortable.some(s => s === column)) return;
      setSortIdAndOrder([column as (typeof sortable)[number], order]);
    },
    [setSortIdAndOrder, sortable],
  );

  const renderOpportunities = useMemo(() => {
    switch (displayingMode) {
      case OpportunityDisplayingMode.GRID:
        return <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-lg">{cells}</div>;
      case OpportunityDisplayingMode.LIST:
        return (
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
        );
    }
  }, [displayingMode, rows, cells, count, sortIdAndOrder, onSort, sortable]);

  return (
    <Group className="flex-col" size="lg">
      {!!featuredOpportunities.length && (
        <>
          <Space size="lg" />
          <Title h={3} className="!text-main-11 mb-xl">
            BEST OPPORTUNITIES
          </Title>
          <OpportunityFeatured opportunities={featuredOpportunities} />
        </>
      )}
      {!!featuredOpportunities.length && (
        <>
          <Space size="xl" />
          <Title h={3} className="!text-main-11 mb-xl">
            ALL OPPORTUNITIES
          </Title>
        </>
      )}
      <Box content="sm" className="flex justify-between w-full overflow-x-scroll">
        <OpportunityFilters
          {...{ only, exclude, chains, protocols }}
          displayState={{ state: displayingMode, set: setDisplayingMode }}
        />
      </Box>
      {renderOpportunities}
    </Group>
  );
}
