import { Dropdown, Group, Hash, PrimitiveTag, Value } from "packages/dappkit/src";
import type { ReactNode } from "react";

export type AddressListRuleProps = { value: { label: ReactNode; addresses: string[] } };

export default function AddressListRule({ value: { label, addresses }, ...props }: AddressListRuleProps) {
  return (
    <Dropdown
      size="lg"
      padding="xs"
      content={
        <Group className="flex-col">
          {addresses.map(a => (
            <Hash copy key={a} format="short">
              {a}
            </Hash>
          ))}
        </Group>
      }>
      <PrimitiveTag look="soft" {...props}>
        {label}
        <Value format="0">{addresses?.length}</Value>
      </PrimitiveTag>
    </Dropdown>
  );
}
