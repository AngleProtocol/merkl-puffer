import { api as clientApi } from "src/api/index.client";
import { fetchWithLogs } from "../utils";

export abstract class InteractionService {
  static async #fetch<R, T extends { data: R; status: number; response: Response }>(
    call: () => Promise<T>,
    resource = "Chain",
  ): Promise<NonNullable<T["data"]>> {
    const { data, status } = await fetchWithLogs(call);

    if (status === 404) throw new Response(`${resource} not found`, { status });
    if (status === 500) throw new Response(`${resource} unavailable`, { status });
    if (data == null) throw new Response(`${resource} unavailable`, { status });
    return data;
  }

  /**
   * Client side
   * @param chainId
   * @param protocolId
   * @param identifier
   */
  static async getTarget(chainId: number, protocolId: string, identifier: string) {
    const targets = await InteractionService.#fetch(() =>
      clientApi.v4.interaction.targets.get({
        query: { chainId, protocolId, identifier },
      }),
    );

    //TODO: opportunity/:id/target instead of taking the first result and expecting unique
    return targets?.[0];
  }

  /**
   * Client side
   */
  static async getTransaction(payload: Parameters<typeof clientApi.v4.interaction.transaction.get>[0]["query"]) {
    const transaction = await InteractionService.#fetch(() =>
      clientApi.v4.interaction.transaction.get({
        query: payload,
      }),
    );

    return transaction;
  }

  static async getBalances(chainId: number, address: string) {
    const tokens = await InteractionService.#fetch(() =>
      clientApi.v4.tokens.balances.get({
        query: { chainId: chainId, userAddress: address },
      }),
    );

    return tokens;
  }
}
