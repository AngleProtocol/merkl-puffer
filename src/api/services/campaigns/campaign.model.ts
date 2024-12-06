import type { Campaign as CampaignFromApi } from "@merkl/api";
import type { Fetched } from "src/api/types";

export type Campaign<C extends CampaignFromApi["type"] = CampaignFromApi["type"]> = Fetched<CampaignFromApi<C>>;
