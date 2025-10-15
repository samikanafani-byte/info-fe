"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { DecodingProcess } from "@/lib/data"
import { DecodingCard } from "@/components/decoding-card"
import { HybridFeedbackInput } from "@/components/hybrid-feedback-input"
import { AnimatePresence, motion } from "framer-motion"
import { ProjectState } from "@/types/project"
import { StreamState } from "@/types/streamState"

interface DecodingHubProps {
  project_state: ProjectState
  onStartNewDecoding: () => void
  onSelectDecoding: (streamState: StreamState) => void
  isCorrecting: boolean
  onApplyFeedback: (feedback: string) => void
}

export default function DecodingHub({
  project_state,
  onStartNewDecoding,
  onSelectDecoding,
  isCorrecting,
  onApplyFeedback,
}: DecodingHubProps) {
  const [feedbackText, setFeedbackText] = useState("")


  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 mb-4">
        <h2 className="text-lg font-semibold text-text-primary mb-1">Targeted Angle Points</h2>
        <p className="text-sm text-text-secondary">Manage multiple sourcing strategies based on the project brief.</p>
      </div>
      <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-3">
        {project_state.stream_states.map((decoding) => (
          <DecodingCard key={decoding.stream_id} stream={decoding} onSelect={() => onSelectDecoding(decoding)} />
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-custom-border">
        <AnimatePresence>
          <motion.div
            key="add-button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
          </motion.div> 
        </AnimatePresence>
      </div>
    </div>
  )
}
