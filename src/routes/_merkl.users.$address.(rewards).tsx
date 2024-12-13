import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData, useOutletContext } from "@remix-run/react";
import { Container, Space } from "dappkit";
import ClaimRewardsLibrary from "src/components/element/rewards/ClaimRewardsLibrary";
import type { OutletContextRewards } from "./_merkl.users.$address";

export async function loader({ params: { address } }: LoaderFunctionArgs) {
  if (!address) throw "";

  return json({ address });
}

export default function Index() {
  const { address } = useLoaderData<typeof loader>();
  const { sortedRewards } = useOutletContext<OutletContextRewards>();

  return (
    <Container>
      <Space size="md" />
      <ClaimRewardsLibrary from={address} rewards={sortedRewards} />
    </Container>
  );
}
