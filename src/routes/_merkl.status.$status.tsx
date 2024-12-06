import { type LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import Hero from "src/components/composite/Hero";
import { type Status, getStatus, statuses } from "src/config/status";

export async function loader({ params: { status: _status } }: LoaderFunctionArgs) {
  const status = getStatus(_status ?? "");

  if (!status) throw new Error("Unknown status");

  return json({ status });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.status) return [{ title: "Merkl" }];

  const status = data.status.charAt(0).toUpperCase() + data.status.slice(1).toLowerCase();

  return [{ title: `${status} opportunities on Merkl` }];
};

export default function Index() {
  const { status: _status } = useLoaderData<typeof loader>();
  const status = statuses[_status as Status];

  return (
    <Hero
      icons={[status.icon]}
      breadcrumbs={[
        { link: "/", name: "Opportunities" },
        { link: "/", name: status.label },
      ]}
      title={status.label}
      description={status.description}
      tabs={[
        {
          label: "Opportunities",
          link: `/status/${status.label?.toLowerCase()}`,
          key: crypto.randomUUID(),
        },
      ]}>
      <Outlet />
    </Hero>
  );
}
