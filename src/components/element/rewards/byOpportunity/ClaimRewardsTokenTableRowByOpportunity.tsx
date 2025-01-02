import type { Reward } from "@merkl/api";
import { Button, type Component, Divider, type GetSet } from "dappkit";
import OpportuntiyButton from "../../opportunity/OpportunityButton";
import OpportunityParticipateModal from "../../opportunity/OpportunityParticipateModal";
import Token from "../../token/Token";
import { ClaimRewardsByOpportunityRow } from "./ClaimRewardsTableByOpportunity";

export type ClaimRewardsTokenTableRowProps = Component<{
  breakdown: Reward["rewards"][number]["breakdowns"][number];
  token: Reward["rewards"][number]["token"];
  checkedState?: GetSet<boolean>;
  showCheckbox?: boolean;
  from: string;
  distributor: string;
}>;

export default function ClaimRewardsTokenTableRowByOpportunity({
  breakdown,
  token,
  checkedState,
  showCheckbox,
  from,
  distributor,
  ...props
}: ClaimRewardsTokenTableRowProps) {
  const unclaimed = breakdown.amount - breakdown.claimed;
  return (
    <>
      <Divider look="soft" />
      <ClaimRewardsByOpportunityRow
        {...props}
        key={breakdown.amount}
        positionsColumn={<OpportuntiyButton opportunity={breakdown.opportunity} />}
        // actionColumn={
        //   !!breakdown.opportunity?.action && <Tag type="action" value={breakdown.opportunity?.action} size="xs" />
        // }
        claimedColumn={<Token token={token} amount={breakdown.claimed} format="amount_price" />}
        unclaimedColumn={
          !!unclaimed && <Token token={token} amount={breakdown.amount - breakdown.claimed} format="amount_price" />
        }
        buttonColumn={
          <OpportunityParticipateModal opportunity={breakdown.opportunity}>
            <Button look="hype" size="sm">
              Supply
            </Button>
          </OpportunityParticipateModal>
        }
      />
    </>
  );
}
