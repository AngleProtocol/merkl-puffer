import type { Opportunity } from "@merkl/api";
import { useMemo } from "react";
import { AprTable } from "./AprTable";
import AprTableRow from "./AprTableRow";

type IProps = {
  opportunity: Opportunity;
};

export default function AprLibrary({ opportunity }: IProps) {
  const breakdownsFiltered = useMemo(() => {
    return opportunity.aprRecord.breakdowns.filter(aprBreakdown => aprBreakdown.type !== "PROTOCOL");
  }, [opportunity]);

  const rows = useMemo(
    () => breakdownsFiltered?.map(breakdown => <AprTableRow key={breakdown.id} breakdown={breakdown} />),
    [breakdownsFiltered],
  );

  return <AprTable>{rows}</AprTable>;
}
