import { createTable } from "dappkit";

export const [OpportunityTable, OpportunityRow, opportunityColumns] = createTable({
  opportunity: {
    name: "Opportunities",
    size: "minmax(350px,1fr)",
    compact: "1fr",
    className: "justify-start",
    main: true,
  },
  actions: {
    name: "Actions",
    size: "minmax(min-content,150px)",
    compactSize: "minmax(min-content,1fr)",
    className: "justify-center",
  },
  apy: {
    name: "APY",
    size: "minmax(min-content,150px)",
    compactSize: "minmax(min-content,1fr)",
    className: "justify-center",
  },
  tvl: {
    name: "TVL",
    size: "minmax(min-content,150px)",
    compactSize: "minmax(min-content,1fr)",
    className: "justify-center",
  },
  rewards: {
    name: "Daily rewards",
    size: "minmax(min-content,150px)",
    compactSize: "minmax(min-content,1fr)",
    className: "justify-center",
  },
});
