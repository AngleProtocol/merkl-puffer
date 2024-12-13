import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import Hero from "src/components/composite/Hero";

export const meta: MetaFunction = () => {
  return [{ title: "Protocols on Merkl" }];
};

export default function Index() {
  return (
    <Hero
      icons={[{ remix: "RiContactsBook2Line" }]}
      title={"Protocols"}
      breadcrumbs={[{ link: "/protocols", name: "Protocols" }]}
      description={"Protocols integrated by Merkl"}
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
