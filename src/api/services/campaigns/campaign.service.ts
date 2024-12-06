import type { Campaign } from "@merkl/api";
import { api } from "../../index.server";

export abstract class CampaignService {
  /**
   * Retrieves opportunities query params from page request
   * @param request request containing query params such as chains, status, pagination...
   * @param override params for which to override value
   * @returns query
   */
  static #getQueryFromRequest(
    request: Request,
    override?: Parameters<typeof api.v4.opportunities.index.get>[0]["query"],
  ) {
    const status = new URL(request.url).searchParams.get("status");
    const action = new URL(request.url).searchParams.get("action");
    const chainId = new URL(request.url).searchParams.get("chain");
    const page = new URL(request.url).searchParams.get("page");

    const items = new URL(request.url).searchParams.get("items");
    const search = new URL(request.url).searchParams.get("search");
    const [sort, order] = new URL(request.url).searchParams.get("sort")?.split("-") ?? [];

    const filters = Object.assign(
      { status, action, chainId, items, sort, order, name: search, page },
      override ?? {},
      page !== null && { page: Number(page) - 1 },
    );

    const query = Object.entries(filters).reduce(
      (_query, [key, filter]) => Object.assign(_query, filter == null ? {} : { [key]: filter }),
      {},
    );

    return query;
  }

  // ------ Fetch all campaigns
  static async get() {
    const { data } = await api.v4.campaigns.index.get({ query: {} });

    return data;
  }

  static async getByParams(query: Parameters<typeof api.v4.campaigns.index.get>[0]["query"]) {
    const { data } = await api.v4.campaigns.index.get({ query });
    return data;
  }

  // ------ Fetch a campaign by ID
  static async getByID(_Id: string): Promise<Campaign | null> {
    return null;
  }
}
