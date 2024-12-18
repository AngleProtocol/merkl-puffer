import type { Token } from "@merkl/api";
//TODO: export from api index
import type { InteractionTarget } from "@merkl/api/dist/src/modules/v4/interaction/interaction.model";
import { useWalletContext } from "packages/dappkit/src/context/Wallet.context";
import { useEffect, useMemo, useState } from "react";
import type { api as clientApi } from "src/api/index.client";
import { InteractionService } from "src/api/services/interaction.service";

type Payload = Parameters<typeof clientApi.v4.interaction.transaction.get>[0]["query"];
type Transaction = Awaited<ReturnType<typeof clientApi.v4.interaction.transaction.get>>["data"];

export default function useInteractionTransaction(
  chainId: number,
  protocolId?: string,
  target?: InteractionTarget,
  tokenIn?: Token,
  amount?: bigint,
  userAddress?: string,
) {
  const { address: connectedAddress } = useWalletContext();
  const address = useMemo(() => userAddress ?? connectedAddress, [userAddress, connectedAddress]);

  const [transaction, setTransaction] = useState<Transaction>();
  const payload: Payload | undefined = useMemo(() => {
    if (!chainId || !protocolId || !address || !amount || !tokenIn || !target?.identifier) return;
    return {
      chainId,
      protocolId,
      identifier: target?.identifier,
      userAddress: address,
      fromAmount: amount?.toString(),
      fromTokenAddress: tokenIn?.address,
    };
  }, [chainId, protocolId, target, address, tokenIn, amount]);

  useEffect(() => {
    async function fetchTransaction() {
      if (!payload) return;

      const tx = await InteractionService.getTransaction(payload);

      setTransaction(tx);
    }

    fetchTransaction();
  }, [payload]);

  return { transaction };
}
