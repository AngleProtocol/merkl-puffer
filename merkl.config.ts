import { createColoring } from "dappkit";
import { createConfig } from "src/config/type";
import hero from "src/customer/assets/images/hero.jpg?url";
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

export default createConfig({
  appName: "Puffer",
  modes: ["light"],
  defaultTheme: "puffer",
  deposit: false,
  tags: ["puffer"],
  opportunityNavigationMode: "supply",
  tokenSymbolPriority: ["ZK", "USDC", "USDC.e", "ETH", "WETH", "WBTC", "wstETH", "USDT", "USDe", "weETH", "DAI"],
  opportunityCellHideTags: ["token", "action"],
  rewardsNavigationMode: "chain",
  opportunityLibraryDefaultView: "cells",
  // opportunityLibraryExcludeFilters: ["protocol","action"],
  opprtunityPercentage: true,
  hideLayerMenuHomePage: false,
  supplyCredits: [],
  walletOptions: {
    hideInjectedWallets: ["phantom", "coinbase wallet"],
    sponsorTransactions: true,
    client(c) {
      if (c.chain?.id === zksync.id) return c.extend(eip712WalletActions());
    },
  },
  chains: [],
  opportunity: {
    featured: {
      enabled: false,
      length: 6,
    },
  },
  bridge: {
    helperLink: "",
  },
  dashboard: {
    liquidityTab: {
      enabled: false,
    },
  },
  tagsDetails: {
    token: {
      visitOpportunities: {
        enabled: true,
      },
    },
  },
  decimalFormat: {
    dollar: "$0,0.##a",
  },
  themes: {
    ignite: {
      base: createColoring(["#2A35BD", "#BFFF37", "#FFFFFF"], ["#2A35BD", "#BFFF37", "#FFFFFF"]),
      info: createColoring(["#2ABDFF", "#2ABDFF", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      good: createColoring(["#40B66B", "#40B66B", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      warn: createColoring(["#ff9600", "#ff9600", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      harm: createColoring(["#d22e14", "#d22e14", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
    },
    merkl: {
      base: createColoring(["#1755F4", "#FF7900", "#0D1530"], ["#1755F4", "#FF7900", "#FFFFFF"]),
      info: createColoring(["#2ABDFF", "#2ABDFF", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      good: createColoring(["#40B66B", "#40B66B", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      warn: createColoring(["#ff9600", "#ff9600", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      harm: createColoring(["#d22e14", "#d22e14", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
    },
    backoffice: {
      base: createColoring(["#8B8D98", "#9984D2", "#000000"], ["#8B8D98", "#9984D2", "#FFFFFF"]),
      info: createColoring(["#2ABDFF", "#2ABDFF", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      good: createColoring(["#40B66B", "#40B66B", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      warn: createColoring(["#ff9600", "#ff9600", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      harm: createColoring(["#d22e14", "#d22e14", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
    },
    puffer: {
      base: createColoring(["#2A35BD", "#BFFF37", "#FFFFFF"], ["#2A35BD", "#BFFF37", "#FFFFFF"]),
      info: createColoring(["#2ABDFF", "#2ABDFF", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      good: createColoring(["#40B66B", "#40B66B", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      warn: createColoring(["#ff9600", "#ff9600", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
      harm: createColoring(["#d22e14", "#d22e14", "#131620"], ["#FFFFFF", "#40B66B", "white"]),
    },
  },
  sizing: {
    width: { xs: 14, sm: 16, md: 18, lg: 20, xl: 24 },
    spacing: { xs: 2, sm: 4, md: 8, lg: 12, xl: 16 },
    radius: { xs: 3, sm: 6, md: 9, lg: 12, xl: 15 },
  },
  alwaysShowTestTokens: true,
  showCopyOpportunityIdToClipboard: true,
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
      key: crypto.randomUUID(),
    },
    bridge: {
      icon: "RiCompassesLine",
      route: "/bridge",
      key: crypto.randomUUID(),
    },
    docs: {
      icon: "RiFile4Fill",
      external: true,
      route: "https://docs.merkl.xyz/",
      key: crypto.randomUUID(),
    },
    faq: {
      icon: "RiQuestionFill",
      route: "/faq",
      key: crypto.randomUUID(),
    },
    // terms: {
    //   icon: "RiCompassesLine",
    //   route: "/terms",
    //   key: crypto.randomUUID(),
    // },
    // privacy: {
    //   icon: "RiInformationFill",
    //   route: "/privacy",
    //   key: crypto.randomUUID(),
    // },
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
  footerLinks: [],
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
});
