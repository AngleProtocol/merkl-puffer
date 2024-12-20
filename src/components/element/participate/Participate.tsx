import type { Opportunity } from "@merkl/api";
import { Button, Group, Icon, Input, PrimitiveTag, Text, Value } from "dappkit";
import { Fmt } from "packages/dappkit/src/utils/formatter.service";
import { Suspense, useMemo, useState } from "react";
import useOpportunity from "src/hooks/resources/useOpportunity";
import useParticipate from "src/hooks/useParticipate";
import OpportunityShortCard from "../opportunity/OpportunityShortCard";
import TokenSelect from "../token/TokenSelect";
import Interact from "./Interact.client";

export type ParticipateProps = {
  opportunity: Opportunity;
  displayOpportunity?: boolean;
  displayMode?: boolean | "withdraw" | "deposit";
  displayLinks?: boolean;
};

export default function Participate({ opportunity, displayOpportunity, displayMode, displayLinks }: ParticipateProps) {
  const [tokenAddress, setTokenAddress] = useState();
  const [amount, setAmount] = useState<bigint>(0n);
  const [mode] = useState<"deposit" | "withdraw">(typeof displayMode === "string" ? displayMode : "deposit");

  const {
    targets,
    balance,
    token: inputToken,
    loading,
  } = useParticipate(opportunity.chainId, opportunity.protocol?.id, opportunity.identifier, tokenAddress);
  const { link } = useOpportunity(opportunity);

  // const switchModeButton = useMemo(() => {
  //   if (typeof displayMode === "boolean" && !displayMode) return;
  //   switch (mode) {
  //     case "deposit":
  //       return (
  //         <Button onClick={() => setMode("withdraw")} size="sm">
  //           Withdraw
  //         </Button>
  //       );
  //     case "withdraw":
  //       return (
  //         <Button onClick={() => setMode("deposit")} size="sm">
  //           Supply
  //         </Button>
  //       );
  //   }
  // }, [mode]);

  const interactor = useMemo(() => {
    if (loading)
      return (
        <Group className="w-full justify-center">
          <Icon remix="RiLoader2Line" className="animate-spin" />
        </Group>
      );
    if (!targets?.length) return;
    return (
      <Group>
        <Input.BigInt
          className="w-full"
          look="bold"
          state={[amount, a => setAmount(a)]}
          base={inputToken?.decimals ?? 18}
          header={
            <Group className="justify-between w-full">
              <Text>{mode === "deposit" ? "Supply" : "Withdraw"}</Text>
              <Group>
                <Text>Balance</Text>
                {inputToken && <Value format="$0,0.#">{Fmt.toPrice(inputToken.balance, inputToken)}</Value>}
                <PrimitiveTag
                  onClick={() => {
                    setAmount(BigInt(inputToken?.balance ?? "0"));
                  }}
                  size="xs">
                  Max
                </PrimitiveTag>
              </Group>
            </Group>
          }
          suffix={<TokenSelect balances state={[tokenAddress, setTokenAddress]} tokens={balance} />}
          placeholder="0.0"
        />
        <Suspense>
          <Interact
            disabled={!loading && !targets?.length}
            target={targets?.[0]}
            inputToken={inputToken}
            amount={amount}
            opportunity={opportunity}
          />
        </Suspense>
      </Group>
    );
  }, [opportunity, mode, inputToken, loading, amount, tokenAddress, balance, targets]);

  return (
    <>
      {displayOpportunity && <OpportunityShortCard opportunity={opportunity} />}
      {displayLinks && (
        <Group className="w-full justify-between">
          <Group>
            {opportunity.protocol && (
              <Button
                external
                to={opportunity.protocol?.url}
                disabled={!opportunity.protocol?.url}
                size="md"
                look="base">
                Visit {opportunity.protocol.name}
                <Icon remix="RiArrowRightUpLine" />
              </Button>
            )}
          </Group>
          <Group className="flex-col justify-center">
            <Button to={link} size="md" look="soft">
              More info <Icon remix="RiArrowRightLine" />
            </Button>
          </Group>
        </Group>
      )}
      {interactor}
    </>
  );
}
