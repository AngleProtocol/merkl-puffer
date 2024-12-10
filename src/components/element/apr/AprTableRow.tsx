import type { Opportunity } from "@merkl/api";
import { Button, Group, Hash, Value } from "packages/dappkit/src";
import { useMemo } from "react";
import { AprRow } from "./AprTable";

type IProps = {
  breakdown: Opportunity["aprRecord"]["breakdowns"][number];
};

export default function AprTableRow({ breakdown }: IProps) {
  const aprName = useMemo(() => {
    if (!breakdown?.identifier) return null;

    switch (breakdown?.type) {
      case "CAMPAIGN":
        return (
          <Group>
            Campaign{" "}
            <Hash format="short" copy>
              {breakdown.identifier}
            </Hash>
          </Group>
        );
      case "PROTOCOL":
        return (
          <Group>
            {breakdown.identifier.split(" ")[0]}
            <Hash format="short" copy>
              {breakdown.identifier.split(" ")[1]}
            </Hash>
          </Group>
        );
      case "TOKEN":
        return breakdown.identifier;
      default:
        return (
          <Hash format="short" copy>
            {breakdown.identifier}
          </Hash>
        );
    }
  }, [breakdown]);

  return (
    <AprRow
      className={"!rounded-0"}
      nameColumn={aprName}
      valueColumn={
        <Button>
          <Value value format="0a%">
            {breakdown?.value / 100}
          </Value>
        </Button>
      }
    />
  );
}
