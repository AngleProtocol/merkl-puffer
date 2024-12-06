import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Outlet, json, useLoaderData } from "@remix-run/react";
import { Button, Dropdown, Group, Icon, Text, Value } from "dappkit";
import { useMemo } from "react";
import { RewardService } from "src/api/services/reward.service";
import Hero from "src/components/composite/Hero";
import AddressEdit from "src/components/element/AddressEdit";
import { formatUnits } from "viem";

export async function loader({ params: { address } }: LoaderFunctionArgs) {
  if (!address) throw "";

  //TODO: use a ligther route
  const rewards = await RewardService.getForUser(address);

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

export default function Index() {
  const { rewards, address } = useLoaderData<typeof loader>();

  const { earned, unclaimed } = useMemo(() => {
    return rewards.reduce(
      ({ earned, unclaimed }, chain) => {
        const valueUnclaimed = chain.rewards.reduce((sum, token) => {
          const value =
            Number.parseFloat(formatUnits(token.amount - token.claimed, token.token.decimals)) *
            (token.token.price ?? 0);

          return sum + value;
        }, 0);
        const valueEarned = chain.rewards.reduce((sum, token) => {
          const value = Number.parseFloat(formatUnits(token.claimed, token.token.decimals)) * (token.token.price ?? 0);

          return sum + value;
        }, 0);

        return {
          earned: earned + valueEarned,
          unclaimed: unclaimed + valueUnclaimed,
        };
      },
      { earned: 0, unclaimed: 0 },
    );
  }, [rewards]);

  return (
    <Hero
      breadcrumbs={[
        { link: "/", name: "Users" },
        {
          link: `/users/${address ?? ""}`,
          component: (
            <Dropdown size="md" padding="xs" content={<AddressEdit />}>
              <Button look="soft" size="xs" aria-label="Edit address">
                <Icon remix="RiArrowRightSLine" />
                {address}
                <Icon remix="RiEdit2Line" />
              </Button>
            </Dropdown>
          ),
        },
      ]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={
        <Group className="w-full gap-xl md:gap-xl*4 items-center">
          {/* TODO: Make it dynamic */}
          <Group className="flex-col">
            <Value format="$0,0.0a" size={2} className="text-main-12">
              {earned}
            </Value>
            <Text size="xl" bold className="not-italic">
              Total earned
            </Text>
          </Group>
          <Group className="flex-col">
            <Value format="$0,0.0a" size={2} className="text-main-12">
              {unclaimed}
            </Value>
            <Text size={"xl"} bold className="not-italic">
              Claimable
            </Text>
          </Group>
          <Group className="flex-col">
            <Button look="hype" size="lg">
              Claim
            </Button>
          </Group>
        </Group>
      }
      description={"Earn rewards by providing liquidity to this pool on Ethereum"}
      tabs={[
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
      ]}>
      <Outlet />
    </Hero>
  );
}
