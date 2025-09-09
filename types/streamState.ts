import { CompanyState } from "./companyState";
import { HighlyRelevantJobFunctionExpert } from "./highlyRelevantJobFunctionExpert";
import { Keywords } from "./keywords";
import { NeedsMoreInfoExpert } from "./NeedsMoreInfoExperts";
import { SearchStream } from "./searchStream";

export interface StreamState {
    stream_id: string;
    search_stream: SearchStream;
    
    keywords?: Keywords;
    matching_companies_in_db?: string[];
    company_states?: CompanyState[];
    highly_relevant_job_function_experts?: HighlyRelevantJobFunctionExpert[];
    status?: string;
    needs_more_info_experts?: NeedsMoreInfoExpert[];

}


