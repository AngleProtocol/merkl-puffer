import type { Chain } from "@merkl/api";
import { Box, Group, Icon, type Order, Text, Title } from "dappkit";
import merklConfig from "merkl.config";
import { useCallback, useMemo, useState } from "react";
import { I18n } from "src/I18n";
import type { Opportunity } from "src/api/services/opportunity/opportunity.model";
import type { OpportunityView } from "src/config/opportunity";
import useSearchParamState from "src/hooks/filtering/useSearchParamState";
import OpportunityCell from "./OpportunityCell";
import OpportunityFilters, { type OpportunityFilterProps } from "./OpportunityFilters";
import OpportunityPagination from "./OpportunityPagination";
import { OpportunityTable, type opportunityColumns } from "./OpportunityTable";
import OpportunityTableRow from "./OpportunityTableRow";

export type Displays = "grid" | "list";

export type OpportunityLibrary = {
  opportunities: Opportunity[];
  count?: number;
  chains?: Chain[];
  hideFilters?: boolean;
  forceView?: OpportunityView;
} & OpportunityFilterProps;

export default function OpportunityLibrary({
  opportunities,
  count,
  only,
  exclude,
  chains,
  protocols,
  hideFilters,
  forceView,
}: OpportunityLibrary) {
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
    [sortable, setSortIdAndOrder],
  );

  const [view, setView] = useState<OpportunityView>(forceView ?? merklConfig.opportunityLibraryDefaultView ?? "table");

  const display = useMemo(() => {
    switch (view) {
      case "table":
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
            {opportunities?.map(o => (
              <OpportunityTableRow
                navigationMode={merklConfig.opportunityNavigationMode}
                key={`${o.chainId}_${o.type}_${o.identifier}`}
                opportunity={o}
              />
            ))}
          </OpportunityTable>
        );
      case "cells":
        return (
          <Group className="flew-col">
            <Group className="grid md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {opportunities?.map(o => (
                <OpportunityCell
                  navigationMode={merklConfig.opportunityNavigationMode}
                  hideTags={merklConfig.opportunityCellHideTags}
                  key={`${o.chainId}_${o.type}_${o.identifier}`}
                  opportunity={o}
                />
              ))}

              {count !== undefined && (
                <Box content="sm">
                  <OpportunityPagination count={count} />
                </Box>
              )}
            </Group>
          </Group>
        );
    }
  }, [opportunities, view, count, sortable, onSort, sortIdAndOrder]);

  return (
    <Group className="flex-col w-full">
      {!!I18n.trad.get.pages.home.depositInformation && (
        <Group className="border-1 rounded-lg p-lg border-accent-8 flex-wrap items-center">
          <Text look="bold">
            <Icon remix="RiInformation2Fill" className="inline mr-md text-2xl text-accent-11" />
            {I18n.trad.get.pages.home.depositInformation}
          </Text>
        </Group>
      )}
      {!hideFilters && (
        <Box content="sm" className="justify-between w-full overflow-x-scroll">
          <OpportunityFilters {...{ only, exclude, chains, protocols, view, setView }} />
        </Box>
      )}
      {display}
    </Group>
  );
}
