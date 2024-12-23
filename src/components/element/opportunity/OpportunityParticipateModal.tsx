import type { Opportunity } from "@merkl/api";
import { Divider, Group, Icon, Modal, Text, Title } from "packages/dappkit/src";
import type { PropsWithChildren } from "react";
import { I18n } from "src/I18n";
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
          {!!I18n.trad.get.pages.home.depositInformation && (
            <Group className="border-1 rounded-lg p-md border-accent-8 flex-wrap items-center">
              <Text look="bold">
                <Icon remix="RiInformation2Fill" className="inline mr-md text-2xl text-accent-11" />
                {I18n.trad.get.pages.home.depositInformation}
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
