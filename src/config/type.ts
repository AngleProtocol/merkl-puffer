import type * as RemixIcon from "@remixicon/react";
import type { Mode, Themes, sizeScale } from "dappkit";
import type { WalletOptions } from "packages/dappkit/src/hooks/useWalletState";
import type { TagTypes } from "src/components/element/Tag";
import type { Chain } from "viem";
import { createConfig as createWagmiConfig } from "wagmi";
import type { OpportunityNavigationMode, OpportunityView } from "./opportunity";
import type { RewardsNavigationMode } from "./rewards";

export type routesType = {
  [key: string]: {
    route: string;
    icon: keyof typeof RemixIcon;
    key: string;
    external?: boolean;
  };
};

// TODO: groups by entity
export type MerklConfig<T extends Themes> = {
  themes: T;
  sizing: {
    width: { [Size in (typeof sizeScale)[number]]: number };
    spacing: { [Size in (typeof sizeScale)[number]]: number };
    radius: { [Size in (typeof sizeScale)[number]]: number };
  };
  tags?: string[];
  defaultTheme: keyof T;
  deposit?: boolean;
  chains?: Chain[];
  walletOptions?: WalletOptions;
  opportunityNavigationMode?: OpportunityNavigationMode;
  opportunityLibraryDefaultView?: OpportunityView;
  opportunityCellHideTags?: (keyof TagTypes)[];
  rewardsNavigationMode?: RewardsNavigationMode;
  opprtunityPercentage: boolean;
  hideLayerMenuHomePage: boolean;
  modes: Mode[];
  wagmi: Parameters<typeof createWagmiConfig>["0"];
  appName: string;
  fonts?: { title: string[]; text: string[]; mono: string[] };
  routes: routesType;
  opportunity: {
    featured: {
      enabled: boolean;
      length: number;
    };
  };
  bridge: {
    helperLink?: string;
  };
  header: {
    searchbar: {
      enabled: boolean;
    };
  };
  images: {
    [name: string]: string;
  };
  socials: {
    [key: string]: string;
  };
  links: {
    [key: string]: string;
  };
  footerLinks: { image: string; link: string; key: string }[];
};

export function createConfig<T extends Themes>({ wagmi, ...config }: MerklConfig<T>) {
  const wagmiConfig = createWagmiConfig(wagmi);

  return { wagmi: wagmiConfig, ...config };
}
