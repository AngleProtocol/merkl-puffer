import { useWalletContext } from "packages/dappkit/src/context/Wallet.context";
import { Fmt } from "packages/dappkit/src/utils/formatter.service";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { api as clientApi } from "src/api/index.client";
import { InteractionService } from "src/api/services/interaction.service";

type TokenBalances = Awaited<ReturnType<typeof clientApi.v4.tokens.balances.get>>["data"];

export default function useBalances(chainId?: number, userAddress?: string) {
  const { chainId: connectedChainId, address: connectedAddress } = useWalletContext();

  const address = useMemo(() => userAddress ?? connectedAddress, [userAddress, connectedAddress]);
  const chain = useMemo(() => chainId ?? connectedChainId, [chainId, connectedChainId]);

  const [chainBalances, setChainBalances] = useState<{
    [chainId: number]: { [address: string]: TokenBalances };
  }>();

  const balances = useMemo(() => {
    if (!chainId || !address) return;
    return chainBalances?.[chainId]?.[address];
  }, [chainId, address, chainBalances]);

  useEffect(() => {
    async function fetchTokenBalances() {
      if (!chain || !address) return;

      try {
        const tokens = await InteractionService.getBalances(chain, address);

        setChainBalances(b =>
          Object.assign(b ? { ...b } : {}, {
            [chain]: Object.assign(b?.[chain] ?? {}, {
              [address]: tokens.sort((a, b) => Fmt.toPrice(b.balance, b) - Fmt.toPrice(a.balance, a)),
            }),
          }),
        );
      } catch (_err) {
        console.log("ERROR");
      }
    }

    fetchTokenBalances();
  }, [chain, address]);

  const balanceOf = useCallback(
    (token: { address?: string; symbol?: string }) =>
      balances?.find(({ address, symbol }) => {
        if (token.address && address?.toLowerCase?.() === token?.address?.toLowerCase?.()) return true;
        if (token.symbol && symbol?.toLowerCase?.() === token?.symbol?.toLowerCase?.()) return true;
      }),
    [balances],
  );

  return { balanceOf, balances };
}
