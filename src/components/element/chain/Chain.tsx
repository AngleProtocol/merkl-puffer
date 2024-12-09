import { Button, Dropdown, Icon, type Size } from "packages/dappkit/src";

export type ChainProps = {
  chain: ChainType;
  size?: Size;
};

export default function Chain({ chain, size }: ChainProps) {
  return (
    <Dropdown>
      <Button look="soft" size={size}>
        <Icon size={size} src={chain?.icon} />
        {chain?.name}
      </Button>
    </Dropdown>
  );
}
