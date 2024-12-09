import type { Campaign } from "@merkl/api";
import { Button, Dropdown } from "packages/dappkit/src";

type IProps = {
  campaign: Campaign;
};

export default function RestrictionsCollumn(props: IProps) {
  const { campaign } = props;

  const hasWhitelist = campaign.params.whitelist.length > 0;
  const hasBlacklist = campaign.params.blacklist.length > 0;

  return (
    <Dropdown content={null}>
      {hasWhitelist && (
        <Button look="soft" size="xs">
          Whitelist
        </Button>
      )}

      {hasBlacklist && (
        <Button look="soft" size="xs">
          Blacklist
        </Button>
      )}
    </Dropdown>
  );
}
