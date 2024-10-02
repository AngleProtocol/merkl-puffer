import type { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import Dropdown from "dappkit/components/extenders/Dropdown";
import Group from "dappkit/components/extenders/Group";
import Box from "dappkit/components/primitives/Box";
import Divider from "dappkit/components/primitives/Divider";
import Space from "dappkit/components/primitives/Space";
import Text from "dappkit/components/primitives/Text";
import Title from "dappkit/components/primitives/Title";
import { Button } from "dappkit/index";
import { createColoring } from "dappkit/theming/coloring";
import type { Coloring } from "dappkit/theming/variables";
import Page from "src/components/composite/layout/Page";
// import { Button, DAppProvider, Dropdown } from "dappkit";
import { http, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { coinbaseWallet, walletConnect } from "wagmi/connectors";

export const meta: MetaFunction = () => {
  return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    coinbaseWallet(),
    walletConnect({
      customStoragePrefix: "wagmi",
      projectId: "26c912aadd2132cd869a5edc00aeea0f",
      metadata: {
        name: "Example",
        description: "Example website",
        url: "https://example.com",
        icons: [],
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const testThemes: { [name: string]: Coloring } = {
  uniswap: createColoring(["#131313", "#FC72FF", "#131313"], ["#FFFFFF", "#FC72FF", "white"]),
  "1inch": createColoring(["#131823", "#172A45", "#131823"], ["#FFFFFF", "#DDECFE", "white"]),
  kiln: createColoring(["#000000", "#FF6521", "black"], ["#FFFFFF", "#FF6521", "white"]),
  avocado: createColoring(["#0E121C", "#07A65D", "#0E121C"], ["#FFFFFF", "#07A65D", "white"]),
  pancakeswap: createColoring(["#27262C", "#1FC7D4", "#27262C"], ["#FFFFFF", "#1FC7D4", "white"]),
  optimism: createColoring(["#000000", "#FF0420", "black"], ["#FBFCFE", "#FF0420", "white"]),
};

export default function Index() {
  return (
    <Page>
      <Group>
        <Title h={1}>Merkl</Title>
      </Group>
      <div>
        <Outlet />
      </div>
    </Page>
  );
}
