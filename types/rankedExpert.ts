
export interface RankedExpert{
    expert_id: number
    category: string
    relevance_justification: string
    user_comment?: string
    latest_job_function?: string
    latest_company_name?: string
}
export interface RankedExperts{
    results: RankedExpert[] | undefined
}