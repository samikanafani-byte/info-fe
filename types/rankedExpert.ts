
export interface RankedExpert{
    expert_id: number
    category: string
    relevance_justification: string
    user_comment?: string
}
export interface RankedExperts{
    results: RankedExpert[] | undefined
}