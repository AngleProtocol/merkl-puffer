import { createColoring } from "dappkit";
import { createConfig } from "src/config/type";
import { createClient, custom, http } from "viem";
import {
  mainnet,
  optimism,
  rootstock,
  bsc,
  gnosis,
  thunderCore,
  fuse,
  polygon,
  manta,
  xLayer,
  fantom,
  fraxtal,
  filecoin,
  zksync,
  worldchain,
  astar,
  polygonZkEvm,
  coreDao,
  moonbeam,
  sei,
  astarZkEVM,
  mantle,
  base,
  immutableZkEvm,
  mode,
  arbitrum,
  avalanche,
  linea,
  bob,
  blast,
  taiko,
  scroll,
} from "viem/chains";
import { coinbaseWallet, walletConnect } from "wagmi/connectors";
import hero from "src/customer/assets/images/hero.jpg?url";
import { eip712WalletActions } from "viem/zksync";

export default createConfig({
  appName: "Puffer",
  defaultTheme: "puffer",
  modes: ["light"],
  themes: {
    merkl: {
      base: createColoring(
        ["#2A35BD", "#F5F9FF", "#FFFFFF"],
        ["#2A35BD", "#F5F9FF", "#FFFFFF"]
      ),
      info: createColoring(
        ["#2ABDFF", "#2ABDFF", "#131620"],
        ["#FFFFFF", "#40B66B", "white"]
      ),
      good: createColoring(
        ["#40B66B", "#40B66B", "#131620"],
        ["#FFFFFF", "#40B66B", "white"]
      ),
      warn: createColoring(
        ["#ff9600", "#ff9600", "#131620"],
        ["#FFFFFF", "#40B66B", "white"]
      ),
      harm: createColoring(
        ["#d22e14", "#d22e14", "#131620"],
        ["#FFFFFF", "#40B66B", "white"]
      ),
    },
  },
  sizing: {
    width: { xs: 14, sm: 16, md: 18, lg: 20, xl: 24 },
    spacing: { xs: 2, sm: 4, md: 8, lg: 12, xl: 16 },
    radius: { xs: 3, sm: 6, md: 9, lg: 12, xl: 15 },
  },
  images: {
    hero: hero,
  },
  routes: {
    homepage: {
      icon: "RiHomeFill",
      route: "/",
      key: crypto.randomUUID(),
    },
    opportunities: {
      icon: "RiPlanetFill",
      route: "/opportunities",
      key: crypto.randomUUID(),
    },
    // protocols: {
    //   icon: "RiVipCrown2Fill",
    //   route: "/protocols",
    //   key: crypto.randomUUID(),
    // },
    terms: {
      icon: "RiCompassesLine",
      route: "/terms",
      key: crypto.randomUUID(),
    },
    privacy: {
      icon: "RiInformationFill",
      route: "/privacy",
      key: crypto.randomUUID(),
    },
  },
  socials: {
    discord: "https://discord.com/invite/pufferfi",
    telegram: "https://t.me/puffer_fi",
    x: "https://twitter.com/Puffer_Finance",
    github: "https://github.com/PufferFinance",
  },
  links: {
    merkl: "https://merkl.xyz/",
  },
  wagmi: {
    chains: [
      mainnet,
      optimism,
      rootstock,
      bsc,
      gnosis,
      thunderCore,
      fuse,
      polygon,
      manta,
      xLayer,
      fantom,
      fraxtal,
      filecoin,
      zksync,
      worldchain,
      astar,
      polygonZkEvm,
      coreDao,
      moonbeam,
      sei,
      astarZkEVM,
      mantle,
      base,
      immutableZkEvm,
      mode,
      arbitrum,
      avalanche,
      linea,
      bob,
      blast,
      taiko,
      scroll,
    ],
    client({ chain }) {
      if (chain.id === zksync.id)
        return createClient({
          chain,
          transport: custom(window.ethereum!),
        }).extend(eip712WalletActions());
      return createClient({ chain, transport: http() });
    },
    ssr: true,
    connectors: [
      coinbaseWallet(),
      walletConnect({
        customStoragePrefix: "wagmi",
        projectId: "26c912aadd2132cd869a5edc00aeea0f",
        metadata: {
          name: "Puffer",
          description: "Puffer",
          url: "https://app.merkl.xyz.com",
          icons: [],
        },
      }),
    ],
  },
});
