import { Link } from "@remix-run/react";
import type { BoxProps } from "dappkit";
import { Box, Button, Divider, Dropdown, Group, Icon, Icons, PrimitiveTag, Text, Title, Value } from "dappkit";
import { mergeClass } from "dappkit";
import { useOverflowingRef } from "packages/dappkit/src/hooks/events/useOverflowing";
import { useMemo } from "react";
import type { Opportunity } from "src/api/services/opportunity/opportunity.model";
import type { OpportunityNavigationMode } from "src/config/opportunity";
import useOpportunity from "src/hooks/resources/useOpportunity";
import Tag, { type TagTypes } from "../Tag";
import AprModal from "../apr/AprModal";
import OpportunityParticipateModal from "./OpportunityParticipateModal";

export type OpportunityTableRowProps = {
  hideTags?: (keyof TagTypes)[];
  opportunity: Opportunity;

  navigationMode?: OpportunityNavigationMode;
} & BoxProps;

export default function OpportunityCell({ opportunity, hideTags, navigationMode }: OpportunityTableRowProps) {
  const { tags, link, icons, rewardsBreakdown } = useOpportunity(opportunity);

  const { ref, overflowing } = useOverflowingRef<HTMLHeadingElement>();

  const cell = useMemo(
    () => (
      <Box className="flex-col hover:bg-main-2 bg-main-3 ease !gap-0 h-full cursor-pointer">
        <Group className="p-xl justify-between items-end">
          <Group className="flex-col">
            <Group className="min-w-0 flex-nowrap items-center overflow-hidden">
              <Title h={3} size={3} look="soft">
                <Value value format="0,0.0a">
                  {opportunity.dailyRewards ?? 0}
                </Value>
              </Title>
              <Text className="text-xl">
                <Icons>
                  {rewardsBreakdown.map(({ token: { icon } }) => (
                    <Icon key={icon} src={icon} />
                  ))}
                </Icons>
              </Text>
            </Group>
            <Text bold look="bold">
              Total daily rewards
            </Text>
          </Group>

          <Dropdown size="xl" content={<AprModal opportunity={opportunity} />}>
            <PrimitiveTag look="hype" size="lg">
              <Value value format="0a%">
                {opportunity.apr / 100}
              </Value>{" "}
              <span className="font-normal">APR</span>
            </PrimitiveTag>
          </Dropdown>
        </Group>
        <Divider className="my-0" look="soft" />
        <Group className="flex-col p-xl flex-1">
          <Group className="justify-between flex-col flex-1">
            <Group className="flex-nowrap">
              <Text className="text-3xl">
                <Icons className="flex-nowrap">{icons}</Icons>
              </Text>
              <Title
                h={3}
                size={4}
                ref={ref}
                className={mergeClass(
                  "font-medium [overflow-wrap:anywhere]",
                  overflowing && "hover:overflow-visible hover:animate-textScroll hover:text-clip",
                )}>
                {opportunity.name}
              </Title>
            </Group>

            <Group className="justify-between flex-nowrap">
              <Group className="items-center">
                {tags
                  ?.filter(a => a !== undefined)
                  ?.filter(({ type }) => !hideTags || !hideTags.includes(type))
                  .map(tag => (
                    <Tag filter key={`${tag.type}_${tag.value?.address ?? tag.value}`} {...tag} size="sm" />
                  ))}
              </Group>
              <Group className="flex-col justify-end">
                <Button className="hidden lg:block" look="base">
                  <Icon remix="RiArrowRightLine" />
                </Button>
              </Group>
            </Group>
          </Group>
        </Group>
      </Box>
    ),
    [opportunity, overflowing, ref, icons, rewardsBreakdown.map, tags, hideTags],
  );

  if (navigationMode === "supply")
    return <OpportunityParticipateModal opportunity={opportunity}>{cell}</OpportunityParticipateModal>;
  return (
    <Link prefetch="intent" to={link}>
      {cell}
    </Link>
  );
}
