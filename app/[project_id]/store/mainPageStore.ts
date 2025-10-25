import { ProjectState } from "@/types/project"
import { StreamState } from "@/types/streamState"
import { create } from 'zustand'
export type PageTitle = "decode" | "companies" | "keywords" | "benchmarking_titles" | "benchmarking_profiles" | "sourcing"
export type MainPageState = {
    projectId?: string 
    project?: ProjectState
    activeDecoding: StreamState | undefined
    loadingText: string | undefined
    isLoading: boolean
    isDialogOpen: boolean 
    isCorrectingDecodings: boolean
    serverStatus: 'online' | 'offline';
    //socket related states
    isConnected: boolean
    currentPage: PageTitle
    
    
}

type MainPageAction = {
    setProjectId: (projectId: string) => void
    setProject: (project: ProjectState) => void
    setIsConnected: (isConnected: boolean) => void
    setActiveDecoding: (activeDecoding: StreamState | undefined) => void
    setLoadingText: (loadingText: string | undefined) => void
    setIsDialogOpen: (isDialogOpen: boolean) => void
    setIsCorrectingDecodings: (isCorrectingDecodings: boolean) => void
    setServerStatus: (serverStatus: 'online' | 'offline') => void
    setIsLoading: (isLoading: boolean) => void
    setCurrentPage: (currentPage: PageTitle) => void
    updateProjectStream: (streamId: string, updateFn: (stream: StreamState) => StreamState) => void;
}

const getInitialState = (): MainPageState => ({
    projectId: undefined,
    project: undefined,
    currentPage: "decode",
    activeDecoding: undefined,
    loadingText: undefined,
    isLoading: false,
    isDialogOpen: false,
    isCorrectingDecodings: false,   
    isConnected: false,
    serverStatus: 'offline',
})

export const useMainPageStore = create<MainPageState & MainPageAction>((set) => ({
    ...getInitialState(),
    setProjectId: (projectId: string) => set(() => ({ projectId })),
    setProject: (project: ProjectState) => set(() => ({ project })),
    setActiveDecoding: (activeDecoding: StreamState | undefined) => set(() => ({ activeDecoding })),
    setLoadingText: (loadingText: string | undefined) => set(() => ({ loadingText })),
    setIsDialogOpen: (isDialogOpen: boolean) => set(() => ({ isDialogOpen })),
    setIsCorrectingDecodings: (isCorrectingDecodings: boolean) => set(() => ({ isCorrectingDecodings })),
    setIsConnected: (isConnected: boolean) => set(() => ({ isConnected })),
    setServerStatus: (serverStatus: 'online' | 'offline') => set(() => ({ serverStatus })),
    setIsLoading: (isLoading: boolean) => set(() => ({ isLoading })),
    setCurrentPage: (currentPage: PageTitle) => set(() => ({ currentPage })),
    updateProjectStream: (streamId, updateFn) => set((state) => {

        
        if (!state.project || !state.project.stream_states) {
            console.warn("Cannot update stream: No project or stream states.");
            return state;
        }

        const updatedStreamStates = state.project.stream_states.map(s => {
            if (s.stream_id === streamId) {
                // Apply the update function to the found stream
                return updateFn(s);
            }
            return s; // Keep other streams as they are
        });

        // Return the new state object
        return {
            project: {
                ...state.project,
                stream_states: updatedStreamStates,
            },
        };
    }),
}))
