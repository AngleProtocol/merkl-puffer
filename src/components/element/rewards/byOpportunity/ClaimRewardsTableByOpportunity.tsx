import { createTable } from "dappkit";

export const [ClaimRewardsTableByOpportunity, ClaimRewardsByOpportunityRow, claimRewardsByOpportunityColumns] =
  createTable({
    positions: {
      name: "Positions",
      size: "minmax(100px,1fr)",
      compact: "1fr",
      className: "justify-start",
      main: true,
    },
    // action: {
    //   name: "Actions",
    //   size: "minmax(min-content,200px)",
    //   compactSize: "minmax(min-content,200px)",
    //   className: "justify-end",
    // },
    claimed: {
      name: "Claimed",
      size: "minmax(min-content,200px)",
      compactSize: "minmax(min-content,200px)",
      className: "justify-end",
    },
    unclaimed: {
      name: "Unclaimed",
      size: "minmax(min-content,200px)",
      compactSize: "minmax(min-content,200px)",
      className: "justify-end",
    },
    button: {
      name: "",
      size: "minmax(min-content,200px)",
      compactSize: "minmax(min-content,200px)",
      className: "justify-end",
    },
  });
