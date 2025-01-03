import { type ActionFunctionArgs, json } from "@remix-run/node";
import { api } from "src/api/index.server";
import { ZyfiService } from "src/api/services/zyfi.service";
import { encodeFunctionData, parseAbi } from "viem";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const action = async ({ params: { name }, request }: ActionFunctionArgs) => {
  const payload = await request.json();

  switch (name) {
    case "claim": {
      const abi = parseAbi(["function claim(address[],address[],uint256[],bytes32[][]) view returns (uint256)"]);

      return json({
        to: payload.distributor,
        data: encodeFunctionData({
          abi,
          functionName: "claim",
          args: payload.args,
        }),
      });
    }
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

        return json(tx);
      } catch (_err) {
        console.error(_err);

        return new Response("An error occured", { status: 500 });
      }
    }
  }
};
