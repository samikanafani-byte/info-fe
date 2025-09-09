import { Company } from "./company"
import { DetailedBriefDecoding } from "./detailedBriefDecoding"


export interface SearchStream{
    stream_id: string
    stream_name: string
    stream_rationale: string
    stream_summary: string
    screening_questions: string
    detailed_brief_decoding: DetailedBriefDecoding
    companies: Company[]
}