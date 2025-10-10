import { Expert } from "@/lib/data"
import { HighlyRelevantJobFunctionExpert } from "@/types/highlyRelevantJobFunctionExpert"
import { StreamState } from "@/types/streamState"
import { create } from 'zustand'

export type ExpertReviewState = {
    streamState: StreamState
    sessionId: string
    rankedExperts: Expert[] | undefined
    allExperts: Expert[] | undefined
    highlyRelevantExperts: Expert[] | undefined
    visibleExperts: Expert[] | undefined
    dismissed: string[] | undefined
    shortlisted: string[] | undefined
    selectedExpert: Expert | null
}

type ExpertReviewAction = {
    setStreamState: (streamState: StreamState) => void
    setSessionId: (sessionId: string) => void
    setRankedExperts: (rankedExperts: Expert[] | undefined) => void
    setAllExperts: (allExperts: Expert[] | undefined) => void
    setHighlyRelevantExperts: (highlyRelevantExperts: Expert[] | undefined) => void
    setVisibleExperts: (visibleExperts: Expert[] | undefined) => void
    setDismissed: (dismissed: string[] | undefined) => void
    setShortlisted: (shortlisted: string[] | undefined) => void
    setSelectedExpert: (selectedExpert: Expert | null) => void
}

const getInitialState = (streamState: StreamState, sessionId: string): ExpertReviewState => ({
    streamState,
    sessionId,
    rankedExperts: [],
    allExperts: [],
    highlyRelevantExperts: [],
    visibleExperts: [],
    dismissed: [],
    shortlisted: [],
    selectedExpert: null,
})

export const useExpertReviewStore = create<ExpertReviewState & ExpertReviewAction>((set) => ({
    ...getInitialState({} as StreamState, ""),
    setStreamState: (streamState: StreamState) => set(() => ({ streamState })),
    setSessionId: (sessionId: string) => set(() => ({ sessionId })),
    setRankedExperts: (rankedExperts: Expert[] | undefined) => set(() => ({ rankedExperts })),
    setAllExperts: (allExperts: Expert[] | undefined) => set(() => ({ allExperts })),
    setHighlyRelevantExperts: (highlyRelevantExperts: Expert[] | undefined) => set(() => ({ highlyRelevantExperts })),
    setVisibleExperts: (visibleExperts: Expert[] | undefined) => set(() => ({ visibleExperts })),
    setDismissed: (dismissed: string[] | undefined) => set(() => ({ dismissed })),
    setShortlisted: (shortlisted: string[] | undefined) => set(() => ({ shortlisted })),
    setSelectedExpert: (selectedExpert: Expert | null) => set(() => ({ selectedExpert })),
}))