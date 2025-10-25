import { useMainPageStore } from "../store/mainPageStore"
import { useEffect, useCallback } from 'react';
import { getSocket } from "@/lib/sockets/socket";
import { getProject } from "@/services/projectService";
import { WebSocketEvent } from "../types/event";

export const useMainPage = (projectId: string) => {
    const setProjectId = useMainPageStore((state) => state.setProjectId);
    const setProject = useMainPageStore((state) => state.setProject);
    const setActiveDecoding = useMainPageStore((state) => state.setActiveDecoding);
    const setLoadingText = useMainPageStore((state) => state.setLoadingText);
    const setIsDialogOpen = useMainPageStore((state) => state.setIsDialogOpen);
    const setIsLoading = useMainPageStore((state) => state.setIsLoading);
    const setIsConnected = useMainPageStore((state) => state.setIsConnected);
    const setServerStatus = useMainPageStore((state) => state.setServerStatus);
    const updateProjectStream = useMainPageStore((state) => state.updateProjectStream);
    const setCurrentPage = useMainPageStore((state) => state.setCurrentPage);

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

                case "keyword_added": {
                    console.log("Keyword added:", event.keywords.length);

                    // 🚀 USE THE DEDICATED ACTION
                    updateProjectStream(event.stream_id, (stream) => {
                        // All your logic is now guaranteed to run on the LATEST stream object
                        if (!stream.keywords) {
                            stream.keywords = { list_of_keywords: [] };
                        }

                        // Use a new array to ensure immutability inside the stream object
                        const newKeywords = [...stream.keywords.list_of_keywords, ...event.keywords];

                        console.log("Updated keywords in stream:", newKeywords.length);

                        // RETURN the new, updated stream object
                        return {
                            ...stream,
                            keywords: {
                                ...stream.keywords,
                                list_of_keywords: newKeywords,
                            }
                        };
                    });
                    break;
                }

                case "company_added": {
                    console.log("Matching companies found:", event.matching_companies);

                    // 🚀 USE THE DEDICATED ACTION
                    updateProjectStream(event.stream_id, (stream) => {
                        if (!stream.matching_companies_in_db) {
                            stream.matching_companies_in_db = [];
                        }

                        // Use a new array for immutability
                        const newCompanies = [...stream.matching_companies_in_db, ...event.matching_companies];

                        console.log("Updated matching companies in stream:", newCompanies.length);

                        return {
                            ...stream,
                            matching_companies_in_db: newCompanies
                        };
                    });
                    break;
                }

                case "benchmark_title_items_added":{
                    console.log("Benchmark title items added:", event.benchmark_title_items.length);

                    updateProjectStream(event.stream_id, (stream) => {
                        if(!stream.benchmark_state){
                            stream.benchmark_state = { 
                                benchmark_state_id: event.benchmark_state_id,
                                benchmark_titles: {
                                results: []
                            }, 
                             };
                        }
                        if(!stream.benchmark_state.benchmark_titles){
                            stream.benchmark_state.benchmark_titles = { results: [] };
                        }
                        
                        const newTitles = [...stream.benchmark_state.benchmark_titles.results, ...event.benchmark_title_items];
                        console.log("Updated benchmark titles in stream:", newTitles.length);
                        
                        return {    
                            ...stream,
                            benchmark_state: {
                                ...stream.benchmark_state,
                                benchmark_titles: {
                                    ...stream.benchmark_state.benchmark_titles,
                                    results: newTitles
                                }
                            }
                        };
                    });
                    break;  
                }
                case "benchmark_expert_rank_items_added":{
                    console.log("Benchmark expert rank items added:", event.benchmark_expert_rank_items.length);
                    updateProjectStream(event.stream_id, (stream) => {
                        if(!stream.benchmark_state){
                            
                            stream.benchmark_state = { 
                                benchmark_state_id: event.benchmark_state_id,
                                expert_rank_list: { results: [] } 
                            };
                        }
                        if(!stream.benchmark_state.expert_rank_list){
                            stream.benchmark_state.expert_rank_list = { results: [] };
                        }
                        const newExpertRanks = [...stream.benchmark_state.expert_rank_list?.results ?? [], ...event.benchmark_expert_rank_items];
                        console.log("Updated benchmark expert ranks in stream:", newExpertRanks.length);
                        return {
                            ...stream,
                            benchmark_state: {
                                ...stream.benchmark_state,
                                expert_rank_list: {
                                    ...stream.benchmark_state.expert_rank_list,
                                    results: newExpertRanks
                                }
                            }
                        };
                    });
                    break;                    
                }
                case "highly_relevant_job_function_experts_added":{
                    console.log("Highly relevant job function experts added:", event.highly_relevant_experts.length);
                    updateProjectStream(event.stream_id, (stream) => {
                        if(!stream.experts_state){
                            stream.experts_state = { highly_relevant_job_function_experts:[] };
                        }
                        if(!stream.experts_state.highly_relevant_job_function_experts){
                            stream.experts_state.highly_relevant_job_function_experts = [];
                        }
                        const newHighlyRelevantExperts = [...stream.experts_state.highly_relevant_job_function_experts, ...event.highly_relevant_experts];
                        console.log("Updated highly relevant job function experts in stream:", newHighlyRelevantExperts.length);
                        return {
                            ...stream,
                            experts_state: {
                                ...stream.experts_state,
                                highly_relevant_job_function_experts: newHighlyRelevantExperts
                            }
                        };
                    });
                    break;
                }
                case "ranked_experts_added":{
                    console.log("Ranked experts added:", event.expert_ranks.length);
                    updateProjectStream(event.stream_id, (stream) => {
                        if(!stream.experts_state){
                            stream.experts_state = { ranked_experts: { results: [] } };
                        }
                        if(!stream.experts_state.ranked_experts){
                            stream.experts_state.ranked_experts = { results: [] };
                        }
                        const newRankedExperts = [...stream.experts_state.ranked_experts?.results ?? [], ...event.expert_ranks];
                        console.log("Updated ranked experts in stream:", newRankedExperts.length);
                        return {
                            ...stream,
                            experts_state: {
                                ...stream.experts_state,
                                ranked_experts: {
                                    ...stream.experts_state.ranked_experts,
                                    results: newRankedExperts
                                }
                            }
                        };
                    });
                    break;
                }
                case "running_stage_started":
                    console.log(`Running stage started: ${event.stage_name}`);
                    if (event.stage_name) {
                        updateProjectStream(event.stream_id, (stream) => {
                            const runningStages = stream.running_stages ? [...stream.running_stages, event.stage_name] : [event.stage_name];
                            console.log("Updated running stages in stream:", runningStages.length);
                            return {
                                ...stream,
                                running_stages: runningStages
                            };
                        });
                    }
                    break;

                case "running_stage_completed":
                    console.log(`Running stage completed: ${event.stage_name}`);
                    if (event.stage_name) {
                        updateProjectStream(event.stream_id, (stream) => {
                            const newRunningStages = (stream.running_stages || []).filter(stage => stage !== event.stage_name);
                            const newCompletedStages = (stream.completed_stages || []).concat(event.stage_name);

                            return {
                                ...stream,
                                running_stages: newRunningStages,
                                completed_stages: newCompletedStages
                            };
                        });
                    }
                    break;

                default:
                    console.warn("Unhandled event type:", event);
            
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
        setCurrentPage
    }
}
