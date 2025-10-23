import { ProjectState } from "@/types/project"
import { StreamState } from "@/types/streamState"
import { create } from 'zustand'

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
}

const getInitialState = (): MainPageState => ({
    projectId: undefined,
    project: undefined,
    
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
}))
