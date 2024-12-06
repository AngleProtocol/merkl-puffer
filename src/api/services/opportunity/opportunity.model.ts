import type { Opportunity as OpportunityFromApi } from "@merkl/api";
import type { Fetched } from "src/api/types";
import type { Campaign } from "../campaigns/campaign.model";

export type Opportunity = Fetched<OpportunityFromApi>;
export type OpportunityWithCampaigns = Fetched<OpportunityFromApi & { campaigns: Campaign[] }>;
