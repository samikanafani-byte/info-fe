import { ProjectState } from "@/types/project"
import { StreamState } from "@/types/streamState"
import { create } from 'zustand'

export type MainPageState = {
    projectId?: string 
    project?: ProjectState
    activeDecoding: StreamState | undefined
    loadingText: string | undefined
    isDialogOpen: boolean 
    isCorrectingDecodings: boolean
    
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
}

const getInitialState = (): MainPageState => ({
    projectId: undefined,
    project: undefined,
    
    activeDecoding: undefined,
    loadingText: undefined,
    isDialogOpen: false,
    isCorrectingDecodings: false,   
    isConnected: false,
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
}))
