import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Container, Space } from "dappkit";
import { ClaimsService } from "src/api/services/claims.service";
import HistoricalClaimsLibrary from "src/components/element/historicalClaimsLibrary/HistoricalClaimsLibrary";
import { isAddress } from "viem";

export async function loader({ params: { address } }: LoaderFunctionArgs) {
  if (!address || !isAddress(address)) throw "";
  const claims = await ClaimsService.getForUser(address);
  return json({ claims });
}

export default function Index() {
  const { claims } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Space size="md" />
      <HistoricalClaimsLibrary claims={claims} />
    </Container>
  );
}
