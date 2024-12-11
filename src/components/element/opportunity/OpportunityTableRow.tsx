import type { Opportunity } from "@merkl/api";
import { Link } from "@remix-run/react";
import type { BoxProps } from "dappkit";
import { Dropdown, Group, Icon, Icons, PrimitiveTag, Text, Title, Value } from "dappkit";
import { mergeClass } from "dappkit";
import useOpportunity from "src/hooks/resources/useOpportunity";
import Tag, { type TagTypes } from "../Tag";
import AprModal from "../apr/AprModal";
import TokenAmountModal from "../token/TokenAmountModal";
import { OpportunityRow } from "./OpportunityTable";

export type OpportunityTableRowProps = {
  hideTags?: (keyof TagTypes)[];
  opportunity: Opportunity;
} & BoxProps;

export default function OpportunityTableRow({ hideTags, opportunity, className, ...props }: OpportunityTableRowProps) {
  const { tags, link, icons, rewardsBreakdown } = useOpportunity(opportunity);

  return (
    <Link to={link}>
      <OpportunityRow
        size="lg"
        content="sm"
        className={mergeClass("dim", className)}
        {...props}
        apyColumn={
          <Dropdown size="lg" content={<AprModal opportunity={opportunity} />}>
            <PrimitiveTag look="tint" size="lg" className="font-mono">
              <Value value format="0a%">
                {opportunity.apr / 100}
              </Value>
            </PrimitiveTag>
          </Dropdown>
        }
        tvlColumn={
          <Dropdown className="py-xl" content={<AprModal opportunity={opportunity} />}>
            <PrimitiveTag look="base" className="font-mono">
              <Value value format="$0,0.0a">
                {opportunity.tvl ?? 0}
              </Value>
            </PrimitiveTag>
          </Dropdown>
        }
        rewardsColumn={
          <Dropdown
            className="py-xl"
            content={
              <TokenAmountModal
                tokens={rewardsBreakdown}
                label={
                  <Group size="sm">
                    <Icon remix="RiGift2Fill" />
                    <Text size="sm" className="text-main-12" bold>
                      Daily Rewards
                    </Text>
                  </Group>
                }
              />
            }>
            <PrimitiveTag look="base" className="font-mono">
              <Value value format="$0,0.0a">
                {opportunity.dailyRewards ?? 0}
              </Value>
              <Icons>
                {rewardsBreakdown.map(({ token: { icon } }) => (
                  <Icon key={icon} src={icon} />
                ))}
              </Icons>
            </PrimitiveTag>
          </Dropdown>
        }
        opportunityColumn={
          <Group className="flex-col w-full text-nowrap whitespace-nowrap text-ellipsis">
            <Group className="text-nowrap whitespace-nowrap text-ellipsis min-w-0 flex-nowrap overflow-hidden max-w-full">
              <Text className="text-xl">
                <Icons className="flex-nowrap">{icons}</Icons>
              </Text>
              <Title
                h={3}
                size={4}
                className="text-nowrap whitespace-nowrap text-ellipsis min-w-0 inline-block overflow-hidden">
                {opportunity.name}
              </Title>
            </Group>
            <Group>
              {tags
                ?.filter(a => a !== undefined)
                ?.filter(({ type }) => !hideTags || !hideTags.includes(type))
                .map(tag => (
                  <Tag filter key={`${tag.type}_${tag.value?.address ?? tag.value}`} {...tag} size="xs" />
                ))}
            </Group>
          </Group>
        }
      />
    </Link>
  );
}
