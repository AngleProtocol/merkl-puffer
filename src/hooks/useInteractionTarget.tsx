//TODO: export from api index
import type { InteractionTarget } from "@merkl/api/dist/src/modules/v4/interaction/interaction.model";
import { useEffect, useState } from "react";
import { InteractionService } from "src/api/services/interaction.service";

export default function useInteractionTargets(chainId?: number, protocolId?: string, identifier?: string) {
  const [loading, setLoading] = useState(true);
  const [targets, setTargets] = useState<InteractionTarget[] | undefined>();

  useEffect(() => {
    async function fetchTarget() {
      if (!chainId || !protocolId || !identifier) return;

      setLoading(true);

      const _targets = await InteractionService.getTargets(chainId, protocolId, identifier);

      if (_targets?.length) setTargets(_targets);
      setLoading(false);
    }

    fetchTarget();
  }, [chainId, protocolId, identifier]);

  return { targets, loading };
}
