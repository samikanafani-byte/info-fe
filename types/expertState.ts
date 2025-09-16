import { Expert } from "@/lib/data"
import { DetailedBriefDecoding } from "./detailedBriefDecoding"
import { HighlyRelevantJobFunctionExpert } from "./highlyRelevantJobFunctionExpert"
import { Keywords } from "./keywords"
import { NeedsMoreInfoExpert } from "./NeedsMoreInfoExperts"
import { RankedExpert, RankedExperts } from "./rankedExpert"

export interface ExpertState{
    expert_state_id: number
    needs_more_info_experts: NeedsMoreInfoExpert[]
    highly_relevant_job_function_experts: HighlyRelevantJobFunctionExpert[]
    project_decoding: DetailedBriefDecoding
    keywords: Keywords
    stream_summary: string
    ranked_experts: RankedExperts
}


export function convertHighlyRelevantJobFunctionExpertToExpert(input: HighlyRelevantJobFunctionExpert): Expert {
    return {
        id: `${input.expert_id}`,
        name: input.expert_id.toString(), // Placeholder, replace with actual name if available
        company: input.company_name,
        reasoningSummary: input.relevance_justification,
        title: input.job_function,
        score: "Highly Relevant", // Placeholder, replace with actual score if available
    }
}

export function convertRankedExpertsToExpert(input: RankedExpert): Expert {
    return {
        id: `${input.expert_id}`,
        name: input.expert_id.toString(), // Placeholder, replace with actual name if available
        company: "Matched based on profile", // Placeholder, replace with actual company if available
        reasoningSummary: input.relevance_justification,
        title: "Matched based on profile",
        score: input.category
    }
}