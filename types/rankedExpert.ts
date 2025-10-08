export interface UserComment {
    user_comment: string
    timestamp: number
}

export interface RankedExpert{
    expert_id: number
    category: string
    relevance_justification: string
    user_comment: string
    latest_job_function: string
    latest_company_name?: string
    user_comments?: UserComment[]
}
export interface RankedExperts{
    results: RankedExpert[] | undefined
}