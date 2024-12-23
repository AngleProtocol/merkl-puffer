import { Group } from "@ariakit/react";
import type { MetaFunction } from "@remix-run/node";
import { ClientOnly } from "remix-utils/client-only";
import { I18n } from "src/I18n";
import Hero from "src/components/composite/Hero";
import { LiFiWidget } from "src/components/composite/LiFiWidget";

export const meta: MetaFunction = () => {
  return [{ title: "Merkl" }];
};

export default function Index() {
  return (
    <Hero
      icons={[{ remix: "RiPlanetFill" }]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={I18n.trad.get.pages.bridge.title}
      description={I18n.trad.get.pages.bridge.description}>
      <Group className="my-xl">
        <ClientOnly>{() => <LiFiWidget />}</ClientOnly>
      </Group>
    </Hero>
  );
}
