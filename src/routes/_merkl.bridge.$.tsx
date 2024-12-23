import type { MetaFunction } from "@remix-run/node";
import { ClientOnly } from "remix-utils/client-only";
import { LiFiWidget } from "src/components/composite/LiFiWidget";

export const meta: MetaFunction = () => {
  return [{ title: "Merkl" }];
};

export default function Index() {
  return <ClientOnly>{() => <LiFiWidget />}</ClientOnly>;
}
