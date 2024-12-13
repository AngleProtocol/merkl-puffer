import { Outlet } from "@remix-run/react";
import { Icon } from "dappkit";
import { useWalletContext } from "packages/dappkit/src/context/Wallet.context";
import { useState } from "react";
import Hero from "src/components/composite/Hero";

export default function Index() {
  const [_isEditingAddress] = useState(false);
  const { address } = useWalletContext();

  return (
    <Hero
      breadcrumbs={[]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={"Claims"}
      description={"Claim and monitor the rewards awarded through Merkl"}
      tabs={[
        {
          label: (
            <>
              <Icon size="sm" remix="RiGift2Fill" />
              Rewards
            </>
          ),
          link: `/users/${address}`,
          key: crypto.randomUUID(),
        },
        {
          label: (
            <>
              <Icon size="sm" remix="RiDropFill" />
              Liquidity
            </>
          ),
          link: `/users/${address}/liquidity`,
          key: crypto.randomUUID(),
        },
        {
          label: (
            <>
              <Icon size="sm" remix="RiListCheck3" />
              Claims
            </>
          ),
          link: `/users/${address}/claims`,
          key: crypto.randomUUID(),
        },
      ]}>
      <Outlet />
    </Hero>
  );
}
