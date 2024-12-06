import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Container, Group, Space, Text, Value } from "packages/dappkit/src";
import Tooltip from "packages/dappkit/src/components/primitives/Tooltip";
import { useMemo } from "react";
import { ChainService } from "src/api/services/chain.service";
import { OpportunityService } from "src/api/services/opportunity/opportunity.service";
import { RewardService } from "src/api/services/reward.service";
import LeaderboardLibrary from "src/components/element/leaderboard/LeaderboardLibrary";
import { formatUnits, parseUnits } from "viem";

export type DummyLeaderboard = {
  rank: number;
  address: string;
  rewards: number;
  protocol: string;
};

export async function loader({ params: { id, type, chain: chainId } }: LoaderFunctionArgs) {
  if (!chainId || !id || !type) throw "";
  const chain = await ChainService.get({ search: chainId });

  const opportunity = await OpportunityService.getCampaignsByParams({
    chainId: chain.id,
    type: type,
    identifier: id,
  });

  const campaignIds = opportunity?.campaigns?.map(c => c.campaignId);
  if (!campaignIds) throw new Error("No campaign identifiers found");

  const rewards = await RewardService.getByParams({
    campaignIds,
    chainId: chain.id,
  });

  const totalReward = await RewardService.total({
    campaignIds,
    chainId: chain.id,
  });

  return json({ rewards, totalReward });
}

export default function Index() {
  const { rewards, totalReward } = useLoaderData<typeof loader>();

  const totalRewardsAllCampaigns = useMemo(() => {
    const scaledReward = totalReward.map(reward => {
      return formatUnits(parseUnits(reward.totalAmount, 0), reward?.Token?.decimals);
    });

    const summ = scaledReward.reduce((acc, reward) => {
      return acc + Number(reward);
    });

    return summ;
  }, [totalReward]);

  return (
    <Container>
      <Space size="lg" />
      <Group size="lg">
        <Group className="flex-col border-2 flex-1">
          <Tooltip helper={null}>
            <Text>Total rewarded users</Text>
          </Tooltip>
          {/* Probably a count from api */}
          <Text size={"xl"}>{rewards?.length}</Text>
        </Group>
        <Group className="flex-col border-2 flex-1">
          <Tooltip helper={null}>
            <Text>Total reward distributed</Text>
          </Tooltip>
          <Value size={"xl"} look={totalRewardsAllCampaigns === "0" ? "soft" : "base"} format="$0,0.#">
            {totalRewardsAllCampaigns}
          </Value>
        </Group>
      </Group>
      <Space size="lg" />
      <LeaderboardLibrary leaderboard={rewards} />
    </Container>
  );
}
