export interface CompanyJobFunction {
    job_function: string
    company_name: string
}
export interface UserComment {
    user_comment: string
    timestamp: number
}
export interface JobTitleBenchmark {
    benchmark_title_id: string
    company_job_function: CompanyJobFunction
    ai_category: string
    relevance_justification: string
    user_category?: string
    user_comment?: string
    user_comments?: UserComment[]
}
export interface BenchMarkTitles {
    results: JobTitleBenchmark[]
}