import type { Opportunity } from "@merkl/api";
import { Divider, Group, Modal, Title } from "packages/dappkit/src";
import type { PropsWithChildren } from "react";
import Participate from "../participate/Participate";

export type OpportunityParticipateModalProps = {
  opportunity: Opportunity;
} & PropsWithChildren;

export default function OpportunityParticipateModal({ opportunity, children }: OpportunityParticipateModalProps) {
  return (
    <Modal
      modal={
        <Group className="flex-col">
          <Group className="p-md">
            <Title h={3}>SUPPLY</Title>
          </Group>
          <Divider horizontal look="hype" />
          <Participate opportunity={opportunity} displayLinks displayOpportunity displayMode="deposit" />
        </Group>
      }>
      {children}
    </Modal>
  );
}
