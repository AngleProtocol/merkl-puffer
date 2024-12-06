import { Link } from "@remix-run/react";
import { Group } from "dappkit";
import { Icons } from "dappkit";
import type { BoxProps } from "dappkit";
import { Title } from "dappkit";
import { Value } from "dappkit";
import { Button } from "dappkit";
import { mergeClass } from "dappkit";
import type { Opportunity } from "src/api/services/opportunity/opportunity.model";
import useOpportunity from "src/hooks/resources/useOpportunity";
import Tag, { type TagTypes } from "../Tag";
import { OpportunityRow } from "./OpportunityTable";

export type OpportunityTableRowProps = {
  hideTags?: (keyof TagTypes)[];
  opportunity: Opportunity;
} & BoxProps;

export default function OpportunityTableRow({ hideTags, opportunity, className, ...props }: OpportunityTableRowProps) {
  const { tags, link, icons } = useOpportunity(opportunity);

  return (
    <Link to={link}>
      <OpportunityRow
        size="lg"
        content="sm"
        className={mergeClass("", className)}
        {...props}
        actionsColumn={
          <Group className="py-xl">
            {tags
              ?.filter(({ type }) => !hideTags || hideTags.includes(type))
              .map(tag => {
                return <Tag key={`${tag.type}_${tag.value?.address ?? tag.value}`} {...tag} size="lg" />;
              })}
          </Group>
        }
        apyColumn={
          <Group className="py-xl">
            <Button look={(opportunity?.aprRecord?.cummulated ?? 0) > 0 ? "hype" : "soft"} className="font-mono">
              <Value value format="0a%">
                {opportunity.apr / 100}
              </Value>
            </Button>
          </Group>
        }
        tvlColumn={
          <Group className="py-xl">
            <Button look={(opportunity?.tvlRecord?.total ?? 0) > 0 ? "soft" : "soft"} className="font-mono">
              <Value value format="$0,0.0a">
                {opportunity.tvl ?? 0}
              </Value>
            </Button>
          </Group>
        }
        rewardsColumn={
          <Group className="py-xl">
            <Button look={(opportunity?.rewardsRecord?.total ?? 0) > 0 ? "soft" : "soft"} className="font-mono">
              <Value value format="$0,0.0a">
                {opportunity.dailyRewards ?? 0}
              </Value>
            </Button>
          </Group>
        }
        opportunityColumn={
          <Group className="py-xl flex-col w-full text-nowrap whitespace-nowrap text-ellipsis">
            <Group className="text-nowrap whitespace-nowrap text-ellipsis min-w-0 flex-nowrap overflow-hidden max-w-full">
              <Icons>{icons}</Icons>
              <Title
                h={3}
                size={4}
                className="text-nowrap whitespace-nowrap text-ellipsis min-w-0 inline-block overflow-hidden">
                {opportunity.name}
              </Title>
            </Group>
            <Group>
              {tags
                ?.filter(({ type }) => !hideTags || !hideTags.includes(type))
                .map(tag => (
                  <Tag key={`${tag.type}_${tag.value?.address ?? tag.value}`} {...tag} size="xs" />
                ))}
            </Group>
          </Group>
        }
      />
    </Link>
  );
}
