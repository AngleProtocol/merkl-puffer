import type { Opportunity, Token } from "@merkl/api";
import type { InteractionTarget } from "@merkl/api/dist/src/modules/v4/interaction/interaction.model";
import { Button, type ButtonProps, Checkbox, Group, Text, WalletButton } from "dappkit";
import TransactionButton from "packages/dappkit/src/components/dapp/TransactionButton";
import { useWalletContext } from "packages/dappkit/src/context/Wallet.context";
import { useMemo, useState } from "react";
import useInteractionTransaction from "src/hooks/useInteractionTransaction";

export type InteractProps = {
  opportunity: Opportunity;
  target?: InteractionTarget;
  inputToken?: Token;
  tokenAddress?: string;
  amount?: bigint;
  disabled?: boolean;
};

export default function Interact({ opportunity, inputToken, amount, target, disabled }: InteractProps) {
  const { chainId, switchChain, address: user, sponsorTransactions, setSponsorTransactions } = useWalletContext();
  const {
    transaction,
    reload,
    loading: txLoading,
  } = useInteractionTransaction(opportunity.chainId, opportunity.protocol?.id, target, inputToken, amount);
  const [approvalHash, setApprovalHash] = useState<string>();

  const currentInteraction = useMemo(() => {
    let buttonProps: ButtonProps | undefined = undefined;
    const commonProps = { size: "lg", look: "hype", className: "justify-center w-full" } as const;
    const createProps: (bp: ButtonProps) => void = bp => {
      buttonProps = Object.assign(commonProps, bp ?? {});
    };

    if (disabled) createProps({ disabled: true, children: "Cannot interact" });
    else if (!amount || amount === 0n) createProps({ disabled: true, children: "Enter an amount" });
    else if (chainId !== opportunity.chainId)
      createProps({ children: `Switch to ${opportunity.chain.name}`, onClick: () => switchChain(opportunity.chainId) });
    else if (!user) return <WalletButton {...commonProps} />;
    else if (!transaction && !txLoading) createProps({ disabled: true, children: "Cannot interact" });
    else if (!transaction || txLoading) createProps({ disabled: true, children: "Loading..." });

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    if (buttonProps) return <Button {...(buttonProps as any)} />;

    if (!transaction.approved && !approvalHash)
      return (
        <TransactionButton
          onExecute={h => {
            setApprovalHash(h);
            reload();
          }}
          {...commonProps}
          tx={transaction?.approval}>
          Approve
        </TransactionButton>
      );

    if (transaction.transaction)
      return (
        <TransactionButton {...commonProps} tx={transaction?.transaction}>
          Participate
        </TransactionButton>
      );
  }, [
    chainId,
    opportunity.chainId,
    opportunity.chain,
    amount,
    transaction,
    disabled,
    approvalHash,
    switchChain,
    user,
    txLoading,
    reload,
  ]);

  const canTransactionBeSponsored = opportunity.chainId === 324;

  return (
    <>
      {canTransactionBeSponsored && (
        <Group className="justify-between w-full items-center">
          <Text>Gasless</Text>
          <Checkbox size="sm" state={[sponsorTransactions, setSponsorTransactions]} />
        </Group>
      )}
      {currentInteraction}
    </>
  );
}
