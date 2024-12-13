import { useOutletContext } from "@remix-run/react";
import { Container, Space } from "dappkit/src";
import { useWalletContext } from "packages/dappkit/src/context/Wallet.context";
import OpportunityLibrary from "src/components/element/opportunity/OpportunityLibrary";
import type { OutletContextProtocol } from "./_merkl.protocols.$id";

export default function Index() {
  const { chains } = useWalletContext();
  const { opportunities, count } = useOutletContext<OutletContextProtocol>();

  return (
    <Container>
      <Space size="md" />
      <OpportunityLibrary opportunities={opportunities} count={count} chains={chains} />
    </Container>
  );
}
