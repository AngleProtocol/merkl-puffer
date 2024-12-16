import { useWalletContext } from "dappkit/src/context/Wallet.context";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api as clientApi } from "src/api/index.client";
import { parseAbi } from "viem";
import { useSendTransaction } from "wagmi";
import { useWriteContract } from "wagmi";

type Targets = Awaited<ReturnType<typeof clientApi.v4.interaction.targets.get>>["data"];
type Protocols = Awaited<ReturnType<typeof clientApi.v4.interaction.protocols.get>>["data"];
type TokenBalances = Awaited<ReturnType<typeof clientApi.v4.tokens.balances.get>>["data"];
type Payload = Parameters<typeof clientApi.v4.interaction.transaction.get>[0]["query"];
type Transaction = Awaited<ReturnType<typeof clientApi.v4.interaction.transaction.get>>["data"];

const abi = parseAbi([
  "function approve(address, uint256) returns (bool)",
  "function transferFrom(address, address, uint256) returns (bool)",
]);

export default function useParticipate(
  chainId?: number,
  protocolId?: string,
  identifier?: string,
  tokenAddress?: string,
  amount?: bigint,
) {
  const [balances, setBalances] = useState<{
    [chainId: number]: { [address: string]: TokenBalances };
  }>();
  const [targets, setTargets] = useState<{
    [chainId: number]: { [protocolId: string]: Targets };
  }>();
  const [transaction, setTransaction] = useState<Transaction>();

  const { address } = useWalletContext();
  const { sendTransaction } = useSendTransaction();
  const { writeContract } = useWriteContract();

  const target = useMemo(() => {
    if (!chainId || !protocolId) return;

    return targets?.[chainId]?.[protocolId]?.find?.(
      ({ identifier: id }) => id?.toLowerCase?.() === identifier?.toLowerCase?.(),
    );
  }, [chainId, protocolId, targets, identifier]);

  const balance = useMemo(() => {
    if (!chainId || !address) return;
    return balances?.[chainId]?.[address];
  }, [chainId, address, balances]);

  const token = useMemo(() => {
    return balance?.find(({ address }) => address === tokenAddress);
  }, [tokenAddress, balance]);

  useEffect(() => {
    async function fetchTargets() {
      console.log(chainId, protocolId, identifier);

      if (!chainId || !protocolId || !identifier) return;

      const { data: targets, ...res } = await clientApi.v4.interaction.targets.get({
        query: { chainId, protocolId, identifier },
      });

      if (res.status === 200)
        setTargets(t => {
          return Object.assign(t ? { ...t } : {}, {
            [chainId]: Object.assign(t?.[chainId] ?? {}, {
              [protocolId]: targets,
            }),
          });
        });
    }

    fetchTargets();
  }, [chainId, protocolId, identifier]);

  useEffect(() => {
    async function fetchTokenBalances() {
      if (!chainId || !address) return;

      const { data: tokens, ...res } = await clientApi.v4.tokens.balances.get({
        query: { chainId: chainId, userAddress: address },
      });

      if (res.status === 200)
        setBalances(b =>
          Object.assign(b ? { ...b } : {}, {
            [chainId]: Object.assign(b?.[chainId] ?? {}, { [address]: tokens }),
          }),
        );
    }

    fetchTokenBalances();
  }, [chainId, address]);

  const payload: Payload | undefined = useMemo(() => {
    if (!chainId || !protocolId || !address || !amount || !tokenAddress || !target?.identifier) return;

    const token = balance?.find(({ address: a }) => a === tokenAddress);

    if (!token) return;

    return {
      chainId,
      protocolId,
      identifier: target?.identifier,
      userAddress: address,
      fromAmount: amount?.toString(),
      fromTokenAddress: tokenAddress,
    };
  }, [chainId, protocolId, target, address, balance, tokenAddress, amount]);

  useEffect(() => {
    async function fetchTransaction() {
      if (!payload) return;

      const { data: transaction, ...res } = await clientApi.v4.interaction.transaction.get({ query: payload });

      console.log("tcx", transaction);

      if (res.status === 200) setTransaction(transaction);
    }

    fetchTransaction();
  }, [payload]);

  const approve = useCallback(() => {
    if (!transaction) return;

    const res = sendTransaction({
      to: transaction.approval.to as `0x${string}`,
      data: transaction.approval.data,
    });

    return res;
  }, [transaction, sendTransaction]);

  const deposit = useCallback(() => {
    if (!transaction) return;

    const res = sendTransaction({
      to: transaction.transaction.to as `0x${string}`,
      data: transaction?.transaction.data as `0x${string}`,
    });

    console.info(res);
  }, [transaction, sendTransaction]);

  return {
    target,
    targets,
    token,
    balance,
    balances,
    address,
    deposit,
    approve,
    transaction,
  };
}
