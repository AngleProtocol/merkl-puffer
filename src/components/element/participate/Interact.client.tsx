import type { Opportunity, Token } from "@merkl/api";
import type { InteractionTarget } from "@merkl/api/dist/src/modules/v4/interaction/interaction.model";
import { Button, type ButtonProps } from "dappkit";
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
  const { chainId, switchChain } = useWalletContext();
  const { transaction } = useInteractionTransaction(
    opportunity.chainId,
    opportunity.protocol?.id,
    target,
    inputToken,
    amount,
  );
  const [approvalHash, setApprovalHash] = useState<string>();

  const currentInteraction = useMemo(() => {
    const buttonProps: ButtonProps = { size: "lg", look: "hype", className: "justify-center w-full" };

    if (disabled)
      return (
        <Button {...buttonProps} disabled>
          Cannot interact
        </Button>
      );
    if (!transaction)
      return (
        <Button {...buttonProps} disabled>
          Loading...
        </Button>
      );
    if (chainId !== opportunity.chainId)
      return (
        <Button {...buttonProps} onClick={() => switchChain(opportunity.chainId)}>
          Switch Chain
        </Button>
      );

    if (!transaction.approved || approvalHash)
      return (
        <TransactionButton onExecute={setApprovalHash} {...buttonProps} tx={transaction?.approval}>
          Approve
        </TransactionButton>
      );

    if (transaction.transaction)
      return (
        <TransactionButton {...buttonProps} tx={transaction?.transaction}>
          Participate
        </TransactionButton>
      );
  }, [chainId, opportunity.chainId, transaction, disabled, approvalHash, switchChain]);

  return currentInteraction;
}
