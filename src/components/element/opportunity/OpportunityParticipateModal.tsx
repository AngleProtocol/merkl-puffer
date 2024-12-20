import type { Opportunity } from "@merkl/api";
import merklConfig from "merkl.config";
import { Divider, Group, Icon, Modal, Text, Title } from "packages/dappkit/src";
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
            <Title h={3}>SUPPLYTEST</Title>
          </Group>
          <Divider horizontal look="hype" />
          {!!merklConfig.opportunityNotification && (
            <Group className="border-1 rounded-lg p-md border-accent-8 flex-wrap items-center">
              <Text look="bold">
                <Icon remix="RiInformation2Fill" className="inline mr-md text-2xl text-accent-11" />
                {merklConfig.opportunityNotification}
              </Text>
            </Group>
          )}
          <Participate opportunity={opportunity} displayLinks displayOpportunity displayMode="deposit" />
        </Group>
      }>
      {children}
    </Modal>
  );
}
