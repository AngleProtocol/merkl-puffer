import type { Campaign } from "@merkl/api";
import { useSearchParams } from "@remix-run/react";
import { Text } from "dappkit";
import { useMemo } from "react";
import type { IRewards } from "src/api/services/reward.service";
import OpportunityPagination from "../opportunity/OpportunityPagination";
import { LeaderboardTable } from "./LeaderboardTable";
import LeaderboardTableRow from "./LeaderboardTableRow";

export type IProps = {
  leaderboard: IRewards[];
  count?: number;
  campaign: Campaign;
};

export default function LeaderboardLibrary(props: IProps) {
  const { leaderboard, count, campaign } = props;
  const [searchParams] = useSearchParams();

  const items = searchParams.get("items");
  const page = searchParams.get("page");

  const rows = useMemo(() => {
    return leaderboard?.map((row, index) => (
      <LeaderboardTableRow
        key={crypto.randomUUID()}
        row={row}
        rank={index + 1 + Math.max(Number(page) - 1, 0) * Number(items)}
        campaign={campaign}
      />
    ));
  }, [leaderboard, page, items, campaign]);

  return (
    <LeaderboardTable
      header={<Text className="w-full">Leaderboard</Text>}
      footer={count !== undefined && <OpportunityPagination count={count} />}>
      {!!rows.length ? rows : <Text>No rewarded users</Text>}
    </LeaderboardTable>
  );
}
