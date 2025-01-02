import { Group, Icon, Select, type SelectProps, Text, Title, Value } from "packages/dappkit/src";
import { Fmt } from "packages/dappkit/src/utils/formatter.service";
import { useMemo } from "react";
import Token from "./Token";

export type TokenSelectProps = {
  tokens: (Token & { balance: bigint })[];
  balances?: boolean;
} & SelectProps<string>;

export default function TokenSelect({ tokens, balances, ...props }: TokenSelectProps) {
  const options = useMemo(
    () =>
      tokens?.reduce(
        (obj, token) =>
          Object.assign(obj, {
            [token.address]: <Token key={token.address} value token={token} />,
          }),
        {},
      ) ?? {},
    [tokens],
  );

  const searchOptions = useMemo(
    () =>
      tokens?.reduce(
        (obj, token) =>
          Object.assign(obj, {
            [token.address]: `${token.symbol}-${token.name}-${token.address}`,
          }),
        {},
      ) ?? {},
    [tokens],
  );

  const displayOptions = useMemo(
    () =>
      tokens?.reduce(
        (obj, token) =>
          Object.assign(obj, {
            [token.address]: (
              <Group size="xl" className="w-full justify-between items-center gap-xl*2">
                <Group className="flex-grow items-center">
                  <Title h={3}>
                    <Icon size="lg" src={token.icon} />
                  </Title>
                  <Group className="flex-col !gap-0">
                    <Text look="bold" bold>
                      {token.name}
                    </Text>
                    <Text look="soft" className="flex gap-sm">
                      {token.symbol} - <Value format="$0,0.#a">{Fmt.toPrice(token.balance, token)}</Value> -{" "}
                      <Value format="0,0.###a">{Fmt.toNumber(token.balance, token.decimals)}</Value>{" "}
                    </Text>
                  </Group>
                </Group>
              </Group>
            ),
          }),
        {},
      ) ?? {},
    [tokens],
  );

  return (
    <Select
      search
      placeholder="Select token"
      options={options}
      searchOptions={searchOptions}
      displayOptions={displayOptions}
      {...props}
    />
  );
}
