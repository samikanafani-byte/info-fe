"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExpertCard } from "@/components/expert-card"
import { ExpertDetailModal } from "@/components/expert-detail-modal"
import type { Expert } from "@/lib/data"
import { StreamState } from "@/types/streamState"
import { convertHighlyRelevantJobFunctionExpertToExpert, convertRankedExpertsToExpert } from "@/types/expertState"

interface Screen5ReviewShortlistProps {
  streamState: StreamState
  sessionId: string
  onStartNewSearch: () => void
}

export default function Screen5ReviewShortlist({ onStartNewSearch, streamState, sessionId }: Screen5ReviewShortlistProps) {



  const [shortlisted, setShortlisted] = useState<string[]>([])
  const [dismissed, setDismissed] = useState<string[]>([])
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null)
  const highlyRelevant = streamState.experts_state?.highly_relevant_job_function_experts ?? []
  const highlyRelevantExperts: Expert[] = highlyRelevant.map((item) => convertHighlyRelevantJobFunctionExpertToExpert(item))
  const ranked = streamState.experts_state?.ranked_experts.results ?? [];
  const rankedExperts: Expert[] = ranked ? ranked.map((item) => convertRankedExpertsToExpert(item)) : []
  const experts: Expert[] = [...highlyRelevantExperts, ...rankedExperts]
  

  const handleShortlist = (id: string) => {
    setShortlisted((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleDismiss = (id: string) => {
    setDismissed((prev) => [...prev, id])
  }

  const handleViewDetails = (expert: Expert) => {
    setSelectedExpert(expert)
  }


  const visibleExperts = experts.filter((expert) => !dismissed.includes(expert.id))

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        <h2 className="text-lg font-semibold text-text-primary mb-1">Review & Shortlist</h2>
        <p className="text-sm text-text-secondary mb-4">
          Showing top {visibleExperts.length} of {experts.length} found experts.{" "}
          <span className="font-semibold text-primary">{shortlisted.length} shortlisted.</span>
        </p>

        {/* Enhanced responsive grid with more columns at larger sizes */}
        <div className="space-y-3 @lg/main:grid @lg/main:grid-cols-2 @lg/main:gap-3 @lg/main:space-y-0 @3xl/main:grid-cols-3 @4xl/main:grid-cols-4 @5xl/main:grid-cols-5 @6xl/main:grid-cols-6 @7xl/main:grid-cols-7 @8xl/main:grid-cols-8 @9xl/main:grid-cols-9 @10xl/main:grid-cols-10">
          {visibleExperts.map((expert) => (
            <ExpertCard
              key={expert.id}
              expert={expert}
              isShortlisted={shortlisted.includes(expert.id)}
              onShortlist={() => handleShortlist(expert.id)}
              onDismiss={() => handleDismiss(expert.id)}
              onViewDetails={() => handleViewDetails(expert)}
            />
          ))}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-custom-border">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="w-full bg-transparent" onClick={onStartNewSearch}>
            Start New Search
          </Button>
          <Button
            className="w-full"
            disabled={shortlisted.length === 0}
            onClick={() => alert(`Exporting ${shortlisted.length} experts...`)}
          >
            Export Shortlist ({shortlisted.length})
          </Button>
        </div>
      </div>
      {selectedExpert && (
        <ExpertDetailModal
          expert={selectedExpert}
          isOpen={!!selectedExpert}
          onOpenChange={() => setSelectedExpert(null)}
        />
      )}
    </div>
  )
}
