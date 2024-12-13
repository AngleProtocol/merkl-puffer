import { type LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Cache } from "src/api/services/cache.service";
import { ChainService } from "src/api/services/chain.service";
import { OpportunityService } from "src/api/services/opportunity/opportunity.service";
import Hero, { heroBuildSideDatas } from "src/components/composite/Hero";

export async function loader({ params: { id } }: LoaderFunctionArgs) {
  const chain = await ChainService.get({ search: id });

  const { opportunities: opportunitiesByApr, count } = await OpportunityService.getMany({
    chainId: chain.id.toString(),
    status: "LIVE",
    sort: "apr",
    order: "desc",
  });

  const { sum: dailyRewards } = await OpportunityService.getAggregate({ chainId: chain.id.toString() }, "dailyRewards");

  return json({ chain, count, dailyRewards, maxApr: opportunitiesByApr?.[0]?.apr });
}

export const clientLoader = Cache.wrap("chain", 300);

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data?.chain?.name} on Merkl` }];
};

export default function Index() {
  const { chain, count, dailyRewards, maxApr } = useLoaderData<typeof loader>();
  const label = chain.name.toLowerCase();

  return (
    <Hero
      icons={[{ src: chain.icon }]}
      breadcrumbs={[
        { link: "/chains", name: "Chains" },
        { link: "/", name: chain.name },
      ]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={chain.name}
      description={`Earn rewards by supplying liquidity on ${chain.name}`}
      tabs={[
        {
          label: "Opportunities",
          link: `/chains/${label?.toLowerCase()}`,
          key: crypto.randomUUID(),
        },
        {
          label: "Leaderboard",
          link: `/chains/${label?.toLowerCase()}/leaderboard`,
          key: crypto.randomUUID(),
        },
        {
          label: "Analytics",
          link: `/chains/${label?.toLowerCase()}/analytics`,
          key: crypto.randomUUID(),
        },
      ]}
      sideDatas={heroBuildSideDatas(count, maxApr, dailyRewards)}>
      <Outlet />
    </Hero>
  );
}
