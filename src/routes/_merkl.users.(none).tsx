import { Outlet } from "@remix-run/react";
import { Icon } from "dappkit";
import { useWalletContext } from "packages/dappkit/src/context/Wallet.context";
import { useState } from "react";
import Hero from "src/components/composite/Hero";
import { isAddress } from "viem";

export default function Index() {
  const [_isEditingAddress] = useState(false);
  const { address } = useWalletContext();

  return (
    <Hero
      breadcrumbs={[]}
      navigation={{ label: "Back to opportunities", link: "/" }}
      title={"Claims"}
      description={"Claim and monitor the rewards awarded through Merkl"}
      tabs={
        !address || !isAddress(address)
          ? []
          : [
              {
                label: (
                  <>
                    <Icon size="sm" remix="RiGift2Fill" />
                    Rewards
                  </>
                ),
                link: `/users/${address}`,
                key: "Rewards",
              },
              {
                label: (
                  <>
                    <Icon size="sm" remix="RiDropFill" />
                    Liquidity
                  </>
                ),
                link: `/users/${address}/liquidity`,
                key: "Liquidity",
              },
              {
                label: (
                  <>
                    <Icon size="sm" remix="RiListCheck3" />
                    Claims
                  </>
                ),
                link: `/users/${address}/claims`,
                key: "Claims",
              },
            ]
      }>
      <Outlet />
    </Hero>
  );
}
