import { useNavigate } from "@remix-run/react";
import { Button, Group, Icon, Input } from "packages/dappkit/src";
import { useState } from "react";

export default function AddressEdit() {
  const navigate = useNavigate();
  const [inputAddress, setInputAddress] = useState<string>();
  const [_isEditingAddress, setIsEditingAddress] = useState(false);

  return (
    <Group size="sm">
      <Input state={[inputAddress, setInputAddress]} look="bold" aria-label="Enter address" size="xs" />
      <Button
        onClick={() => (inputAddress ? navigate(`/users/${inputAddress}`) : setIsEditingAddress(false))}
        size="sm"
        look="soft"
        aria-label="Submit address">
        <Icon remix="RiCornerDownRightLine" />
      </Button>
    </Group>
  );
}
