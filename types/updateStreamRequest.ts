import { Keywords } from "./keywords";

export interface UpdateStreamRequest {
    matching_companies_in_db?: string[];
    keywords?: Keywords   
}