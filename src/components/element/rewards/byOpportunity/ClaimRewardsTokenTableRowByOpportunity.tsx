import type { Reward } from "@merkl/api";
import { Button, type Component, Divider, type GetSet, Group } from "dappkit";
import OpportuntiyButton from "../../opportunity/OpportunityButton";
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
        claimedColumn={<Token token={token} amount={breakdown.claimed} format="amount_price" size="xs" />}
        unclaimedColumn={
          !!unclaimed && (
            <Token token={token} amount={breakdown.amount - breakdown.claimed} format="amount_price" size="xs" />
          )
        }
        buttonColumn={
          <Group size="sm">
            <Button look="hype" size="sm">
              Supply
            </Button>
            <Button look="base" size="sm">
              Withdraw
            </Button>
          </Group>
        }
      />
    </>
  );
}
