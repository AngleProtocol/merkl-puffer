import { Title, createTable } from "dappkit";

export const [OpportunityTable, OpportunityRow, opportunityColumns] = createTable({
  opportunity: {
    name: (
      <Title h={5} look="soft">
        Opportunities
      </Title>
    ),
    size: "minmax(350px,1fr)",
    compact: "1fr",
    className: "justify-start",
    main: true,
  },
  apr: {
    name: "APR",
    size: "minmax(min-content,150px)",
    compactSize: "minmax(min-content,1fr)",
    className: "md:justify-center",
  },
  tvl: {
    name: "TVL",
    size: "minmax(min-content,150px)",
    compactSize: "minmax(min-content,1fr)",
    className: "md:justify-center",
  },
  rewards: {
    name: "Daily rewards",
    size: "minmax(min-content,150px)",
    compactSize: "minmax(min-content,1fr)",
    className: "md:justify-center",
  },
});
