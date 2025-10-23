import { useMainPageStore } from "../store/mainPageStore"
import { useEffect, useCallback } from 'react';
import { getSocket } from "@/lib/sockets/socket";
import { getProject } from "@/services/projectService";

import { WebSocketEvent } from "../types/event";
import { ProjectState } from "@/types/project";
import { StreamState } from "@/types/streamState";

const getStreamFromProject = (project: ProjectState, streamId: string): StreamState | undefined => {
    
    
    if (!project || !project.stream_states) {
        console.warn("No current project or stream states found in store.");
        return;
    }
    const stream = project.stream_states.find(s => s.stream_id === streamId);
    if (!stream) {
        console.warn(`Stream with ID ${streamId} not found in current project.`);
        return;
    }
}

export const useMainPage = (projectId: string) => {
    const setProjectId = useMainPageStore((state) => state.setProjectId);
    const setProject = useMainPageStore((state) => state.setProject);
    const setActiveDecoding = useMainPageStore((state) => state.setActiveDecoding);
    const setLoadingText = useMainPageStore((state) => state.setLoadingText);
    const setIsDialogOpen = useMainPageStore((state) => state.setIsDialogOpen);
    const setIsLoading = useMainPageStore((state) => state.setIsLoading);
    const setIsConnected = useMainPageStore((state) => state.setIsConnected);
    const setServerStatus = useMainPageStore((state) => state.setServerStatus);

    const handleLoadProject = useCallback(async () => {
        setIsLoading(true);
        setLoadingText("Fetching project...");

        try {
            const newProject = await getProject(projectId);
            setProject(newProject);
            setIsLoading(false);
            setLoadingText("");
            setIsDialogOpen(true);
        }
        catch(error){
            console.error("Error fetching project:", error);
            setIsLoading(false);
            setLoadingText("");
        }
    }, [setProjectId, setProject]);

    useEffect(() => {
        // 1. Set up listeners that update Zustand store
        function onConnect() {
            setIsConnected(true);
            console.log('Socket connected');
        }

        function onDisconnect() {
            setIsConnected(false);
            console.log('Socket disconnected');
        }

        function onMessageReceive(message: string) {
            console.log('Socket Message received from server:', message);
            const data: unknown = JSON.parse(message);
            const event = data as WebSocketEvent;
            switch (event.event_type) {
                case "project_created":
                    console.log("New project created with ID:", event.project_state.session_id);
                    setProject(event.project_state);
                    break;

                case "keyword_added":{
                    console.log("Keyword added:", event.keywords.length);
                    const stream = getStreamFromProject(useMainPageStore.getState().project!, event.stream_id);
                    if (!stream) {
                        console.warn(`Stream with ID ${event.stream_id} not found in current project.`);
                        return;
                    }
                    if (!stream.keywords) {
                        stream.keywords = {
                            list_of_keywords: []
                        };
                    }

                    //append the new keywords to the existing list
                    stream.keywords.list_of_keywords.push(...event.keywords);
                    console.log("Updated keywords in stream:", stream.keywords.list_of_keywords.length);
                    //update the project in the store
                    setProject({
                        ...useMainPageStore.getState().project!,
                        stream_states: useMainPageStore.getState().project!.stream_states!.map(s => s.stream_id === stream.stream_id ? stream : s)
                    });
                    break;
                }
                case "company_added":{
                    console.log("Matching companies found:", event.matching_companies);
                    const stream = getStreamFromProject(useMainPageStore.getState().project!, event.stream_id);
                    if (!stream) {
                        console.warn(`Stream with ID ${event.stream_id} not found in current project.`);
                        return;
                    }
                    //append the new companies to the existing list
                    if (!stream.matching_companies_in_db) {
                        stream.matching_companies_in_db = [];
                    }       
                    stream.matching_companies_in_db.push(...event.matching_companies);
                    console.log("Updated matching companies in stream:", stream.matching_companies_in_db.length);
                    //update the project in the store
                    setProject({
                        ...useMainPageStore.getState().project!,
                        stream_states: useMainPageStore.getState().project!.stream_states!.map(s => s.stream_id === stream.stream_id ? stream : s)
                    });
                    break;
                }
                    

                case "benchmark_title_items_added":{
                    console.log("Benchmark title items added:", event.benchmark_title_items.length);
                    const stream = getStreamFromProject(useMainPageStore.getState().project!, event.stream_id);
                    if (!stream) {
                        console.warn(`Stream with ID ${event.stream_id} not found in current project.`);
                        return;
                    }
                    if (!stream.benchmark_state) {
                        stream.benchmark_state = {
                            benchmark_titles: {
                                results: []
                            }
                        };
                    }
                    if(!stream.benchmark_state.benchmark_titles){
                        stream.benchmark_state.benchmark_titles = {
                            results: []
                        };
                    }
                    //append the new benchmark title items to the existing list
                    stream.benchmark_state.benchmark_titles!.results.push(...event.benchmark_title_items);
                    console.log("Updated benchmark titles in stream:", stream.benchmark_state.benchmark_titles!.results.length);
                    //update the project in the store
                    setProject({
                        ...useMainPageStore.getState().project!,
                        stream_states: useMainPageStore.getState().project!.stream_states!.map(s => s.stream_id === stream.stream_id ? stream : s)
                    }); 
                    break;
                }
                case "benchmark_expert_rank_items_added":{
                    // TypeScript knows 'event' is a OnBenchmarkExpertRankItemsAddedEvent here
                    console.log("Benchmark expert rank items added:", event.benchmark_expert_rank_items.length);
                    const stream = getStreamFromProject(useMainPageStore.getState().project!, event.stream_id);
                    if (!stream) {
                        console.warn(`Stream with ID ${event.stream_id} not found in current project.`);
                        return;
                    }
                    if (!stream.benchmark_state) {
                        stream.benchmark_state = {
                            expert_rank_list: {
                                results: []
                            }
                        };
                    }
                    if(!stream.benchmark_state.expert_rank_list){
                        stream.benchmark_state.expert_rank_list = {
                            results: []
                        };
                    }
                    if (!stream.benchmark_state.expert_rank_list!.results) {
                        stream.benchmark_state.expert_rank_list!.results = [];
                    }
                    //append the new benchmark expert rank items to the existing list
                    stream.benchmark_state.expert_rank_list!.results.push(...event.benchmark_expert_rank_items);
                    console.log("Updated benchmark expert ranks in stream:", stream.benchmark_state.expert_rank_list!.results.length);

                    //update the project in the store
                    setProject({
                        ...useMainPageStore.getState().project!,
                        stream_states: useMainPageStore.getState().project!.stream_states!.map(s => s.stream_id === stream.stream_id ? stream : s)
                    });
                    break;
                }
                    
                case "highly_relevant_job_function_experts_added":
                    // TypeScript knows 'event' is a OnHighlyRelevantJobFunctionExpertsAddedEvent here
                    console.log("Highly relevant job function experts added:", event.highly_relevant_experts.length);
                    const stream = getStreamFromProject(useMainPageStore.getState().project!, event.stream_id); 
                    if (!stream) {
                        console.warn(`Stream with ID ${event.stream_id} not found in current project.`);
                        return;
                    }
                    //append the new highly relevant experts to the existing list
                    if (!stream.experts_state) {
                        stream.experts_state = {
                            highly_relevant_job_function_experts: [],
                            needs_more_info_experts: [],
                            ranked_experts: {
                                results: []
                            }
                        };
                    }
                    if (!stream.experts_state.highly_relevant_job_function_experts) {
                        stream.experts_state.highly_relevant_job_function_experts = [];
                    }
                    stream.experts_state.highly_relevant_job_function_experts.push(...event.highly_relevant_experts);
                    console.log("Updated highly relevant experts in stream:", stream.experts_state.highly_relevant_job_function_experts.length);
                    //update the project in the store
                    setProject({
                        ...useMainPageStore.getState().project!,
                        stream_states: useMainPageStore.getState().project!.stream_states!.map(s => s.stream_id === stream.stream_id ? stream : s)
                    });
                    break;
                
                case "ranked_experts_added":
                    // TypeScript knows 'event' is a OnRankedExpertsAddedEvent here
                    console.log("Ranked experts added:", event.expert_ranks.length);
                    const rankedStream = getStreamFromProject(useMainPageStore.getState().project!, event.stream_id);
                    if (!rankedStream) {
                        console.warn(`Stream with ID ${event.stream_id} not found in current project.`);
                        return;
                    }   
                    //append the new ranked experts to the existing list
                    if (!rankedStream.experts_state) {
                        rankedStream.experts_state = {
                            highly_relevant_job_function_experts: [],
                            needs_more_info_experts: [],
                            ranked_experts: {
                                results: []
                            }
                        };
                    }
                    if (!rankedStream.experts_state.ranked_experts) {
                        rankedStream.experts_state.ranked_experts = {
                            results: []
                        };
                    }
                    if (!rankedStream.experts_state.ranked_experts.results) {
                        rankedStream.experts_state.ranked_experts.results = [];
                    }
                    rankedStream.experts_state.ranked_experts.results.push(...event.expert_ranks);
                    console.log("Updated ranked experts in stream:", rankedStream.experts_state.ranked_experts.results.length);
                    //update the project in the store
                    setProject({
                        ...useMainPageStore.getState().project!,
                        stream_states: useMainPageStore.getState().project!.stream_states!.map(s => s.stream_id === rankedStream.stream_id ? rankedStream : s)
                    }); 
                    break;
                    
                case "running_stage_started":
                    console.log(`Running stage started: ${event.stage_name}`);
                    if(event.stage_name){
                        const stream = getStreamFromProject(useMainPageStore.getState().project!, event.stream_id);
                        if (!stream) {
                            console.warn(`Stream with ID ${event.stream_id} not found in current project.`);
                            return;
                        }
                        if(!stream.running_stages){
                            stream.running_stages = []
                        }
                        stream.running_stages.push(event.stage_name);
                        setProject({
                            ...useMainPageStore.getState().project!,
                            stream_states: useMainPageStore.getState().project!.stream_states!.map(s => s.stream_id === stream.stream_id ? stream : s)
                        });
                    }
                    break;

                case "running_stage_completed":
                    console.log(`Running stage completed: ${event.stage_name}`);
                    if(event.stage_name){
                        const stream = getStreamFromProject(useMainPageStore.getState().project!, event.stream_id);
                        if (!stream) {
                            console.warn(`Stream with ID ${event.stream_id} not found in current project.`);
                            return;
                        }
                        if(!stream.running_stages){
                            stream.running_stages = []
                        }
                        //remove the stage from the running stages
                        stream.running_stages = stream.running_stages.filter(stage => stage !== event.stage_name);
                        if(!stream.completed_stages){
                            stream.completed_stages = []
                        }
                        //add the stage to the completed stages
                        stream.completed_stages.push(event.stage_name);
                        
                        setProject({
                            ...useMainPageStore.getState().project!,
                            stream_states: useMainPageStore.getState().project!.stream_states!.map(s => s.stream_id === stream.stream_id ? stream : s)
                        });
                        
                    }
                    break;
                default:
                    // This handles any unexpected event types
                    console.warn("Received unknown event type:", (event as any).event_type);
                    break;
            }

        }
        function onStatusUpdate(status: 'online' | 'offline') {
            console.log('Socket status updated:', status);
            setServerStatus(status);
        }
        const socket = getSocket(projectId);

        

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('message:receive', onMessageReceive);
        socket.on('status:update', onStatusUpdate);
        
        // 2. Initiate connection (only runs on client)
        socket.connect();

        // 3. Cleanup on unmount (important for preventing duplicate listeners)
        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('message:receive', onMessageReceive);
            socket.off('status:update', onStatusUpdate);
            socket.disconnect(); // Disconnect when component unmounts
        };
        // Empty dependency array ensures this runs once on mount and cleans up on unmount
    }, [setIsConnected, setServerStatus]);

    setProjectId(projectId);

    return {
        setIsLoading,
        setLoadingText,
        setProject,
        setIsDialogOpen,
        handleLoadProject,
        setActiveDecoding,
    }
}
function Keywords(): import("../../../types/keywords").Keywords | undefined {
    throw new Error("Function not implemented.");
}

