import type { Token } from "@merkl/api";
import { Button, Divider, Group, Hash, Icon, Text, Title } from "packages/dappkit/src";

export type TokenTooltipProps = {
  token: Token;
};

export default function TokenTooltip({ token }: TokenTooltipProps) {
  return (
    <>
      <Group size="xs" className="flex-col">
        <Group className="justify-between">
          <Text size="xs">Token</Text>
          <Hash format="short" size="xs">
            {token.address}
          </Hash>
        </Group>
        <Group size="sm">
          <Icon size={"sm"} src={token.icon} />
          <Title h={4} size={"lg"}>
            {token?.name}
          </Title>
        </Group>
      </Group>
      <Divider look="soft" horizontal />
      {/* <Text size="xs">{token?.description}</Text> */}
      <Group className="flex-col" size="sm">
        <Button to={`/token/${token?.symbol}`} size="sm" look="bold">
          {token?.symbol} on Merkl
        </Button>
        <Button size="sm" look="bold">
          {token?.symbol} on Etherscan
        </Button>
      </Group>
    </>
  );
}
