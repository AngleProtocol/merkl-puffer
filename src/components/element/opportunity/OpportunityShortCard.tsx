import { Box, Group, Icons, Text, Title, Value } from "packages/dappkit/src";
import type { Opportunity } from "src/api/services/opportunity/opportunity.model";
import useOpportunity from "src/hooks/resources/useOpportunity";
import Tag from "../Tag";

export type OpportunityShortCardProps = { opportunity: Opportunity };

export default function OpportunityShortCard({ opportunity }: OpportunityShortCardProps) {
  const { icons, rewardIcons, tags } = useOpportunity(opportunity);

  return (
    <Box look="soft" size="lg" className="rounded-sm bg-main-0 border-main-6 border-1">
      <Group className="items-center">
        <Value size={3} className="text-main-11" format={"$0,0.#a"}>
          {opportunity.dailyRewards}
        </Value>
        <Title h={4}>
          <Icons>{rewardIcons}</Icons>
        </Title>
        {tags
          .filter(({ type }) => type === "protocol")
          .map(tag => (
            <Tag
              size="sm"
              look="base"
              style={{
                zIndex: 51,
                transition: "z-index 0.2s ease-in-out",
                "&:hover": {
                  zIndex: 0,
                },
              }}
              key={`${tag?.type}_${
                // biome-ignore lint/suspicious/noExplicitAny: templated type
                (tag?.value as any)?.address ?? tag?.value
              }`}
              {...tag}
            />
          ))}
      </Group>
      <Group className="text-xl">
        <Icons>{icons}</Icons>
        <Text look="bold" bold>
          {opportunity.name}
        </Text>
      </Group>
    </Box>
  );
}
