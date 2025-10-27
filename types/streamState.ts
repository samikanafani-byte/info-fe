import { PageTitle } from "@/app/[project_id]/store/mainPageStore";
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
    running_stages: string[];
    completed_stages: string[];
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
    const running = streamState.running_stages || []
    const completed = streamState.completed_stages || []

    if (running.includes(stateToCheck) && !completed.includes(stateToCheck)) {
        return true
    }
    return false
    
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


function getStatusForThoughtChainItem(stream_state: StreamState, stage: string): string {
    const running = stream_state.running_stages || []
    const completed = stream_state.completed_stages || []

    if (completed.includes(stage)) {
        return "passed"
    }
    if (running.includes(stage)) {
        return "current"
    }
    return "pending"
}
export function canSelectPage(streamState: StreamState, page: string): boolean {
    const runningStatus = getStatusForThoughtChainItem(streamState, page)
    return runningStatus === "passed" || runningStatus === "current"
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
        case "benchmarking_titles":
            return "Benchmark Titles"
        case "benchmarking_profiles":
            return "Benchmark Profiles"
        case 'sourcing':
            return "Review"
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
    key: PageTitle;
    title: string;
    status: string;
}
export function getChainItems(streamState: StreamState): ChainItem[] {

    // const pageTitles: PageTitle[] = ["decode", "companies", "keywords", "benchmarking_titles", "benchmarking_profiles", "sourcing"];
    const pageTitles: PageTitle[] = ["decode", "companies", "keywords", "benchmarking_titles", "sourcing"];
    const thoughtChains = pageTitles.map((stage) => ({
        key: stage,
        title: getThoughtTitle(stage),
        status: getStatusForThoughtChainItem(streamState || 'initial', stage),
    }));
    return thoughtChains;

}


