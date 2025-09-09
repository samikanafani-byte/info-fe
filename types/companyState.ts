import { DetailedBriefDecoding } from "./detailedBriefDecoding";
import { Keywords } from "./keywords";
import { JobFunctionList } from "./jobFunctionList";
import { HighlyRelevantJobFunctionExpert } from "./highlyRelevantJobFunctionExpert";
import { NeedsMoreInfoExpert } from "./NeedsMoreInfoExperts";

export interface CompanyState {
    company_state_id: string;
    company_name: string;
    stream_summary: string;
    project_decoding?: DetailedBriefDecoding;
    keywords?: Keywords;
    job_function_list?: JobFunctionList;
    highly_relevant_job_function_experts?: HighlyRelevantJobFunctionExpert[];
    needs_more_info_experts?: NeedsMoreInfoExpert[];
}


export function createEmptyCompanyState(company_name: string, stream_summary: string, project_decoding?: DetailedBriefDecoding, keywords?: Keywords): CompanyState {
    return {
        company_state_id: crypto.randomUUID(),
        company_name,
        stream_summary,
        project_decoding,
        keywords,
    }
}