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

function capitalizeFirstLetter(str: string): string {
    
    const words = str.trim().split(/\s+/);
    const capitalizedWords = words.map(word => {
        if (!word) return ''; 
        const lowerWord = word.toLowerCase();
        return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
    });

    
    return capitalizedWords.join(' ');
}
export function isAIProcessing(streamState: StreamState, stateToCheck: string): boolean {
    const allExpertsLength = (streamState.experts_state?.highly_relevant_job_function_experts?.length ?? 0) + (streamState.experts_state?.needs_more_info_experts?.length ?? 0)
    if(stateToCheck !="benchmarking"){
        if (streamState.status != stateToCheck) {
            return false
        }
    }else{
        if (streamState.status != "benchmarking_titles" && streamState.status != "benchmarking_profiles") {
            return false
        }
    }

    switch (stateToCheck) {
        case "initial":
            return false
        case "decode":
            // check if the search stream is not null
            return streamState.search_stream ==null 
        case "companies":
            return (!streamState.matching_companies_in_db || streamState.matching_companies_in_db.length === 0)
        case "keywords":
            return (!streamState.keywords || !streamState.keywords.list_of_keywords || streamState.keywords.list_of_keywords.length === 0)
        case "benchmarking":
            if(streamState.status == "benchmarking_titles"){
                return (!streamState.benchmark_state || !streamState.benchmark_state.benchmark_titles || !streamState.benchmark_state.benchmark_titles.results || streamState.benchmark_state.benchmark_titles.results.length === 0)
            }else{
                return (!streamState.benchmark_state || !streamState.benchmark_state.benchmark_titles || !streamState.benchmark_state.benchmark_titles.results || streamState.benchmark_state.benchmark_titles.results.length === 0)
            }
        case "sourcing":
            return (!streamState.experts_state || allExpertsLength === 0)
        case "review":
            return (!streamState.experts_state || allExpertsLength === 0)
        case "completed":
            return (!streamState.experts_state || allExpertsLength === 0)
        default:
            return false
    }
    
}
export function getMatchingCompaniesFiltered(streamState: StreamState): string[] {

    const uniqueCompaniesMap = new Map<string, string>();

    (streamState.matching_companies_in_db || []).forEach(companyName => {
        if (!companyName) return; 

        const lowerCaseName = companyName.toLowerCase();

        
        if (!uniqueCompaniesMap.has(lowerCaseName)) {
            
            const capitalizedName = capitalizeFirstLetter(companyName);
            uniqueCompaniesMap.set(lowerCaseName, capitalizedName);
        }
    });

    return Array.from(uniqueCompaniesMap.values());
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
export const getThoughtTitle = (stage: string) => {
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
export const getStreamTextTitle = (streamState: StreamState) => {
    switch (streamState.status) {
        case 'initial':
            return "You are about to start your project"
        case 'decode':
            return "AI Decoding your brief"
        case 'companies':
            const ai_check = isAIProcessing(streamState, 'companies')
            if(ai_check){
                return "AI Finding Companies"
            }
            return "Companies pending your review"
        case 'keywords':
            const ai_check_keywords = isAIProcessing(streamState, 'keywords')
            if(ai_check_keywords){
                return "AI Generating Keywords"
            }
            return "Keywords pending your review"
        case 'benchmarking_titles':
            const ai_check_benchmarking_titles = isAIProcessing(streamState, 'benchmarking')
            if(ai_check_benchmarking_titles){
                return "AI Benchmarking Titles"
            }
            return "Benchmark Titles pending your review"
        case 'benchmarking_profiles':
            const ai_check_benchmarking_profiles = isAIProcessing(streamState, 'benchmarking')
            if(ai_check_benchmarking_profiles){
                return "AI Benchmarking Profiles"
            }
            return "Benchmark Profiles pending your review"
        case 'sourcing':
            const ai_check_sourcing = isAIProcessing(streamState, 'sourcing')
            if(ai_check_sourcing){
                return "AI Sourcing Experts"
            }
            return "Experts pending your review"
        case 'review':
            const ai_check_review = isAIProcessing(streamState, 'review')
            if(ai_check_review){
                return "AI Reviewing Experts"
            }
            return "Experts pending your review"
        case 'completed':
            return "Stream Completed"
        default:
            return "Stream Status Unknown"
    }
}


export type ChainItem = {
    key: string;
    title: string;
    status: string;
}
export function getChainItems(streamState: StreamState): ChainItem[] {
    
    const stages = ['decode', 'companies', 'keywords', 'benchmarking', 'review'];
    const thoughtChains = stages.map((stage) => ({
        key: stage,
        title: getThoughtTitle(stage),
        status: getStatusForThoughtChainItem(streamState.status || 'initial', stage),
    }));
    return thoughtChains;

}


