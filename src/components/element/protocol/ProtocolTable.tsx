import { createTable } from "dappkit";

export const [ProtocolTable, ProtocolRow, protocolColumns] = createTable({
  protocol: {
    name: "Protocol",
    size: "minmax(350px,1fr)",
    compact: "1fr",
    className: "justify-start",
    main: true,
  },
});
