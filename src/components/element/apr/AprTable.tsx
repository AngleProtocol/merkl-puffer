import { createTable } from "dappkit";

export const [AprTable, AprRow, aprColumns] = createTable({
  name: {
    name: "APR DETAILS",
    size: "minmax(350px,1fr)",
    compact: "1fr",
    className: "justify-start",
    main: true,
  },
  value: {
    name: "APR",
    size: "minmax(min-content,150px)",
    compactSize: "minmax(min-content,1fr)",
    className: "justify-center",
  },
});
