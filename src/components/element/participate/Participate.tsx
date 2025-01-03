import type { Opportunity } from "@merkl/api";
import { Button, Group, Icon, Input, PrimitiveTag, Text, Value } from "dappkit";

import { useWalletContext } from "packages/dappkit/src/context/Wallet.context";
import { Suspense, useMemo, useState } from "react";
import { I18n } from "src/I18n";
import useOpportunity from "src/hooks/resources/useOpportunity";
import useParticipate from "src/hooks/useParticipate";
import { formatUnits } from "viem";
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
  const [amount, setAmount] = useState<bigint>();
  const [mode] = useState<"deposit" | "withdraw">(typeof displayMode === "string" ? displayMode : "deposit");

  const {
    targets,
    balance,
    token: inputToken,
    loading,
  } = useParticipate(opportunity.chainId, opportunity.protocol?.id, opportunity.identifier, tokenAddress);
  const { link } = useOpportunity(opportunity);
  const { connected } = useWalletContext();

  //TODO: add withdraw
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

  const visitUrl = useMemo(() => {
    if (!!opportunity.depositUrl) return opportunity.depositUrl;
    if (!!opportunity.protocol?.url) return opportunity.protocol?.url;
  }, [opportunity]);

  const interactor = useMemo(() => {
    if (loading)
      return (
        <Group className="w-full justify-center">
          <Icon remix="RiLoader2Line" className="animate-spin" />
        </Group>
      );
    if (!targets?.length) return;

    const amountFormatted = amount ? formatUnits(amount, inputToken?.decimals ?? 18) : undefined;
    const amountUSD = !amount ? 0 : (inputToken?.price ?? 0) * Number.parseFloat(amountFormatted ?? "0");
    return (
      <Group className="mt-lg">
        <Input.BigInt
          className="w-full gap-xs"
          inputClassName="font-title font-bold italic text-[clamp(38px,0.667vw+1.125rem,46px)] !leading-none"
          look="bold"
          size="lg"
          state={[amount, a => setAmount(a)]}
          base={inputToken?.decimals ?? 18}
          header={
            <Group className="justify-between w-full">
              <Text size={5}>{mode === "deposit" ? "Supply" : "Withdraw"}</Text>
              {inputToken && (
                <Button
                  onClick={() => {
                    setAmount(BigInt(inputToken?.balance ?? "0"));
                  }}
                  look="soft"
                  size="xs">
                  <Group className="items-center">
                    {!!amount && (
                      <PrimitiveTag noClick size="sm">
                        <Value
                          fallback={v => (v as string).includes("0.000") && "< 0.001"}
                          className="text-right items-center flex font-bold"
                          size="sm"
                          look="bold"
                          format="0,0.###a">
                          {amountFormatted}
                        </Value>{" "}
                        {inputToken?.symbol}
                      </PrimitiveTag>
                    )}
                    {!!amount && (
                      <Value className="text-right" look={"soft"} size="sm" format="$0,0.#">
                        {amountUSD}
                      </Value>
                    )}
                    Max
                  </Group>
                </Button>
              )}
            </Group>
          }
          suffix={connected && <TokenSelect balances state={[tokenAddress, setTokenAddress]} tokens={balance} />}
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
  }, [opportunity, mode, inputToken, loading, amount, tokenAddress, balance, targets, connected]);

  return (
    <>
      {displayOpportunity && <OpportunityShortCard opportunity={opportunity} />}

      {displayLinks && (
        <Group className="w-full justify-between">
          <Group>
            {opportunity.protocol && (
              <Button external to={opportunity.protocol?.url} disabled={!opportunity.protocol?.url} look="bold">
                Visit {opportunity.protocol.name} for advanced settings
                <Icon remix="RiArrowRightUpLine" />
              </Button>
            )}
          </Group>
          <Group className="flex-col justify-center">
            <Button to={link} look="soft" size="sm">
              Pool overview <Icon remix="RiArrowRightLine" />
            </Button>
          </Group>
        </Group>
      )}
      {!!I18n.trad.get.pages.home.depositInformation && (
        <Group className="rounded-md p-md bg-main-5 flex-nowrap items-start">
          <Icon remix="RiInformation2Fill" className="text-lg text-accent-11 flex-shrink-0" />
          <Text look="bold" size="xs">
            {I18n.trad.get.pages.home.depositInformation}
          </Text>
        </Group>
      )}
      {interactor}
    </>
  );
}
