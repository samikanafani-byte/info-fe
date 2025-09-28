import { Expert } from "@/lib/data"
import { Keywords } from "./keywords"
import { SearchStream } from "./searchStream"
import { RankedExperts } from "./rankedExpert"
import { BenchMarkTitles } from "./benchMarkTitles"

export interface BenchMarkState {
    benchmark_state_id?: string
    matching_companies_in_db?: string []
    keywords?: Keywords
    search_stream?: SearchStream
    status?: string 
    benchmark_titles?: BenchMarkTitles 
    expert_rank_list?: RankedExperts | undefined
}