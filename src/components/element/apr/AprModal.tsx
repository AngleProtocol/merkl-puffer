import type { Opportunity } from "@merkl/api";
import { Group, PrimitiveTag, Title, Value } from "packages/dappkit/src";
import TvlRowAllocation from "../tvl/TvlRowAllocation";
import TvlSection from "../tvl/TvlSection";
import AprSection from "./AprSection";

type IProps = {
  opportunity: Opportunity;
};

export default function AprModal(props: IProps) {
  const { opportunity } = props;

  return (
    <>
      <Group className="flex-col -my-md">
        <Group className="justify-between items-center">
          <Title look="soft" h={5}>
            AVERAGE APR
          </Title>
          <PrimitiveTag noClick look="bold" size="lg">
            <Value value format="0a%">
              {opportunity.apr / 100}
            </Value>
          </PrimitiveTag>
        </Group>
        <TvlRowAllocation opportunity={opportunity} />
        <AprSection opportunity={opportunity} />
        <TvlSection opportunity={opportunity} />
      </Group>
    </>
  );
}
