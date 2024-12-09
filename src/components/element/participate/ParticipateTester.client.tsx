import { Box, Button, Group, Hash, Icon, Input, Select, Title } from "packages/dappkit/src";
import TransactionButton from "packages/dappkit/src/components/dapp/TransactionButton";
import { Suspense, useMemo, useState } from "react";
import type { api as clientApi } from "src/api/index.client";
import useParticipate from "src/hooks/useParticipate";
import { formatUnits } from "viem";
import Token from "../token/Token";

type Chains = Awaited<ReturnType<typeof clientApi.v4.chains.index.get>>["data"];

export type ParticipateTesterProps = {
  chains: Chains;
};

export default function ParticipateTester({ chains }: ParticipateTesterProps) {
  const [chainId, setChainId] = useState<number>();
  const [protocolId, setProtocolId] = useState<string>();
  const [target, setTarget] = useState<string>();
  const [tokenAddress, setTokenAddress] = useState();
  const [amount, setAmount] = useState<bigint>(0n);

  const {
    protocols,
    targets,
    balance,
    token: inputToken,
    approve,
    deposit,
    transaction,
  } = useParticipate(chainId, protocolId, target, tokenAddress, amount);

  const protocolOptions = useMemo(
    () =>
      protocols?.reduce(
        (obj, protocol) =>
          Object.assign(obj, {
            [protocol.id]: (
              <>
                <Icon size="sm" src={protocol?.icon} />
                {protocol?.name}
              </>
            ),
          }),
        {},
      ),
    [protocols],
  );

  const chainOptions = useMemo(
    () =>
      chains?.reduce(
        (obj, chain) =>
          Object.assign(obj, {
            [chain.id]: (
              <>
                <Icon size="sm" src={chain.icon} />
                {chain.name}
              </>
            ),
          }),
        {},
      ),
    [chains],
  );

  const targetOptions = useMemo(
    () =>
      (!!chainId &&
        !!protocolId &&
        targets?.[chainId]?.[protocolId]?.reduce(
          (obj, target) =>
            Object.assign(obj, {
              [target.identifier]: (
                <>
                  {/* <Icon size="sm" src={target.icon} /> */}
                  {/* {target.name} */}
                  {target?.tokens.map(tkn => (
                    <Token key={tkn.address} value token={tkn} format="amount" />
                  ))}
                </>
              ),
            }),
          {},
        )) ??
      {},
    [chainId, protocolId, targets],
  );

  const balanceOptions = useMemo(
    () =>
      balance?.reduce(
        (obj, token) =>
          Object.assign(obj, {
            [token.address]: (
              <>
                <Token key={token.address} value token={token} />({formatUnits(token?.balance, token?.decimals)})
              </>
            ),
          }),
        {},
      ) ?? {},
    [balance],
  );

  return (
    <Suspense>
      <Box size={"xl"}>
        <Group className="w-full [&>*]:grow">
          <Group className="flex-col">
            <Title h={5}>Chain</Title>
            <Select state={[chainId, setChainId]} loading={!chainOptions} placeholder="Chain" options={chainOptions} />
          </Group>
          <Group className="flex-col">
            <Title h={5}>Protocol</Title>
            <Select
              state={[protocolId, setProtocolId]}
              loading={!protocolOptions}
              placeholder="Protocol"
              options={protocolOptions}
            />
          </Group>
        </Group>
        <Group className="flex-col">
          <Title h={5}>Target</Title>
          <Group className="items-center w-full">
            <Select
              className="flex-1 grow w-full"
              state={[target, setTarget]}
              loading={!targetOptions}
              placeholder="Target"
              options={targetOptions}
            />
            <Hash copy format="short">
              {target}
            </Hash>
          </Group>
        </Group>
        <Group className="flex-col">
          <Title h={5}>Deposit</Title>
          <Group>
            <Input.BigInt state={[amount, setAmount]} base={inputToken?.decimals ?? 18} placeholder="0.0" />
            <Select
              state={[tokenAddress, setTokenAddress]}
              loading={!balanceOptions}
              placeholder="Token"
              options={balanceOptions}
            />
          </Group>
        </Group>
        <Group className="[&>*]:grow w-full">
          <Button className="justify-center" look="tint" onClick={approve} disabled={!transaction}>
            Approve
          </Button>
          <TransactionButton tx={transaction?.tx}>Approve</TransactionButton>
          <TransactionButton tx={transaction?.tx}>Participate</TransactionButton>
          <Button className="justify-center" look="hype" onClick={deposit} disabled={!transaction}>
            Participate
          </Button>
        </Group>
      </Box>
    </Suspense>
  );
}
