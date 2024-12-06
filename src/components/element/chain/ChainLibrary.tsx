import type { Chain } from "@merkl/api";
import { useMemo } from "react";
import { ChainTable } from "./ChainTable";
import ChainTableRow from "./ChainTableRow";

export type ChainLibraryProps = {
  chains: Chain[];
  count?: number;
};

export default function ChainLibrary({ chains }: ChainLibraryProps) {
  const rows = useMemo(() => chains?.map(c => <ChainTableRow key={`${c.id}`} chain={c} />), [chains]);

  return <ChainTable>{rows}</ChainTable>;
}
