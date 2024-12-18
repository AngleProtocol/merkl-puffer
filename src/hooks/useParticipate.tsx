import { useWalletContext } from "dappkit/src/context/Wallet.context";
import { useMemo } from "react";
import useBalances from "./useBalances";
import useInteractionTarget from "./useInteractionTarget";

export default function useParticipate(
  chainId: number,
  protocolId?: string,
  identifier?: string,
  tokenAddress?: string,
) {
  const { target, loading: targetLoading } = useInteractionTarget(chainId, protocolId, identifier);
  const { balances } = useBalances(chainId);

  const { address } = useWalletContext();

  const token = useMemo(() => {
    return balances?.find(({ address }) => address === tokenAddress);
  }, [tokenAddress, balances]);

  const loading = useMemo(() => targetLoading, [targetLoading]);

  return {
    target,
    token,
    balance: balances,
    balances,
    address,
    loading,
  };
}
