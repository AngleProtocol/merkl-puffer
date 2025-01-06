import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import Hero from "src/components/composite/Hero";

export const meta: MetaFunction = () => {
  return [{ title: "Merkl | Chains" }];
};

export default function Index() {
  return (
    <Hero
      icons={[{ remix: "RiExchange2Line", className: "text-main-11 !w-lg*4 !h-lg*4" }]}
      title={"Chains"}
      breadcrumbs={[{ link: "/chains", name: "Chains" }]}
      description={"Chains integrated by Merkl"}
      // TODO: Make this dynamic
      // sideDatas={[
      //   {
      //     data: "25",
      //     label: "Live opportunities",
      //     key: uuidv4(),
      //   },
      //   { data: "400%", label: "APR", key: uuidv4() },
      //   { data: "$4k", label: "Daily rewards", key: uuidv4() },
      // ]}
    >
      <Outlet />
    </Hero>
  );
}
