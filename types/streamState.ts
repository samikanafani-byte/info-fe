import { BenchMarkState } from "./benchMarkState";
import { CompanyState } from "./companyState";
import { ExpertState } from "./expertState";
import { HighlyRelevantJobFunctionExpert } from "./highlyRelevantJobFunctionExpert";
import { Keywords } from "./keywords";
import { NeedsMoreInfoExpert } from "./NeedsMoreInfoExperts";
import { SearchStream } from "./searchStream";

export interface StreamState {
    stream_id: string;
    search_stream: SearchStream;
    
    keywords?: Keywords;
    matching_companies_in_db?: string[];
    company_states?: CompanyState[];
    highly_relevant_job_function_experts?: HighlyRelevantJobFunctionExpert[];
    status?: string;
    needs_more_info_experts?: NeedsMoreInfoExpert[];
    experts_state: ExpertState;
    benchmark_state?: BenchMarkState;
}

function getStatusForThoughtChainItem(status: string, stage: string): string {
    let passedStatuses: string[] = [] //determines which statuses that consider this stage as passed
    let currentStatuses: string[] = [] //determines which statuses that consider this stage as current
    switch (stage) {
        case 'decode':
            passedStatuses = [
                'companies',
                'keywords',
                'benchmarking_titles',
                'benchmarking_profiles',
                'sourcing',
                'review',
                'completed'
            ]
            currentStatuses = [
                'decode',
                'initial'
            ]
            break;
        case 'companies':
            passedStatuses = [
                'keywords',
                'benchmarking_titles',
                'benchmarking_profiles',
                'sourcing',
                'review',
                'completed'
            ]
            currentStatuses = [
                'companies'
            ]
            break;
        case 'keywords':
            passedStatuses = [
                'benchmarking_titles',
                'benchmarking_profiles',
                'sourcing',
                'review',
                'completed'
            ]
            currentStatuses = [
                'keywords'
            ]
            break;
        
        case 'benchmarking':
            passedStatuses = [
                'sourcing',
                'review',
                'completed'
            ]
            currentStatuses = [
                'benchmarking_titles',
                'benchmarking_profiles'
            ]
            break;
        case 'review':
            passedStatuses = [
                'completed'
            ]
            currentStatuses = [
                'validation',
                'sourcing',
                'review'
            ]
            break;
        case 'completed':
            passedStatuses = [
                
            ]
            currentStatuses = [
                'completed'
            ]
        default:
            passedStatuses = []
    }
    if (passedStatuses.includes(status)) {
        // Your code block here
        return "passed"
    }
    if(currentStatuses.includes(status)){
        return "current"
    }

    return "pending"
}
const getThoughtTitle = (stage: string) => {
    switch (stage) {
        case 'decode':
            return "Decode"
        case 'companies':
            return " Companies"
        case 'keywords':
            return " Keywords"
        case 'benchmarking':
            return "Benchmark"
        case 'review':
            return "Review"
        case 'completed':
            return "Completed"
        default:
            return "Unknown Stage"
    }
}
export type ChainItem = {
    title: string;
    status: string;
}
export function getChainItems(streamState: StreamState): ChainItem[] {
    // - initial
    //     - decode
    //     - companies
    //     - keywords
    //     - benchmarking_titles
    //     - benchmarking_profiles
    //     - sourcing
    //     - review
    //     - completed
    const stages = ['decode', 'companies', 'keywords', 'benchmarking', 'review', 'completed'];
    const thoughtChains = stages.map((stage) => ({
        title: getThoughtTitle(stage),
        status: getStatusForThoughtChainItem(streamState.status || 'initial', stage),
    }));
    return thoughtChains;

}


