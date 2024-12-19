import { createTable } from "dappkit";

export const [HistoricalClaimsTable, HistoricalClaimsRow, HistoricalClaimsColumns] = createTable({
  chain: {
    name: "Chain",
    size: "minmax(120px,150px)",
    compact: "1fr",
    className: "justify-start",
    main: true,
  },
  token: {
    name: "Token",
    size: "minmax(120px,150px)",
    compact: "1fr",
    className: "justify-start",
    main: true,
  },
  date: {
    name: "Date",
    size: "minmax(30px,1fr)",
    compactSize: "minmax(20px,1fr)",
    className: "justify-end",
  },
  transaction: {
    name: "Transaction",
    size: "minmax(30px,1fr)",
    compactSize: "minmax(20px,0.5fr)",
    className: "justify-end",
  },
});
