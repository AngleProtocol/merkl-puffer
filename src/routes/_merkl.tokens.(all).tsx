import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import Hero from "src/components/composite/Hero";

export const meta: MetaFunction = () => {
  return [{ title: "Tokens on Merkl" }];
};

export default function Index() {
  return (
    <Hero
      icons={[{ remix: "RiCoinFill" }]}
      title={"Tokens"}
      breadcrumbs={[{ link: "/tokens", name: "Tokens" }]}
      description={"Tokens indexed by Merkl"}
      // TODO: Make this dynamic
      // sideDatas={[
      //   {
      //     data: "25",
      //     label: "Live opportunities",
      //     key: crypto.randomUUID(),
      //   },
      //   { data: "400%", label: "APR", key: crypto.randomUUID() },
      //   { data: "$4k", label: "Daily rewards", key: crypto.randomUUID() },
      // ]}
    >
      <Outlet />
    </Hero>
  );
}
