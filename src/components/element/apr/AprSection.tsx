import type { Opportunity } from "@merkl/api";
import { Divider, Group, Hash, PrimitiveTag, Text, Value } from "packages/dappkit/src";
import { Fragment, useMemo } from "react";

type AprSectionProps = {
  opportunity: Opportunity;
};

export default function AprSection({ opportunity }: AprSectionProps) {
  const breakdowns = useMemo(() => {
    return opportunity.aprRecord.breakdowns.filter(aprBreakdown => aprBreakdown.type !== "PROTOCOL");
  }, [opportunity]);

  const getAprName = (breakdown: Opportunity["aprRecord"]["breakdowns"][number]) => {
    if (!breakdown?.identifier) return null;

    switch (breakdown?.type) {
      case "CAMPAIGN":
        return (
          <Group>
            Campaign
            <PrimitiveTag look="soft" size="xs">
              <Hash size="sm" format="short" copy className="text-main-12">
                {breakdown.identifier}
              </Hash>
            </PrimitiveTag>
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
  };

  return (
    <>
      <Divider className="-mx-xl w-[calc(100%+2*var(--spacing-xl))]" />
      <Text size="sm">APR details</Text>
      <Divider className="-mx-xl w-[calc(100%+2*var(--spacing-xl))]" />
      <Group className="flex-col">
        {breakdowns.map(breakdown => (
          <Fragment key={breakdown.id}>
            <Group className="items-center justify-between" size="sm">
              <Text size="sm" look="bold">
                {getAprName(breakdown)}
              </Text>
              <PrimitiveTag noClick look="bold" size="sm">
                <Value value format="0a%">
                  {breakdown.value / 100}
                </Value>
              </PrimitiveTag>
            </Group>
            <Divider className="last:hidden" look="tint" />
          </Fragment>
        ))}
      </Group>
    </>
  );
}
