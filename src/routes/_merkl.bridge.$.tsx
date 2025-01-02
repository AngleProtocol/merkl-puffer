import type { MetaFunction } from "@remix-run/node";
import config from "merkl.config";
import { Button, Group, Icon, Space, Text } from "packages/dappkit/src";
import { ClientOnly } from "remix-utils/client-only";
import { I18n } from "src/I18n";
import { LiFiWidget } from "src/components/composite/LiFiWidget";

export const meta: MetaFunction = () => {
  return [{ title: "Merkl" }];
};

export default function Index() {
  return (
    <>
      {!!I18n.trad.get.pages.bridge.helper && (
        <Group className="border-1 rounded-lg p-md border-accent-8 flex-wrap items-center">
          <Text look="bold">
            <Icon remix="RiInformation2Fill" className="inline mr-md text-2xl text-accent-11" />
            {I18n.trad.get.pages.bridge.helper}
          </Text>
          {!!config.bridge.helperLink && (
            <Button to={config.bridge.helperLink} external look="tint">
              Bridge now
            </Button>
          )}
        </Group>
      )}
      <Space size="xl" />
      <ClientOnly>{() => <LiFiWidget />}</ClientOnly>
    </>
  );
}
