import { createTable } from "dappkit";

export const [ClaimRewardsTokenTable, ClaimRewardsTokenRow, claimRewardsTokenColumns] = createTable({
  token: {
    name: "Token",
    size: "minmax(100px,1fr)",
    compact: "1fr",
    className: "justify-start",
    main: true,
  },
  pending: {
    name: "Pending",
    size: "minmax(min-content,150px)",
    compactSize: "minmax(min-content,200px)",
    className: "justify-end",
  },
  amount: {
    name: "Unclaimed",
    size: "minmax(min-content,150px)",
    compactSize: "minmax(min-content,200px)",
    className: "justify-end",
  },
  claimed: {
    name: "Claimed",
    size: "minmax(min-content,150px)",
    compactSize: "minmax(min-content,200px)",
    className: "justify-end",
  },
});

export type Rewards = {
  [chain: number]: {
    claimed: number;
    unclaimed: number;
    tokens: {
      [address: string]: {
        symbol: string;
        amount: number;
        price: number;
      };
    };
  };
};
