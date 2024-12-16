import type { Chain } from "@merkl/api";
import { type LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/node";
import { Meta, Outlet, useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import { Cache } from "src/api/services/cache.service";
import { ChainService } from "src/api/services/chain.service";
import type { OpportunityWithCampaigns } from "src/api/services/opportunity/opportunity.model";
import { OpportunityService } from "src/api/services/opportunity/opportunity.service";
import Hero from "src/components/composite/Hero";
import Tag from "src/components/element/Tag";
import { ErrorHeading } from "src/components/layout/ErrorHeading";
import useOpportunity from "src/hooks/resources/useOpportunity";

export async function loader({ params: { id, type, chain: chainId }, request }: LoaderFunctionArgs) {
  if (!chainId || !id || !type) throw "";

  const chain = await ChainService.get({ search: chainId });

  const opportunity = await OpportunityService.getCampaignsByParams({
    chainId: chain.id,
    type: type,
    identifier: id,
  });

  return json({ opportunity, chain });
}

export const clientLoader = Cache.wrap("opportunity", 300);

export const meta: MetaFunction<typeof loader> = ({ data, error }) => {
  if (error) return [{ title: error }];
  return [{ title: `${data?.opportunity.name} on Merkl` }];
};

export type OutletContextOpportunity = {
  opportunity: OpportunityWithCampaigns;
  chain: Chain;
};

export default function Index() {
  const { opportunity, chain } = useLoaderData<typeof loader>();
  const { tags, description, link, herosData } = useOpportunity(opportunity);

  const styleName = useMemo(() => {
    const spaced = opportunity?.name.split(" ");

    return spaced
      .map(str => {
        const key = str + crypto.randomUUID();
        if (!str.match(/[\p{Letter}\p{Mark}]+/gu))
          return [
            <span key={key} className="text-main-11">
              {str}
            </span>,
          ];
        if (str.includes("-"))
          return str
            .split("-")
            .flatMap((s, i, arr) => [s, i !== arr.length - 1 && <span className="text-main-11">-</span>]);
        if (str.includes("/"))
          return str
            .split("/")
            .flatMap((s, i, arr) => [s, i !== arr.length - 1 && <span className="text-main-11">/</span>]);
        return [<span key={key}>{str}</span>];
      })
      .flatMap((str, index, arr) => [str, index !== arr.length - 1 && " "]);
  }, [opportunity]);

  const currentLiveCampaign = opportunity.campaigns?.[0];

  return (
    <>
      <Meta />
      <Hero
        icons={opportunity.tokens.map(t => ({ src: t.icon }))}
        breadcrumbs={[
          { link: "/", name: "Opportunities" },
          { link: "/", name: opportunity.name },
        ]}
        title={styleName}
        description={description}
        tabs={[
          { label: "Overview", link, key: crypto.randomUUID() },
          {
            label: "Leaderboard",
            link: `${link}/leaderboard?campaignId=${currentLiveCampaign?.campaignId}`,
            key: crypto.randomUUID(),
          },
        ]}
        tags={tags.map(tag => (
          <Tag
            key={`${tag?.type}_${
              // biome-ignore lint/suspicious/noExplicitAny: templated type
              (tag?.value as any)?.address ?? tag?.value
            }`}
            {...tag}
            size="sm"
          />
        ))}
        sideDatas={herosData}>
        <Outlet context={{ opportunity, chain }} />
      </Hero>
    </>
  );
}

export function ErrorBoundary() {
  return <ErrorHeading />;
}
