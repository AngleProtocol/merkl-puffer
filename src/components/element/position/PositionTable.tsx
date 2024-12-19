import { createTable } from "dappkit";

export const [PositionTable, PositionRow, PositionColumns] = createTable({
  source: {
    name: "Source",
    size: "minmax(120px,150px)",
    compact: "1fr",
    className: "justify-start",
    main: true,
  },
  flags: {
    name: "Flags",
    size: "minmax(170px,1fr)",
    compactSize: "1fr",
    className: "justify-start",
  },
  tokens: {
    name: "Tokens",
    size: "minmax(30px,1fr)",
    compactSize: "minmax(20px,1fr)",
    className: "justify-start",
  },
});
