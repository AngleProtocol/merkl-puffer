export const chains = {
  1: {
    label: "Ethereum",
    short: "eth",
    asset: (await import("../assets/chains/ethereum.svg?url")).default,
  },
  10: {
    label: "Optimism",
    short: "op",
    asset: (await import("../assets/chains/optimism.svg?url")).default,
  },
  42161: {
    label: "Arbitrum",
    short: "arb",
    asset: (await import("../assets/chains/arbitrum.svg?url")).default,
  },
  137: {
    label: "Polygon",
    short: "pol",
    asset: (await import("../assets/chains/polygon.svg?url")).default,
  },
  1313161554: { label: "AURORA", short: "aurora", asset: (await import("../assets/chains/aurora.svg?url")).default },
  43114: { label: "Avalance", short: "avalanche", asset: (await import("../assets/chains/avalanche.svg?url")).default },
  8453: { label: "Base", short: "base", asset: (await import("../assets/chains/base.svg?url")).default },
  56: { label: "Binance Smart Chain", short: "bsc", asset: (await import("../assets/chains/bsc.svg?url")).default },
  42220: { label: "Celo", short: "celo", asset: (await import("../assets/chains/celo.svg?url")).default },
  1116: { label: "Core", short: "core", asset: (await import("../assets/chains/core.svg?url")).default },
  250: { label: "Fantom", short: "fantom", asset: (await import("../assets/chains/fantom.svg?url")).default },
  122: { label: "Fuse", short: "fuse", asset: (await import("../assets/chains/fuse.svg?url")).default },
  196: { label: "XLayer", short: "xlayer", asset: (await import("../assets/chains/xlayer.svg?url")).default },
  100: { label: "Gnosis", short: "gno", asset: (await import("../assets/chains/gnosis.svg?url")).default },
  59144: { label: "Linea", short: "lin", asset: (await import("../assets/chains/linea.svg?url")).default },
  5000: { label: "Mantle", short: "man", asset: (await import("../assets/chains/mantle.svg?url")).default },
  1101: {
    label: "Polygon zkEVM",
    short: "polzkevm",
    asset: (await import("../assets/chains/polygonzkevm.svg?url")).default,
  },
  108: {
    label: "Thundercore",
    short: "thundercore",
    asset: (await import("../assets/chains/thundercore.svg?url")).default,
  },
  324: { label: "ZKSync", short: "zksync", asset: (await import("../assets/chains/zksync.svg?url")).default },
  534352: { label: "Scroll", short: "scroll", asset: (await import("../assets/chains/scroll.png?url")).default },
  169: { label: "Manta", short: "manta", asset: (await import("../assets/chains/manta.svg?url")).default },
  13371: {
    label: "Immutable",
    short: "Immutable",
    asset: (await import("../assets/chains/immutable.svg?url")).default,
  },
  81457: { label: "Blast", short: "blast", asset: (await import("../assets/chains/blast.svg?url")).default },
  34443: { label: "Mode", short: "mode", asset: (await import("../assets/chains/mode.svg?url")).default },
  592: { label: "Astar", short: "astar", asset: (await import("../assets/chains/astar.png?url")).default },
  3776: {
    label: "Astart zkEVM",
    short: "astarzkevm",
    asset: (await import("../assets/chains/astarzkevm.png?url")).default,
  },
  30: { label: "Rootstock", short: "rootstock", asset: (await import("../assets/chains/rootstock.svg?url")).default },
  167000: { label: "Taiko", short: "taiko", asset: (await import("../assets/chains/taiko.svg?url")).default },
  1329: { label: "Sei", short: "sei", asset: (await import("../assets/chains/sei.svg?url")).default },
  1284: { label: "Moonbeam", short: "moonbeam", asset: (await import("../assets/chains/moonbeam.svg?url")).default },
  2046399126: { label: "Skale", short: "skale", asset: (await import("../assets/chains/skale.png?url")).default },
  252: { label: "Fraxtal", short: "fraxtal", asset: (await import("../assets/chains/fraxtal.svg?url")).default },
  60808: { label: "BOB", short: "bib", asset: (await import("../assets/chains/bob.svg?url")).default },
} as const;

export type ChainId = keyof typeof chains;

export function getChainId(labelOrShort: string): ChainId | undefined {
  for (const [chainId, { label, short }] of Object.entries(chains)) {
    if (
      label?.toLowerCase() === labelOrShort?.toLowerCase() ||
      short?.toLocaleLowerCase() === labelOrShort?.toLowerCase()
    )
      return chainId;
  }
}
