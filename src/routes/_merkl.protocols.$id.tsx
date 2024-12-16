import type { Opportunity } from "@merkl/api";
import { type LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Group } from "dappkit";
import { Cache } from "src/api/services/cache.service";
import { OpportunityService } from "src/api/services/opportunity/opportunity.service";
import { ProtocolService } from "src/api/services/protocol.service";
import Hero, { defaultHeroSideDatas } from "src/components/composite/Hero";

export async function loader({ params: { id }, request }: LoaderFunctionArgs) {
  const protocol = (await ProtocolService.get({ id: id ?? undefined }))?.[0];
  const { opportunities, count } = await OpportunityService.getManyFromRequest(request, { mainProtocolId: id });

  const { opportunities: opportunitiesByApr, count: liveCount } = await OpportunityService.getMany({
    mainProtocolId: id,
    status: "LIVE",
    sort: "apr",
    order: "desc",
  });

  const { sum } = await OpportunityService.getAggregate({ mainProtocolId: id }, "dailyRewards");

  return json({
    opportunities,
    count,
    protocol,
    liveOpportunityCount: liveCount,
    maxApr: opportunitiesByApr?.[0]?.apr,
    dailyRewards: sum,
  });
}

export const clientLoader = Cache.wrap("protocol", 300);

export type OutletContextProtocol = {
  opportunities: Opportunity[];
  count: number;
};

export default function Index() {
  const { opportunities, count, protocol, liveOpportunityCount, maxApr, dailyRewards } = useLoaderData<typeof loader>();

  return (
    <Hero
      icons={[{ src: protocol?.icon }]}
      title={<Group className="items-center">{protocol?.name}</Group>}
      breadcrumbs={[
        { link: "/protocols", name: "Protocols" },
        { link: `/protocols/${protocol?.id}`, name: protocol?.name },
      ]}
      description={
        (protocol?.description !== "" && protocol?.description) ||
        `Earn rewards by supplying liquidity on ${protocol?.name}`
      }
      sideDatas={defaultHeroSideDatas(liveOpportunityCount, maxApr, dailyRewards)}>
      <Outlet context={{ opportunities, count }} />
    </Hero>
  );
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.protocol) return [{ title: "Merkl" }];

  return [{ title: `${data?.protocol?.name} on Merkl` }];
};
