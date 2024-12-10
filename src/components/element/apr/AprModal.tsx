import type { Opportunity } from "@merkl/api";
import { Divider, Group, Text, Value } from "packages/dappkit/src";
import TvlLibrary from "../tvl/TvlLibrary";
import TvlRowAllocation from "../tvl/TvlRowAllocation";
import AprLibrary from "./AprLibrary";

type IProps = {
  opportunity: Opportunity;
};

export default function AprModal(props: IProps) {
  const { opportunity } = props;

  return (
    <Group className="flex-col">
      <Group className="flex-col gap-l">
        <Group className="justify-between">
          <Text>AVERAGE APR</Text>
          <Value value format="0a%">
            {opportunity.apr / 100}
          </Value>
        </Group>
        <Divider horizontal />
        <TvlRowAllocation opportunity={opportunity} />
      </Group>
      <AprLibrary opportunity={opportunity} />
      <TvlLibrary opportunity={opportunity} />
    </Group>
  );
}
