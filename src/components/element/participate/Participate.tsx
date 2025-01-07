import type { Opportunity } from "@merkl/api";
import { Button, Group, Icon, Input, PrimitiveTag, Text, Value } from "dappkit";
import config from "merkl.config";
import { useWalletContext } from "packages/dappkit/src/context/Wallet.context";
import { Fmt } from "packages/dappkit/src/utils/formatter.service";
import { Suspense, useMemo, useState } from "react";
import { I18n } from "src/I18n";
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
  hideInteractor?: boolean;
};

export default function Participate({
  opportunity,
  displayOpportunity,
  displayMode,
  displayLinks,
  hideInteractor,
}: ParticipateProps) {
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

  const interactor = useMemo(() => {
    if (loading)
      return (
        <Group className="w-full justify-center">
          <Icon remix="RiLoader2Line" className="animate-spin" />
        </Group>
      );
    if (!targets?.length) return;

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
                    {!!inputToken && (
                      <PrimitiveTag noClick size="sm">
                        <Value
                          fallback={v => (v as string).includes("0.000") && "< 0.001"}
                          className="text-right items-center flex font-bold"
                          size="sm"
                          look="bold"
                          format="0,0.###a">
                          {Fmt.toNumber(inputToken?.balance, inputToken.decimals)}
                        </Value>{" "}
                        {inputToken?.symbol}
                      </PrimitiveTag>
                    )}
                    {!!BigInt(inputToken?.balance ?? "0") && (
                      <Value className="text-right" look={"soft"} size="sm" format={config.decimalFormat.dollar}>
                        {Fmt.toPrice(inputToken?.balance, inputToken)}
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
      {displayOpportunity && <OpportunityShortCard opportunity={opportunity} displayLinks={displayLinks} />}

      {displayLinks && (
        <Group className="w-full py-md">
          <Button to={link} look="soft" size="sm">
            Opportunity overview <Icon remix="RiArrowRightLine" />
          </Button>
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
      {!hideInteractor && interactor}
    </>
  );
}
