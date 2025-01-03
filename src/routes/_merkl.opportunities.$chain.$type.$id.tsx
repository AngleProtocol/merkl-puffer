import type { Chain } from "@merkl/api";
import { type LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/node";
import { Meta, Outlet, useLoaderData } from "@remix-run/react";
import { Button, Group, Icon } from "dappkit";
import merklConfig from "merkl.config";
import { useMemo } from "react";
import { Cache } from "src/api/services/cache.service";
import { ChainService } from "src/api/services/chain.service";
import type { OpportunityWithCampaigns } from "src/api/services/opportunity/opportunity.model";
import { OpportunityService } from "src/api/services/opportunity/opportunity.service";
import Hero from "src/components/composite/Hero";
import Tag from "src/components/element/Tag";
import OpportunityParticipateModal from "src/components/element/opportunity/OpportunityParticipateModal";
import { ErrorHeading } from "src/components/layout/ErrorHeading";
import useOpportunity from "src/hooks/resources/useOpportunity";
import { v4 as uuidv4 } from "uuid";

export async function loader({ params: { id, type, chain: chainId } }: LoaderFunctionArgs) {
  if (!chainId || !id || !type) throw "";

  const chain = await ChainService.get({ name: chainId });

  const rawOpportunity = await OpportunityService.getCampaignsByParams({
    chainId: chain.id,
    type: type,
    identifier: id,
  });
  return json({ rawOpportunity, chain });
}

export const clientLoader = Cache.wrap("opportunity", 300);

export const meta: MetaFunction<typeof loader> = ({ data, error }) => {
  if (error) return [{ title: error }];
  return [
    {
      title: `${data?.rawOpportunity.name} on Merkl`,
    },
  ];
};

export type OutletContextOpportunity = {
  opportunity: OpportunityWithCampaigns;
  chain: Chain;
};

export default function Index() {
  const { rawOpportunity, chain } = useLoaderData<typeof loader>();
  const { tags, description, link, herosData, opportunity } = useOpportunity(rawOpportunity);

  const styleName = useMemo(() => {
    const spaced = opportunity.name.split(" ");

    return spaced
      .map(str => {
        const key = str + uuidv4();
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
          { link: merklConfig.routes.opportunities?.route ?? "/", name: "Opportunities" },
          {
            link: "/",
            name: opportunity.name,
          },
        ]}
        title={
          <Group className="items-center flex-nowrap" size="lg">
            <span className="flex-1">{styleName}</span>
            {!!opportunity.protocol?.url && (
              <Button to={opportunity.protocol?.url} external>
                <Icon remix="RiArrowRightUpLine" size="sm" />
              </Button>
            )}
            <OpportunityParticipateModal opportunity={opportunity}>
              <Button className="inline-flex" look="hype" size="md">
                Simple supply
              </Button>
            </OpportunityParticipateModal>
          </Group>
        }
        description={description}
        tabs={[
          { label: "Overview", link, key: "overview" },
          {
            label: "Leaderboard",
            link: `${link}/leaderboard?campaignId=${currentLiveCampaign?.campaignId}`,
            key: "leaderboard",
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
