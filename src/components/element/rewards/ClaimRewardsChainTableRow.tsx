import type { Reward } from "@merkl/api";
import { Button, type Component, Icon, Space, Value, mergeClass } from "dappkit";
import TransactionButton from "packages/dappkit/src/components/dapp/TransactionButton";
import Collapsible from "packages/dappkit/src/components/primitives/Collapsible";
import EventBlocker from "packages/dappkit/src/components/primitives/EventBlocker";
import { useWalletContext } from "packages/dappkit/src/context/Wallet.context";
import { useMemo, useState } from "react";
import useReward from "src/hooks/resources/useReward";
import { formatUnits } from "viem";
import Tag from "../Tag";
import { ClaimRewardsChainRow } from "./ClaimRewardsChainTable";
import { ClaimRewardsTokenTable } from "./ClaimRewardsTokenTable";
import ClaimRewardsTokenTableRow from "./ClaimRewardsTokenTableRow";

export type ClaimRewardsChainTableRowProps = Component<{
  from: string;
  reward: Reward;
}>;

export default function ClaimRewardsChainTableRow({
  from,
  reward,
  className,
  ...props
}: ClaimRewardsChainTableRowProps) {
  const [open, setOpen] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set<string>());

  const { address: user, chainId, switchChain } = useWalletContext();
  const isUserRewards = useMemo(() => user === from, [user, from]);
  const isAbleToClaim = useMemo(
    () => isUserRewards && !reward.rewards.every(({ amount, claimed }) => amount === claimed),
    [isUserRewards, reward],
  );
  const isOnCorrectChain = useMemo(() => reward.chain.id === chainId, [reward, chainId]);

  const { claimTransaction } = useReward(
    reward,
    !isUserRewards ? undefined : user,
    selectedTokens?.size > 0 ? selectedTokens : undefined,
  );

  const unclaimed = useMemo(() => {
    return reward.rewards.reduce(
      (sum, { amount, claimed, token: { decimals, price } }) =>
        sum + Number.parseFloat(formatUnits(amount - claimed, decimals)) * (price ?? 0),
      0,
    );
  }, [reward]);

  const renderTokenRewards = useMemo(
    () =>
      reward.rewards
        .sort((a, b) => Number(b.amount - b.claimed - (a.amount - a.claimed)))
        .map(_reward => (
          <ClaimRewardsTokenTableRow
            key={_reward.token.address}
            className="cursor-pointer [&>*>*]:cursor-auto"
            showCheckbox={isOnCorrectChain && isAbleToClaim}
            checkedState={[
              selectedTokens.has(_reward.token.address) || !selectedTokens.size,
              checked => {
                setSelectedTokens(t => {
                  if (checked) t.add(_reward.token.address);
                  else t.delete(_reward.token.address);

                  return new Set(t);
                });
              },
            ]}
            reward={_reward}
          />
        )),
    [reward, selectedTokens, isOnCorrectChain, isAbleToClaim],
  );

  return (
    <ClaimRewardsChainRow
      {...props}
      className={mergeClass("cursor-pointer [&>*>*]:cursor-auto", className)}
      onClick={() => setOpen(o => !o)}
      chainColumn={
        <>
          <Tag type="chain" value={reward.chain} />
          <Icon
            data-state={!open ? "closed" : "opened"}
            className="transition duration-150 ease-out data-[state=opened]:rotate-180"
            remix={"RiArrowDropDownLine"}
          />
          <EventBlocker>
            {isAbleToClaim &&
              (isOnCorrectChain ? (
                <TransactionButton disabled={!claimTransaction} className="ml-xl" look="hype" tx={claimTransaction}>
                  Claim
                </TransactionButton>
              ) : (
                <Button className="ml-xl" onClick={() => switchChain(reward.chain.id)}>
                  Switch Network <Icon remix="RiArrowLeftRightLine" />
                </Button>
              ))}
          </EventBlocker>
        </>
      }
      unclaimedColumn={
        unclaimed === 0 ? undefined : (
          <Value size="lg" format="$0,0.#" look="bold" className="font-title">
            {unclaimed}
          </Value>
        )
      }>
      <Collapsible state={[open, setOpen]}>
        <Space size="md" />
        {/* <List size="md" dividerClassName={() => "bg-main-8"}>{renderTokenRewards}</List> */}
        <ClaimRewardsTokenTable size="sm" dividerClassName={() => "!bg-main-8"} className="[&>*]:bg-main-4" look="soft">
          {renderTokenRewards}
        </ClaimRewardsTokenTable>
      </Collapsible>
    </ClaimRewardsChainRow>
  );
}
