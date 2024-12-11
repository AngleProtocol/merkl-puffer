import type { Opportunity } from "@merkl/api";
import { Divider, Group, Icon, Text, Value } from "packages/dappkit/src";

type IProps = {
  opportunity: Opportunity;
};

export default function TvlRowAllocation({ opportunity }: IProps) {
  let content: React.ReactNode = null;
  switch (opportunity.type) {
    case "CLAMM": {
      const tokenTvl = opportunity.tvlRecord.breakdowns.filter(b => b.type === "TOKEN");
      const token0 = opportunity.tokens[0];
      const token1 = opportunity.tokens[1];
      const tvlBreakdownToken0 = tokenTvl?.find(b => b.identifier === opportunity?.tokens[0]?.address);
      const tvlBreakdownToken1 = tokenTvl?.find(b => b.identifier === opportunity?.tokens[1]?.address);

      content = (
        <Group className="flex-col" size="sm">
          <Group className="items-center" size="sm">
            <Icon src={opportunity.tokens[0].icon} />
            <Value value format="0.0a">
              {tvlBreakdownToken0?.value}
            </Value>
            <Text size="sm" look="bold">
              {token0.name}
            </Text>

            {!!tvlBreakdownToken0?.value && !!token0?.price && (
              <Text size="sm">
                <Value value format="$0.0a">
                  {tvlBreakdownToken0.value * token0.price}
                </Value>
                {" ~ "}
                <Value value format="0a%">
                  {(tvlBreakdownToken0?.value * token0.price) / opportunity.tvlRecord.total}
                </Value>
                {" of TVL"}
              </Text>
            )}
          </Group>
          <Group className="items-center" size="sm">
            <Icon src={opportunity.tokens[1].icon} />
            <Value value format="0.0a">
              {tvlBreakdownToken1?.value}
            </Value>
            <Text size="sm" look="bold">
              {token1.name}
            </Text>

            {!!tvlBreakdownToken1?.value && !!token1?.price && (
              <Text size="sm">
                <Value value format="$0.0a">
                  {tvlBreakdownToken1.value * token1.price}
                </Value>
                {" ~ "}
                <Value value format="0a%">
                  {(tvlBreakdownToken1?.value * token1.price) / opportunity.tvlRecord.total}
                </Value>
                {" of TVL"}
              </Text>
            )}
          </Group>
        </Group>
      );
      break;
    }
    default:
      content = null;
  }
  if (!content) return null;
  return (
    <>
      <Divider className="-mx-xl w-[calc(100%+2*var(--spacing-xl))]" />
      <Text size="sm">TVL allocation</Text>
      <Divider className="-mx-xl w-[calc(100%+2*var(--spacing-xl))]" />
      {content}
    </>
  );
}
