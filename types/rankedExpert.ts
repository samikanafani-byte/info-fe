
export interface RankedExpert{
    expert_id: number
    category: string
    relevance_justification: string
}
export interface RankedExperts{
    results: RankedExpert[]
}