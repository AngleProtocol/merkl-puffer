import { createTable } from "dappkit";

export const [PositionTable, PositionRow, PositionColumns] = createTable({
  source: {
    name: "Source",
    size: "minmax(120px,1fr)",
    compact: "1fr",
    className: "justify-start",
    main: true,
  },
  flags: {
    name: "Flags",
    size: "minmax(100px,110px)",
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
