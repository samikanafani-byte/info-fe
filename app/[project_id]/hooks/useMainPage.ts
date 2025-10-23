import { useMainPageStore } from "../store/mainPageStore"
import { useEffect, useCallback } from 'react';
import { getSocket } from "@/lib/sockets/socket";
import { getProject } from "@/services/projectService";
import { StreamState } from "http2";
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

                case "keyword_added":
                    console.log("Keyword added:", event.keywords.length);
                    break;

                case "company_added":
                    
                    console.log("Matching companies found:", event.matching_companies);
                    break;

                case "benchmark_title_items_added":
                    // TypeScript knows 'event' is a OnBenchmarkTitleItemsAddedEvent here
                    console.log("Benchmark title items added:", event.benchmark_title_items.length);
                    break;

                case "benchmark_expert_rank_items_added":
                    // TypeScript knows 'event' is a OnBenchmarkExpertRankItemsAddedEvent here
                    console.log("Benchmark expert rank items added:", event.benchmark_expert_rank_items.length);
                    break;
                    
                case "highly_relevant_job_function_experts_added":
                    // TypeScript knows 'event' is a OnHighlyRelevantJobFunctionExpertsAddedEvent here
                    console.log("Highly relevant job function experts added:", event.highly_relevant_experts.length);
                    break;
                
                case "ranked_experts_added":
                    // TypeScript knows 'event' is a OnRankedExpertsAddedEvent here
                    console.log("Ranked experts added:", event.expert_ranks.length);
                    break;
                    
                case "running_stage_started":
                    console.log(`Running stage started: ${event.stage_name}`);
                    break;

                case "running_stage_completed":
                    console.log(`Running stage completed: ${event.stage_name}`);
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
