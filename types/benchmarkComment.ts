import { JobTitleBenchmark } from "./benchMarkTitles"


export interface BenchmarkComment{
    benchmarkItemId: string
    userComment?: string
    oldCategory: string
    jobTitleBenchMarkItem?: JobTitleBenchmark
    newCategory: string
    timestamp: number

}