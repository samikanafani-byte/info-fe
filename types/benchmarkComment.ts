import { JobTitleBenchmark } from "./benchMarkTitles"
import { RankedExpert } from "./rankedExpert"


export interface BenchmarkComment{
    benchmarkItemId: string
    userComment?: string
    oldCategory: string
    jobTitleBenchMarkItem?: JobTitleBenchmark
    ranked_expert?: RankedExpert
    newCategory: string
    timestamp: number

}