import { api } from "../index.server";
import { fetchWithLogs } from "../utils";

export abstract class ClaimsService {
  static async #fetch<R, T extends { data: R; status: number; response: Response }>(
    call: () => Promise<T>,
    resource = "Claims",
  ): Promise<NonNullable<T["data"]>> {
    const { data, status } = await fetchWithLogs(call);

    if (status === 404) throw new Response(`${resource} not found`, { status });
    if (status === 500) throw new Response(`${resource} unavailable`, { status });
    if (data == null) throw new Response(`${resource} unavailable`, { status });
    return data;
  }

  static async getForUser(address: string) {
    return await ClaimsService.#fetch(async () => api.v4.claims({ address }).get());
  }
}
