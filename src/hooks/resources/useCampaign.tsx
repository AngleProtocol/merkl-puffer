import type { Campaign, Opportunity } from "@merkl/api";
import { Bar } from "dappkit";
import moment from "moment";
import { Group, Text, Value } from "packages/dappkit/src";
import Time from "packages/dappkit/src/components/primitives/Time";
import { type ReactNode, useMemo } from "react";
import { formatUnits, parseUnits } from "viem";

export default function useCampaign(campaign?: Campaign) {
  if (!campaign)
    return {
      amount: undefined,
      time: undefined,
      profile: undefined,
      dailyRewards: undefined,
      progressBar: undefined,
      active: undefined,
    };

  // ─── Campaign Amount Prices ──────────────────────────────────

  const amount = useMemo(() => {
    return parseUnits(campaign.amount, 0);
  }, [campaign?.amount]);

  const dailyRewards = useMemo(() => {
    const duration = campaign.endTimestamp - campaign.startTimestamp;
    const oneDayInSeconds = BigInt(3600 * 24);
    const dayspan = BigInt(duration) / BigInt(oneDayInSeconds) || BigInt(1);
    const amountInUnits = parseUnits(amount.toString(), 0);
    const dailyReward = amountInUnits / dayspan;

    return dailyReward;
  }, [campaign, amount]);

  const dailyRewardsUsd = useMemo(() => {
    return formatUnits(
      parseUnits(dailyRewards.toString(), 0) * parseUnits(campaign.rewardToken.price?.toString() ?? "0", 18),
      18,
    );
  }, [campaign, dailyRewards]);

  // ─── Campaign Amount Time displaying ──────────────────────────────────

  const time = useMemo(() => {
    return <Time timestamp={Number(campaign.endTimestamp) * 1000} />;
  }, [campaign.endTimestamp]);

  const profile = useMemo(() => {
    type ProfileReducer = {
      [C in Opportunity["type"]]?: (_campaign: Campaign<C>) => ReactNode;
    };

    const reducer: ProfileReducer = {
      CLAMM: ({ params }) => {
        return (
          <Group size="xl" className="flex-nowrap [&>*]:flex-col [&>*]:justify-center">
            {[
              { label: "Fees", value: params.weightFees / 10000 },
              {
                label: params.symbolToken0,
                value: params.weightToken0 / 10000,
              },
              {
                label: params.symbolToken1,
                value: params.weightToken1 / 10000,
              },
            ].map(({ label, value }) => {
              return (
                <Group key={`${label}:${value}`} size="sm" className="justify-center gap-0">
                  <Text size="sm">{label}</Text>
                  <Value className="text-main-12 text-center" format="0a%">
                    {value}
                  </Value>
                </Group>
              );
            })}
          </Group>
        );
      },
    };
    return reducer[campaign.type]?.(campaign);
  }, [campaign]);

  const progressBar = useMemo(() => {
    const now = moment.now() / 1000;
    const duration = Number(campaign.endTimestamp - campaign.startTimestamp);
    const elapsed = now - Number(campaign.startTimestamp);
    const isThisYear = (ts: number) => moment.unix(ts).year() === moment().year();
    const startsThisYear = isThisYear(Number(campaign.startTimestamp));
    const endsThisYear = isThisYear(Number(campaign.startTimestamp));
    const ended = now >= campaign.endTimestamp;
    const started = now >= campaign.startTimestamp;

    return (
      <Group className="w-full items-center">
        <Text size="sm">
          {started ? "started" : "starts"}{" "}
          {moment(Number(campaign.startTimestamp) * 1000)
            .local()
            .format(startsThisYear ? "DD MMM" : "DD MMM YYYY")}
        </Text>
        <Bar
          className="grow"
          accent={"good"}
          total={duration}
          values={[{ value: elapsed, className: ended ? "bg-main-6" : "bg-accent-10" }]}
        />
        <Text size="sm">
          {ended ? "ended" : "ends"}{" "}
          {moment(Number(campaign.endTimestamp) * 1000)
            .local()
            .format(endsThisYear ? "DD MMM" : "DD MMM YYYY ha")}
        </Text>
      </Group>
    );
  }, [campaign.startTimestamp, campaign.endTimestamp]);

  const active = useMemo(() => {
    return Number(campaign.endTimestamp) > moment().unix();
  }, [campaign.endTimestamp]);

  return {
    amount,
    dailyRewards,
    dailyRewardsUsd,
    time,
    profile,
    progressBar,
    active,
  };
}
