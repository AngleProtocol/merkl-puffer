import type { MetaFunction } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { ProtocolService } from "src/api/services/protocol.service";
import Hero from "src/components/composite/Hero";
import { v4 as uuidv4 } from "uuid";

import { Outlet, json, useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [{ title: "Protocols on Merkl" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { protocols, count } = await ProtocolService.getManyFromRequest(request);

  return json({ protocols, count });
}

export default function Index() {
  const { count } = useLoaderData<typeof loader>();

  return (
    <Hero
      icons={[{ remix: "RiCommandLine", className: "text-main-11 !w-lg*4 !h-lg*4" }]}
      title={"Protocols"}
      breadcrumbs={[{ link: "/protocols", name: "Protocols" }]}
      description={"Explore protocols incentivized on Merkl"}
      sideDatas={[
        {
          data: count,
          label: "protocols",
          key: uuidv4(),
        },
      ]}>
      <Outlet />
    </Hero>
  );
}
