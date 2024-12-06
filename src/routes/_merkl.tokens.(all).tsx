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
      sideDatas={[
        { data: "8%", label: "Total opportunities", key: crypto.randomUUID() },
        { data: "99.999", label: "Price", key: crypto.randomUUID() },
      ]}>
      <Outlet />
    </Hero>
  );
}
