import { JobTitleBenchmark } from "@/types/benchMarkTitles";
import { HighlyRelevantJobFunctionExpert } from "@/types/highlyRelevantJobFunctionExpert";
import { KeywordItem, Keywords } from "@/types/keywords";
import { ProjectState } from "@/types/project";
import { RankedExpert } from "@/types/rankedExpert";

export interface ProjectCreatedEvent {
    event_type: "project_created";
    project_state: ProjectState; // Assuming serialize_project_state returns a ProjectState dict
    session_id: string;
}

/** Corresponds to KeywordAddedEvent */
export interface KeywordAddedEvent {
    event_type: "keyword_added";
    keywords: KeywordItem[]; 
    stream_id: string;
}

/** Corresponds to CompanyAddedEvent */
export interface CompanyAddedEvent {
    event_type: "company_added";
    matching_companies: string[]; // Corresponds to self.matching_companies_in_db (list[str])
    stream_id: string;
}

/** Corresponds to OnBenchMarkTitleItemsAdded */
export interface OnBenchmarkTitleItemsAddedEvent {
    event_type: "benchmark_title_items_added";
    benchmark_title_items: JobTitleBenchmark[];
    stream_id: string;
}

/** Corresponds to OnBenchmarkExpertRankItemsAdded */
export interface OnBenchmarkExpertRankItemsAddedEvent {
    event_type: "benchmark_expert_rank_items_added";
    benchmark_expert_rank_items: RankedExpert[]; // Corresponds to a list of dicts from model_dump()
    stream_id: string;
}

/** Corresponds to OnHighlyRelevantJobFunctionExpertsAdded */
export interface OnHighlyRelevantJobFunctionExpertsAddedEvent {
    event_type: "highly_relevant_job_function_experts_added";
    highly_relevant_experts: HighlyRelevantJobFunctionExpert[]; // Corresponds to a list of dicts from model_dump()
    stream_id: string;
}

/** Corresponds to OnRankedExpertsAdded */
export interface OnRankedExpertsAddedEvent {
    event_type: "ranked_experts_added";
    expert_ranks: RankedExpert[]; // Corresponds to a list of dicts from model_dump()
    stream_id: string;
}

/** Corresponds to RunningStageStartedEvent */
export interface RunningStageStartedEvent {
    event_type: "running_stage_started";
    stage_name: string;
    stream_id: string;
}

/** Corresponds to RunningStageCompletedEvent */
export interface RunningStageCompletedEvent {
    event_type: "running_stage_completed";
    stage_name: string;
    stream_id: string;
}

export type WebSocketEvent =
    | ProjectCreatedEvent
    | KeywordAddedEvent
    | CompanyAddedEvent
    | OnBenchmarkTitleItemsAddedEvent
    | OnBenchmarkExpertRankItemsAddedEvent
    | OnHighlyRelevantJobFunctionExpertsAddedEvent
    | OnRankedExpertsAddedEvent
    | RunningStageStartedEvent
    | RunningStageCompletedEvent;