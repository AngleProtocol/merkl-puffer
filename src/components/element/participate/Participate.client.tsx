import type { Opportunity } from "@merkl/api";
import { Box, Button, Group, Input, Select, Space, Text } from "dappkit";
import TransactionButton from "packages/dappkit/src/components/dapp/TransactionButton";
import { useMemo, useState } from "react";
import useParticipate from "src/hooks/useParticipate";
import { formatUnits } from "viem";
import Token from "../token/Token";

export type ParticipateProps = {
  opportunity: Opportunity;
};

export default function Participate({ opportunity }: ParticipateProps) {
  const [tokenAddress, setTokenAddress] = useState();
  const [amount, setAmount] = useState<bigint>(0n);
  const {
    target,
    targets,
    balance,
    token: inputToken,
    approve,
    deposit,
    transaction,
  } = useParticipate(opportunity.chainId, opportunity.protocol?.id, opportunity.identifier, tokenAddress, amount);

  console.log("tx", transaction, opportunity.identifier, target);

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
    <>
      <Box>
        <Box size="sm" look="soft" className="flex-row [&>*]:grow">
          <Button look="bold" className="justify-center">
            Deposit
          </Button>
          <Button look="soft" className="justify-center">
            {target && "TARGET"}
          </Button>
        </Box>
        <Group>
          <Input.BigInt state={[amount, setAmount]} base={inputToken?.decimals ?? 18} placeholder="0.0" />
          <Select
            state={[tokenAddress, setTokenAddress]}
            loading={!balanceOptions}
            placeholder="Token"
            options={balanceOptions}
          />
        </Group>
        <Input header={<Text size="xs">token0</Text>} />
        <Input header={<Text size="xs">token1</Text>} />
        <TransactionButton tx={transaction?.approval}>Approve</TransactionButton>
        <TransactionButton tx={transaction?.transaction}>Participate</TransactionButton>
      </Box>
      <Space size="md" />
      <Text className="text-center w-full" size="sm">
        Warning about the fiability of the feature
      </Text>
    </>
  );
}
