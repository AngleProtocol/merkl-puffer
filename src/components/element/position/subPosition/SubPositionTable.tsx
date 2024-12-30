import { createTable } from "dappkit";

export const [SubPositionTable, SubPositionRow, SubPositionColumns] = createTable({
  source: {
    name: "Source",
    size: "minmax(120px,1fr)",
    compact: "1fr",
    className: "justify-start",
    main: true,
  },
  inRange: {
    name: "In range",
    size: "minmax(30px,0.2fr)",
    compactSize: "minmax(20px,1fr)",
    className: "justify-start",
  },
  liquidity: {
    name: "Liquidity",
    size: "minmax(30px,0.2fr)",
    compactSize: "minmax(20px,1fr)",
    className: "justify-end",
  },
  token0: {
    name: "TOKEN 0",
    size: "minmax(30px,0.5fr)",
    compactSize: "minmax(20px,1fr)",
    className: "justify-end",
  },
  token1: {
    name: "TOKEN 1",
    size: "minmax(30px,0.5fr)",
    compactSize: "minmax(20px,1fr)",
    className: "justify-end",
  },
});
