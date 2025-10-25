import { StreamState } from "@/types/streamState";
import { useExpertReviewStore } from "../store/expertReviewStore";
import { useCallback } from "react"; // <-- Import useCallback
import { Expert } from "@/lib/data"; // <-- Assuming Expert is needed for type safety
import { convertHighlyRelevantJobFunctionExpertToExpert, convertRankedExpertsToExpert } from "@/types/expertState";

export const useExpertReview = (streamState: StreamState, sessionId: string) => {
    // Get the setters from the store
    const setRankedExperts = useExpertReviewStore((state) => state.setRankedExperts);
    const setAllExperts = useExpertReviewStore((state) => state.setAllExperts);
    const setHighlyRelevantExperts = useExpertReviewStore((state) => state.setHighlyRelevantExperts);
    const setVisibleExperts = useExpertReviewStore((state) => state.setVisibleExperts);
    const setStreamState = useExpertReviewStore((state) => state.setStreamState);
    const setSessionId = useExpertReviewStore((state) => state.setSessionId);
    const setDismissed = useExpertReviewStore((state) => state.setDismissed);
    const setSelectedExpert = useExpertReviewStore((state) => state.setSelectedExpert);

    // Initialize the store with the provided streamState and sessionId
    // This runs on every render, but the setters should be stable (zustand)
    setStreamState(streamState);
    setSessionId(sessionId);


    // Define the data loading function inside the hook
    const loadExpertsData = useCallback(async () => {
        console.log(`Loading data for Session: ${sessionId} and StreamState:`, streamState);
        const highlyRelevant = streamState.experts_state?.highly_relevant_job_function_experts ?? []
        // filter the out the duplicates from the highly relevant experts based on expert_id
        const uniqueHighlyRelevant = Array.from(new Map(highlyRelevant.map(item => [item.expert_id, item])).values());
        const highlyRelevantExperts: Expert[] = uniqueHighlyRelevant.map((item) => convertHighlyRelevantJobFunctionExpertToExpert(item))
        setHighlyRelevantExperts(highlyRelevantExperts);
        const ranked = streamState.experts_state?.ranked_experts?.results ?? [];
        //filter out the duplicates from the ranked experts based on expert_id and make sure they are not in the highly relevant experts
        const uniqueRanked = ranked.filter(rankedItem => !uniqueHighlyRelevant.some(highlyRelevantItem => highlyRelevantItem.expert_id === rankedItem.expert_id));
        const rankedExperts: Expert[] = uniqueRanked ? uniqueRanked.map((item) => convertRankedExpertsToExpert(item)) : []
        setRankedExperts(rankedExperts);
        const allExperts: Expert[] = [...highlyRelevantExperts, ...rankedExperts]
        setAllExperts(allExperts);
        setVisibleExperts(allExperts);
        
    }, [
        sessionId,
        streamState,
        setAllExperts, 
        setRankedExperts,
    ]);

    const dismissExpert = useCallback((id: string) => {
        //get the current dismissed experts from the store
        const currentDismissed = useExpertReviewStore.getState().dismissed || [];
        setDismissed([...currentDismissed, id]);
        //update the visible experts in the store
        const experts = useExpertReviewStore.getState().allExperts || [];
        const visibleExperts = experts.filter((expert) => !currentDismissed.includes(expert.id))
        setVisibleExperts(visibleExperts);
    }, [setVisibleExperts]);

    const handleViewDetails = useCallback((expert: Expert | null) => {
        setSelectedExpert(expert);
    }, [setSelectedExpert]);

    return {
        loadExpertsData,
        dismissExpert,
        handleViewDetails
    }
}