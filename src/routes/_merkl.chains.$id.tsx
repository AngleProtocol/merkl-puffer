import { type LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { ChainService } from "src/api/services/chain.service";
import Hero from "src/components/composite/Hero";

export async function loader({ params: { id } }: LoaderFunctionArgs) {
  const chain = await ChainService.get({ search: id });

  return json({ chain });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data?.chain?.name} on Merkl` }];
};

export default function Index() {
  const { chain } = useLoaderData<typeof loader>();
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
      description={"Lorem ipsum something cool about the chain"}
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
      // TODO: Make this dynamic
      sideDatas={[
        {
          data: "25",
          label: "Live opportunities",
          key: crypto.randomUUID(),
        },
        { data: "400%", label: "APR", key: crypto.randomUUID() },
        { data: "$4k", label: "Daily rewards", key: crypto.randomUUID() },
      ]}
    >
      <Outlet />
    </Hero>
  );
}
