import { type LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useMemo } from "react";
import { Cache } from "src/api/services/cache.service";
import { ChainService } from "src/api/services/chain.service";
import { OpportunityService } from "src/api/services/opportunity/opportunity.service";
import { TokenService } from "src/api/services/token.service";
import Hero, { defaultHeroSideDatas } from "src/components/composite/Hero";
import Tag, { type TagType } from "src/components/element/Tag";
import { chainIdOrder } from "src/constants/chain";

export async function loader({ params: { symbol } }: LoaderFunctionArgs) {
  const tokens = await TokenService.getSymbol(symbol);
  const chains = await ChainService.getAll();

  const { opportunities: opportunitiesByApr, count } = await OpportunityService.getMany({
    tokens: symbol,
    status: "LIVE",
    sort: "apr",
    order: "desc",
  });

  const { sum: dailyRewards } = await OpportunityService.getAggregate({ tokens: symbol }, "dailyRewards");

  return json({ tokens, chains, dailyRewards, maxApr: opportunitiesByApr?.[0]?.apr, count });
}

export const clientLoader = Cache.wrap("token", 300);

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const symbol = data?.tokens?.[0]?.symbol;

  if (!symbol) return [{ title: "Merkl" }];

  return [{ title: `${symbol} on Merkl` }];
};

export default function Index() {
  const { tokens, chains, dailyRewards, count, maxApr } = useLoaderData<typeof loader>();
  const token = tokens?.[0];

  const tags = useMemo(() => {
    return tokens
      .sort(({ chainId: a }, { chainId: b }) => {
        const order = chainIdOrder;

        if (order.indexOf(b) === -1) return -1;
        if (order.indexOf(b) === -1 && order.indexOf(a) === -1) return 0;
        if (order.indexOf(a) === -1) return 1;
        return order.indexOf(b) - order.indexOf(a);
      })
      .map(
        t =>
          ({
            type: "tokenChain",
            value: { ...t, chain: chains?.find(c => c.id === t.chainId) },
          }) satisfies TagType<"tokenChain">,
      );
  }, [tokens, chains]);

  return (
    <Hero
      breadcrumbs={[
        { link: "/tokens", name: "Tokens" },
        { link: `/tokens/${tokens?.[0]?.symbol}`, name: tokens?.[0]?.symbol },
      ]}
      icons={[{ src: tokens.find(t => t.icon && t.icon !== "")?.icon }]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={
        <>
          {token.name} <span className="font-mono text-main-8">({token.symbol})</span>
        </>
      }
      description={`Earn rewards by using ${token.symbol} as liquidity, or directly earn ${token.symbol} as rewards`}
      sideDatas={defaultHeroSideDatas(count, maxApr, dailyRewards)}
      tags={tags.map(tag => <Tag key={`${tag.type}_${tag.value?.address ?? tag.value}`} {...tag} size="lg" />)}>
      <Outlet />
    </Hero>
  );
}
