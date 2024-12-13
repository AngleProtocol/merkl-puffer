import type { Protocol } from "@merkl/api";
import { Link } from "@remix-run/react";
import { Group, Icon } from "dappkit";
import type { BoxProps } from "dappkit";
import { Title } from "dappkit";
import { mergeClass } from "dappkit";
import type { TagTypes } from "../Tag";
import { ProtocolRow } from "./ProtocolTable";

export type ProtocolTableRowProps = {
  hideTags?: (keyof TagTypes)[];
  protocol: Protocol;
} & BoxProps;

export default function ProtocolTableRow({ hideTags, protocol, className, ...props }: ProtocolTableRowProps) {
  return (
    <Link to={`/protocols/${protocol.id}`}>
      <ProtocolRow
        size="lg"
        content="sm"
        className={mergeClass("", className)}
        {...props}
        protocolColumn={
          <Group className="py-md flex-col w-full text-nowrap whitespace-nowrap text-ellipsis">
            <Group className="text-nowrap whitespace-nowrap text-ellipsis min-w-0 flex-nowrap overflow-hidden max-w-full">
              <Title
                h={3}
                size={4}
                className="text-nowrap flex gap-lg whitespace-nowrap text-ellipsis min-w-0 overflow-hidden">
                <Icon src={protocol.icon} />
                {protocol.name}
              </Title>
            </Group>
          </Group>
        }
      />
    </Link>
  );
}
