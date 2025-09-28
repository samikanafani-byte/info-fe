export interface CompanyJobFunction {
    job_function: string
    company_name: string
}

export interface JobTitleBenchmark {
    benchmark_title_id: string
    company_job_function: CompanyJobFunction
    ai_category: string
    relevance_justification: string
    user_category?: string
    user_comment?: string
}
export interface BenchMarkTitles {
    results: JobTitleBenchmark[]
}