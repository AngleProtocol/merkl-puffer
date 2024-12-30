import { createTable } from "dappkit";

export const [PositionTable, PositionRow, PositionColumns] = createTable({
  source: {
    name: "",
    size: "minmax(120px,1fr)",
    compact: "1fr",
    className: "justify-start",
    main: true,
  },
  liquidity: {
    name: "Liquidity",
    size: "minmax(30px,0.2fr)",
    compactSize: "minmax(20px,1fr)",
    className: "justify-start",
  },
  supplyShare: {
    name: "Supply share",
    size: "minmax(30px,0.2fr)",
    compactSize: "minmax(20px,1fr)",
    className: "justify-end",
  },
});
