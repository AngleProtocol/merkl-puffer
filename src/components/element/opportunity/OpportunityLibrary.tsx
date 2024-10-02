import { FetchedOpportunity } from "src/api/fetch/fetchOpportunities";
import { OpportunityTable } from "./OpportunityTable";
import { useMemo } from "react";
import OpportunityTableRow from "./OpportunityTableRow";
import Input from "dappkit/components/primitives/Input";
import Select from "dappkit/components/extenders/Select";
import Group from "dappkit/components/extenders/Group";
import { Button } from "dappkit/index";
import Icon from "dappkit/components/primitives/Icon";

export type OpportunityLibrary = {
  opportunities: FetchedOpportunity[];
};

export default function OpportunityLibrary({ opportunities }: OpportunityLibrary) {
  const rows = useMemo(
    () => opportunities.map(o => <OpportunityTableRow key={o.id} opportunity={o} />),
    [opportunities],
  );

  return (
    <OpportunityTable
      header={
        <Group className="justify-between w-full">
          <Group>
            <Input size="sm" placeholder="Search" />
            <Select size="sm" placeholder="Action" />
            <Select size="sm" placeholder="Chain" />
            <Select size="sm" placeholder="TVL" />
          </Group>
          <Group>
            <Button size="sm" look="base">
              Sort
              <Icon size="sm" remix="RiSortDesc" />
            </Button>
            <Button size="sm" look="base">
              <Icon size="sm" remix="RiGridFill" />
            </Button>
          </Group>
        </Group>
      }
      sortable={["apr", "tvl", "rewards"]}>
      {rows}
    </OpportunityTable>
  );
}
