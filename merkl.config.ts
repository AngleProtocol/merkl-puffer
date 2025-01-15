import { type Themes, createColoring } from "dappkit";
import type { MerklConfig } from "merkl-app-core";
import hero from "src/assets/images/hero.jpg?url";
import { v4 as uuidv4 } from "uuid";
import { http, createClient, custom } from "viem";

import {
  arbitrum,
  astar,
  astarZkEVM,
  avalanche,
  base,
  blast,
  bob,
  bsc,
  coreDao,
  etherlink,
  fantom,
  filecoin,
  fraxtal,
  fuse,
  gnosis,
  immutableZkEvm,
  linea,
  lisk,
  mainnet,
  manta,
  mantle,
  mode,
  moonbeam,
  optimism,
  polygon,
  polygonZkEvm,
  rootstock,
  scroll,
  sei,
  taiko,
  thunderCore,
  worldchain,
  xLayer,
  zksync,
} from "viem/chains";
import { eip712WalletActions } from "viem/zksync";
import { walletConnect } from "wagmi/connectors";

export default {
  appName: "Puffer",
  modes: ["light"],
  defaultTheme: "puffer",
  deposit: false,
  tags: ["puffer"],
  opportunityNavigationMode: "direct",
  opportunityCellHideTags: ["token", "action"],
  rewardsNavigationMode: "opportunity",
  opportunityLibraryDefaultView: "table",
  alwaysShowTestTokens: false,
  opportunityLibrary: {
    defaultView: "table",
    views: ["table"], // If you want only one view, this is where you can specify it.
    cells: {
      hideTags: ["token", "action"],
    },
    excludeFilters: ["protocol", "tvl"],
  },
  hero: {
    bannerOnAllPages: false, // show banner on all pages
    invertColors: true, // Light mode: light text on dark background (instead of dark text on light background)
  },
  opportunity: {
    featured: {
      enabled: false,
      length: 6,
    },
    library: {
      sortedBy: "apr",
      columns: {
        action: {
          enabled: true,
        },
      },
    },
  },
  themes: {
    puffer: {
      base: createColoring(["#2A35BD", "#BFFF37", "#FFFFFF"], ["#2A35BD", "#BFFF37", "#FFFFFF"]),
      info: createColoring(["#2ABDFF", "#2ABDFF", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      good: createColoring(["#40B66B", "#40B66B", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      warn: createColoring(["#ff9600", "#ff9600", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      harm: createColoring(["#d22e14", "#d22e14", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
    },
  },
  images: {
    hero: hero,
  },
  routes: {
    home: {
      icon: "RiHomeFill",
      route: "/",
      key: uuidv4(),
    },
    opportunities: {
      icon: "RiPlanetFill",
      route: "/opportunities",
      key: uuidv4(),
    },
    protocols: {
      icon: "RiVipCrown2Fill",
      route: "/protocols",
      key: uuidv4(),
    },
    docs: {
      icon: "RiFile4Fill",
      external: true,
      route: "https://docs.merkl.xyz/",
      key: uuidv4(),
    },
  },
  header: {
    searchbar: {
      enabled: true,
    },
    opportunities: {
      enabled: false,
    },
    bridge: {
      enabled: true,
    },
  },
  socials: {
    discord: "https://discord.com/invite/pufferfi",
    telegram: "https://t.me/puffer_fi",
    x: "https://x.com/puffer_finance",
    github: "https://github.com/PufferFinance",
  },
  links: {
    docs: "https://docs.merkl.xyz/",
    merkl: "https://merkl.xyz/",
    merklTermsConditions: "https://app.merkl.xyz/merklTerms.pdf",
    merklPrivacy: "https://privacy.angle.money",
  },
  wagmi: {
    chains: [
      mainnet,
      optimism,
      rootstock,
      bsc,
      lisk,
      gnosis,
      thunderCore,
      fuse,
      polygon,
      manta,
      xLayer,
      fantom,
      fraxtal,
      filecoin,
      etherlink,
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
} satisfies Partial<MerklConfig<Themes>>;
