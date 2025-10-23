import { useMainPageStore } from "../store/mainPageStore"
import { useEffect, useCallback } from 'react';
import { getSocket } from "@/lib/sockets/socket";
import { getProject } from "@/services/projectService";

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
            console.log('Sockket Message received from server:', message);
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
