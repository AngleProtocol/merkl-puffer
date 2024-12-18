import { Box, Group, Icons, Title, Value } from "packages/dappkit/src";
import type { Opportunity } from "src/api/services/opportunity/opportunity.model";
import useOpportunity from "src/hooks/resources/useOpportunity";
import Tag from "../Tag";

export type OpportunityShortCardProps = { opportunity: Opportunity };

export default function OpportunityShortCard({ opportunity }: OpportunityShortCardProps) {
  const { dailyRewards, icons, rewardIcons, tags } = useOpportunity(opportunity);

  return (
    <Box look="soft" className="bg-main-4">
      <Group className="flex-col">
        <Group>
          <Value size={3} className="text-main-11" format={"$0,0.#a"}>
            {dailyRewards}
          </Value>
          <Title h={3}>
            <Icons>{rewardIcons}</Icons>
          </Title>
          {tags
            .filter(({ type }) => type === "protocol")
            .map(tag => (
              <Tag
                size="sm"
                look="base"
                key={`${tag?.type}_${
                  // biome-ignore lint/suspicious/noExplicitAny: templated type
                  (tag?.value as any)?.address ?? tag?.value
                }`}
                {...tag}
              />
            ))}
        </Group>
        <Group>
          <Icons>{icons}</Icons>
          <Title h={5}>{opportunity.name}</Title>
        </Group>
      </Group>
    </Box>
  );
}
