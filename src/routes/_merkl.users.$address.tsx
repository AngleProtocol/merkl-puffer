import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, json, useLoaderData } from "@remix-run/react";
import { Button, Dropdown, Group, Hash, Icon, Text, Value } from "dappkit";
import config from "merkl.config";
import TransactionButton from "packages/dappkit/src/components/dapp/TransactionButton";
import { useWalletContext } from "packages/dappkit/src/context/Wallet.context";
import { useMemo } from "react";
import { RewardService } from "src/api/services/reward.service";
import Hero from "src/components/composite/Hero";
import AddressEdit from "src/components/element/AddressEdit";
import useReward from "src/hooks/resources/useReward";
import useRewards from "src/hooks/resources/useRewards";
import { v4 as uuidv4 } from "uuid";
import { isAddress } from "viem";

export async function loader({ params: { address } }: LoaderFunctionArgs) {
  if (!address || !isAddress(address)) throw "";

  const rewards = await RewardService.getForUser(address, 1);

  return json({ rewards, address });
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
  const { rewards: raw, address } = useLoaderData<typeof loader>();
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
        <Group className="w-full gap-xl md:gap-xl*4 items-center">
          {/* TODO: Make it dynamic */}
          <Group className="flex-col">
            <Value format="$0,0.0a" size={2} className="text-main-12">
              {rewards.earned}
            </Value>
            <Text size="xl" bold className="not-italic">
              Total earned
            </Text>
          </Group>
          <Group className="flex-col">
            <Value format="$0,0.0a" size={2} className="text-main-12">
              {rewards.unclaimed}
            </Value>
            <Text size={"xl"} bold className="not-italic">
              Claimable
            </Text>
          </Group>
          <Group className="flex-col">
            {isAbleToClaim && (
              <TransactionButton disabled={!claimTransaction} look="hype" size="lg" tx={claimTransaction}>
                {isSingleChain ? "Claim" : `Claim on ${chain?.name}`}
              </TransactionButton>
            )}
          </Group>
        </Group>
      }
      description={""}
      tabs={[
        {
          label: (
            <>
              <Icon size="sm" remix="RiGift2Fill" />
              Rewards
            </>
          ),
          link: `/users/${address}`,
          key: uuidv4(),
        },
        {
          label: (
            <>
              <Icon size="sm" remix="RiDropFill" />
              Liquidity
            </>
          ),
          link: `/users/${address}/liquidity?chainId=${chainId}`,
          key: crypto.randomUUID(),
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
      ]}>
      <Outlet context={rewards} />
    </Hero>
  );
}
