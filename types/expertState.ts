import { DetailedBriefDecoding } from "./detailedBriefDecoding"
import { HighlyRelevantJobFunctionExpert } from "./highlyRelevantJobFunctionExpert"
import { Keywords } from "./keywords"
import { NeedsMoreInfoExpert } from "./NeedsMoreInfoExperts"
import { RankedExpert } from "./rankedExpert"

export interface ExpertState{
    expert_state_id: number
    needs_more_info_experts: NeedsMoreInfoExpert[]
    highly_relevant_job_function_experts: HighlyRelevantJobFunctionExpert[]
    project_decoding: DetailedBriefDecoding
    keywords: Keywords
    stream_summary: string
    ranked_experts: RankedExpert
}