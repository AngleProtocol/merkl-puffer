import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Container } from "dappkit";
import { LiquidityService } from "src/api/services/liquidity.service";
import PositionLibrary from "src/components/element/position/PositionLibrary";
import { isAddress } from "viem";

export async function loader({ params: { address, chainId } }: LoaderFunctionArgs) {
  if (!address || !isAddress(address)) throw "";
  if (!chainId && Number(chainId).toString() === chainId) throw "";

  const positions = await LiquidityService.getForUser({
    address,
    chainId: Number(chainId),
  });
  return json({ positions });
}

export default function Index() {
  const { positions } = useLoaderData<typeof loader>();
  return (
    <Container>
      <PositionLibrary positions={positions} />
    </Container>
  );
}
