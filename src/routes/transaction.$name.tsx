import type { ActionFunctionArgs } from "@remix-run/node";
import { api } from "src/api/index.server";
import { ZyfiService } from "src/api/services/zyfi.service";

export const action = async ({ params: { name }, request }: ActionFunctionArgs) => {
  const payload = await request.json();

  switch (name) {
    case "supply": {
      try {
        const { data: tx } = await api.v4.interaction.transaction.get({
          query: payload,
        });

        if (!tx) return new Response(tx, { status: 500 });

        if (payload.sponsor && !tx.approved) {
          tx.approval = await ZyfiService.wrapAndPrepareTx({
            ...tx.approval,
            from: payload.userAddress,
          });
        } else if (payload.sponsor) {
          tx.transaction = await ZyfiService.wrapAndPrepareTx({
            ...tx.transaction,
            from: payload.userAddress,
          });
        }

        return tx;
      } catch {
        return new Response("An error occured", { status: 500 });
      }
    }
  }
};
