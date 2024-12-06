import { createTable } from "dappkit";

export const [ClaimRewardsChainTable, ClaimRewardsChainRow, claimRewardsChainColumns] = createTable({
  chain: {
    name: "Chain",
    size: "minmax(180px,1fr)",
    compact: "1fr",
    className: "justify-start",
    main: true,
  },
  unclaimed: {
    name: "Unclaimed",
    size: "minmax(100px,150px)",
    compactSize: "minmax(min-content,1fr)",
    className: "justify-end",
  },
  claimed: {
    name: "Claimed",
    size: "minmax(100px,150px)",
    compactSize: "minmax(min-content,1fr)",
    className: "justify-end",
  },
});
