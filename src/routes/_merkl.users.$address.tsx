import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, json, useLoaderData } from "@remix-run/react";
import { Button, Dropdown, Group, Hash, Icon, Text, Value } from "dappkit";
import config from "merkl.config";
import TransactionButton from "packages/dappkit/src/components/dapp/TransactionButton";
import { useWalletContext } from "packages/dappkit/src/context/Wallet.context";
import { useMemo } from "react";
import { RewardService } from "src/api/services/reward.service";
import { TokenService } from "src/api/services/token.service";
import Hero from "src/components/composite/Hero";
import AddressEdit from "src/components/element/AddressEdit";
import Token from "src/components/element/token/Token";
import useReward from "src/hooks/resources/useReward";
import useRewards from "src/hooks/resources/useRewards";
import { isAddress } from "viem";

export async function loader({ params: { address }, request }: LoaderFunctionArgs) {
  if (!address || !isAddress(address)) throw "";

  const rewards = await RewardService.getForUser(request, address, 1);
  const token = !!config.rewardsTotalClaimableMode
    ? (
        await TokenService.getMany({
          address: config.rewardsTotalClaimableMode,
        })
      )?.[0]
    : null;

  return json({ rewards, address, token });
}

export const meta: MetaFunction<typeof loader> = ({ data, error }) => {
  if (error) return [{ title: error }];
  return [
    {
      title: `${data?.address?.substring(0, 6)}…${data?.address.substring(data?.address.length - 4)} on Merkl`,
    },
  ];
};

export type OutletContextRewards = ReturnType<typeof useRewards>;

export default function Index() {
  const { rewards: raw, address, token } = useLoaderData<typeof loader>();
  const rewards = useRewards(raw);

  const isSingleChain = config?.chains?.length === 1;

  const { chainId, chains, address: user } = useWalletContext();
  const chain = useMemo(() => chains?.find(c => c.id === chainId), [chainId, chains]);
  const reward = useMemo(() => raw.find(({ chain: { id } }) => id === chainId), [chainId, raw]);
  const { claimTransaction } = useReward(reward, user);

  const isUserRewards = useMemo(() => user === address, [user, address]);
  const isAbleToClaim = useMemo(
    () => isUserRewards && reward && !reward.rewards.every(({ amount, claimed }) => amount === claimed),
    [isUserRewards, reward],
  );

  // Dynamically filter tabs based on config
  const tabs = useMemo(() => {
    const baseTabs = [
      {
        label: (
          <>
            <Icon size="sm" remix="RiGift2Fill" />
            Rewards
          </>
        ),
        link: `/users/${address}`,
        key: crypto.randomUUID(),
      },
      {
        label: (
          <>
            <Icon size="sm" remix="RiDropFill" />
            Liquidity
          </>
        ),
        link: `/users/${address}/liquidity?chainId=${chainId}`,
        key: "LiquidityUserChain",
      },
      {
        label: (
          <>
            <Icon size="sm" remix="RiListCheck3" />
            Claims
          </>
        ),
        link: `/users/${address}/claims`,
        key: crypto.randomUUID(),
      },
    ];

    // Remove the Liquidity tab if disabled in the config
    return baseTabs.filter(tab => !(tab.key === "LiquidityUserChain" && !config.dashboard.liquidityTab.enabled));
  }, [address, chainId]);

  return (
    <Hero
      breadcrumbs={[
        { link: "/users/", name: "Users" },
        {
          link: `/users/${address ?? ""}`,
          component: (
            <>
              <Icon remix="RiArrowRightSLine" className="text-main-12" />
              <Hash copy format="full" size="xs" className="text-main-12">
                {address}
              </Hash>
              <Dropdown size="md" padding="xs" content={<AddressEdit />}>
                <Button look="soft" size="xs" aria-label="Edit address">
                  <Icon remix="RiEdit2Line" />
                </Button>
              </Dropdown>
            </>
          ),
        },
      ]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={
        <Group className="w-full items-center flex justify-between gap-xl md:gap-xl*4">
          {/* TODO: Make it dynamic */}
          <Group className="gap-xl md:gap-xl*4 items-center">
            <Group className="flex-col">
              {isAddress(config.rewardsTotalClaimableMode ?? "") && !!token ? (
                <Token size="xl" token={token} amount={BigInt(rewards.unclaimed)} format="amount_price" showZero />
              ) : (
                <Value format={config.decimalFormat.dollar} size={2} className="text-main-12">
                  {rewards.unclaimed}
                </Value>
              )}
              <Text size={"xl"} bold className="not-italic">
                Total Claimable
              </Text>
            </Group>
            <Group className="flex-col">
              {isAbleToClaim && (
                <TransactionButton disabled={!claimTransaction} look="hype" size="lg" tx={claimTransaction}>
                  {isSingleChain ? "Claim Now" : `Claim on ${chain?.name}`}
                </TransactionButton>
              )}
            </Group>
          </Group>

          <Group className="gap-xl md:gap-xl*4 items-center">
            <Group className="flex-col">
              {isAddress(config.rewardsTotalClaimableMode ?? "") && !!token ? (
                <Token size="xl" token={token} amount={BigInt(rewards.earned)} format="amount_price" showZero />
              ) : (
                <Value format={config.decimalFormat.dollar} size={2} className="text-main-12">
                  {rewards.earned}
                </Value>
              )}
              <Text size="xl" bold className="not-italic">
                Lifetime Earned
              </Text>
            </Group>

            <Group className="flex-col">
              {isAddress(config.rewardsTotalClaimableMode ?? "") && !!token ? (
                <Token size="xl" token={token} amount={BigInt(rewards.pending)} format="amount_price" showZero />
              ) : (
                <Value format={config.decimalFormat.dollar} size={2} className="text-main-12">
                  {rewards.pending}
                </Value>
              )}
              <Text size="xl" bold className="not-italic">
                Pending Rewards
              </Text>
            </Group>
          </Group>
        </Group>
      }
      description={""}
      tabs={tabs}>
      <Outlet context={rewards} />
    </Hero>
  );
}
