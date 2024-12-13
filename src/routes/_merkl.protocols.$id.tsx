import type { Opportunity } from "@merkl/api";
import { type LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Group, Value } from "dappkit";
import { OpportunityService } from "src/api/services/opportunity/opportunity.service";
import { ProtocolService } from "src/api/services/protocol.service";
import Hero from "src/components/composite/Hero";

export async function loader({ params: { id }, request }: LoaderFunctionArgs) {
  const protocol = (await ProtocolService.get({ id: id ?? "" }))?.[0];
  const { opportunities, count } = await OpportunityService.getManyFromRequest(request, { mainProtocolId: id });

  const { opportunities: opportunitiesByApr, count: liveCount } = await OpportunityService.getMany({
    mainProtocolId: id,
    status: "LIVE",
  });

  const { sum } = await OpportunityService.getAggregate({ mainProtocolId: id }, "dailyRewards");

  return json({
    opportunities,
    count,
    protocol,
    liveOpportunityCount: liveCount,
    maxApr: opportunitiesByApr?.[0]?.apr,
    sumDailyRewards: sum,
  });
}

export type OutletContextProtocol = {
  opportunities: Opportunity[];
  count: number;
};

export default function Index() {
  const { opportunities, count, protocol, liveOpportunityCount, maxApr, sumDailyRewards } =
    useLoaderData<typeof loader>();

  const herosData = [
    {
      label: "Live opportunities",
      data: (
        <Value format="0" size={4} className="!text-main-12">
          {liveOpportunityCount}
        </Value>
      ),
      key: crypto.randomUUID(),
    },
    {
      // need a call api here
      label: "Daily rewards",
      data: (
        <Value format="$0.00a" size={4} className="!text-main-12">
          {sumDailyRewards}
        </Value>
      ),
      key: crypto.randomUUID(),
    },
    {
      label: "Max",
      data: (
        <Value format="0a%" size={4} className="!text-main-12">
          {maxApr / 100}
        </Value>
      ),
      key: crypto.randomUUID(),
    },
  ];

  return (
    <Hero
      icons={[{ src: protocol?.icon }]}
      title={
        <Group className="items-center">
          {protocol?.name}
          {/* TODO: add the link to this button */}
          {/* <Button look="soft" size="xl" to={protocol?.name}>
            <Icon remix="RiArrowRightUpLine" />
          </Button> */}
        </Group>
      }
      breadcrumbs={[
        { link: "/protocols", name: "Protocols" },
        { link: `/protocols/${protocol.name}`, name: protocol.name },
      ]}
      description={"Protocol"}
      sideDatas={herosData}>
      <Outlet context={{ opportunities, count }} />
    </Hero>
  );
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.protocol) return [{ title: "Merkl" }];

  return [{ title: `${data?.protocol?.name} on Merkl` }];
};
