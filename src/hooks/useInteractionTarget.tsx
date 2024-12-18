//TODO: export from api index
import type { InteractionTarget } from "@merkl/api/dist/src/modules/v4/interaction/interaction.model";
import { useEffect, useState } from "react";
import { InteractionService } from "src/api/services/interaction.service";

export default function useInteractionTarget(chainId?: number, protocolId?: string, identifier?: string) {
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<InteractionTarget | undefined>();

  useEffect(() => {
    async function fetchTarget() {
      if (!chainId || !protocolId || !identifier) return;

      setLoading(true);

      const _target = await InteractionService.getTarget(chainId, protocolId, identifier);

      if (_target) setTarget(_target);
      setLoading(false);
    }

    fetchTarget();
  }, [chainId, protocolId, identifier]);

  return { target, loading };
}
