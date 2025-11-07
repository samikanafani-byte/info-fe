import { StreamState } from "@/types/streamState";
import { useCompanyReviewStore } from "../store/companyReviewStore";
import { useCallback } from "react";
import useSWRMutation from 'swr/mutation'
import { ProjectState } from "@/types/project";
import { patchProject, updateProject } from "@/services/projectService";
import { set } from "date-fns";

async function apiUpdateCompanies(streamState: StreamState, sessionId: string): Promise<ProjectState> {
    const data = {
        matching_companies_in_db: streamState.matching_companies_in_db
    }
    const newResp = await patchProject(sessionId, streamState.stream_id, data)
    return newResp;
}

export const useCompanyReview = (streamState: StreamState, sessionId: string) => {
    const setMatchingCompaniesInDb = useCompanyReviewStore((state) => state.setMatchingCompaniesInDb);
    const setDisplayedCompanies = useCompanyReviewStore((state) => state.setDisplayedCompanies);
    const setStreamState = useCompanyReviewStore((state) => state.setStreamState);
    const setSessionId = useCompanyReviewStore((state) => state.setSessionId);
    const removeCompanyFromStore = useCompanyReviewStore((state) => state.removeCompany);
    const addCompanyFromStore = useCompanyReviewStore((state) => state.addCompany);
    const setNewCompany = useCompanyReviewStore((state) => state.setNewCompany);
    

    // Initialize the store with the provided streamState and sessionId
    setStreamState(streamState);
    setSessionId(sessionId);
    const loadCompaniesData = useCallback((streamState: StreamState) => {
        setStreamState(streamState);

        console.log(`Loading data for Session: ${sessionId} and StreamState:`, streamState);
        const matchingCompanies = streamState.matching_companies_in_db || [];

        setMatchingCompaniesInDb(matchingCompanies);
        setDisplayedCompanies(matchingCompanies);
    }, [setDisplayedCompanies, setMatchingCompaniesInDb, streamState]);


    const {
        trigger: removeCompany
    } = useSWRMutation('/api/company/remove', 
        async (_key, { arg: companyName }: { arg: string }) => {
        
        removeCompanyFromStore(companyName);
        //update the stream state
        const updatedStreamState: StreamState = {
            ...streamState,
            matching_companies_in_db: useCompanyReviewStore.getState().matchingCompaniesInDb,
        };
        try{
            const newResp = await apiUpdateCompanies(updatedStreamState, sessionId);
            const stream_to_set = newResp?.stream_states?.find(s => s.stream_id === updatedStreamState.stream_id);
            if (stream_to_set){
                setStreamState(stream_to_set);
            }
            return newResp;

        }catch (error) {
            console.error("Error updating companies:", error);
            throw error;
        }
    });

    const {
        trigger: addCompany
    } = useSWRMutation('/api/company/add',
        async (_key, { arg: companyName }: { arg: string }) => {

            addCompanyFromStore(companyName);
            //update the stream state
            const updatedStreamState: StreamState = {
                ...streamState,
                matching_companies_in_db: useCompanyReviewStore.getState().matchingCompaniesInDb,
            };
            try {
                const newResp = await apiUpdateCompanies(updatedStreamState, sessionId);
                const stream_to_set = newResp?.stream_states?.find(s => s.stream_id === updatedStreamState.stream_id);
                if (stream_to_set) {
                    setStreamState(stream_to_set);
                }
                return newResp;

            } catch (error) {
                console.error("Error updating companies:", error);
                throw error;
            }
        });

    return {
        loadCompaniesData,
        removeCompany,
        addCompany, 
        setNewCompany
    }


}