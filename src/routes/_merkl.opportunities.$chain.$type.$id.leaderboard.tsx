import type { Campaign } from "@merkl/api";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import moment from "moment";
import { Container, Group, Hash, Icon, OverrideTheme, Select, Space, Text, Value } from "packages/dappkit/src";
import Tooltip from "packages/dappkit/src/components/primitives/Tooltip";
import { useCallback, useMemo } from "react";
import { CampaignService } from "src/api/services/campaigns/campaign.service";
import { ChainService } from "src/api/services/chain.service";
import { RewardService } from "src/api/services/reward.service";
import LeaderboardLibrary from "src/components/element/leaderboard/LeaderboardLibrary";
import Token from "src/components/element/token/Token";
import useSearchParamState from "src/hooks/filtering/useSearchParamState";
import { formatUnits, parseUnits } from "viem";

export type DummyLeaderboard = {
  rank: number;
  address: string;
  rewards: number;
  protocol: string;
};

export async function loader({ params: { id, type, chain: chainId }, request }: LoaderFunctionArgs) {
  if (!chainId || !id || !type) throw "";

  const chain = await ChainService.get({ search: chainId });

  const campaigns = await CampaignService.getByParams({
    chainId: chain.id,
    type: type as Campaign["type"],
    mainParameter: id,
  });

  const { rewards, count } = await RewardService.getManyFromRequest(request, {
    chainId: chain.id,
  });

  return json({
    rewards,
    campaigns,
    count: count,
  });
}

export default function Index() {
  const { rewards, campaigns, count } = useLoaderData<typeof loader>();

  const [campaignId, setCampaignIds] = useSearchParamState<string>(
    "campaignId",
    v => v,
    v => v,
  );

  const selectedCampaign = useMemo(
    () => campaigns?.find(campaign => campaign?.campaignId === campaignId),
    [campaigns, campaignId],
  );

  const totalRewardsAllCampaigns = useMemo(() => {
    if (!selectedCampaign) return "0";

    return formatUnits(
      parseUnits(selectedCampaign?.amount, 0) * parseUnits(selectedCampaign?.rewardToken.price?.toString() ?? "0", 0),
      selectedCampaign?.rewardToken?.decimals,
    );
  }, [selectedCampaign]);

  // --------------- Campaign utils ---------------

  const dailyRewards = useCallback((campaign: Campaign) => {
    const duration = campaign.endTimestamp - campaign.startTimestamp;
    const oneDayInSeconds = BigInt(3600 * 24);
    const dayspan = BigInt(duration) / BigInt(oneDayInSeconds) || BigInt(1);
    const amountInUnits = parseUnits(campaign.amount, 0);
    const dailyReward = amountInUnits / dayspan;

    return dailyReward;
  }, []);

  // -------------------------------------------

  const campaignsOptions = campaigns?.reduce(
    (options, campaign: Campaign) => {
      const isActive = BigInt(campaign.endTimestamp) > BigInt(moment().unix());
      options[campaign.campaignId] = (
        <Group className="items-center">
          <OverrideTheme accent={"good"}>
            <Icon className={isActive ? "text-accent-10" : "text-main-10"} remix="RiCircleFill" />
          </OverrideTheme>
          <Hash format="short">{campaign.campaignId}</Hash>

          <Group>
            <Token token={campaign.rewardToken} amount={dailyRewards(campaign)} format="amount_price" value />
          </Group>
        </Group>
      );
      return options;
    },
    {} as Record<string, React.ReactNode>,
  );

  return (
    <Container>
      <Select
        options={campaignsOptions}
        state={[campaignId, id => setCampaignIds(id as string)]}
        placeholder={!!campaignId ? "Campaign Selected" : "Please select a campaign"}
      />
      <Space size="lg" />
      <Group size="lg">
        <Group className="flex-col border-2 flex-1">
          <Tooltip helper={null}>
            <Text>Total rewarded users</Text>
          </Tooltip>
          {/* Probably a count from api */}
          <Text size={"xl"}>{count?.count}</Text>
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
      <LeaderboardLibrary leaderboard={rewards} campaign={selectedCampaign} count={count?.count ?? 0} />
    </Container>
  );
}
