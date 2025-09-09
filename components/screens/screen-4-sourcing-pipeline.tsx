"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { StageProcessor } from "@/components/stage-processor"
import { SourcingFunnel } from "@/components/sourcing-funnel"
import { Button } from "@/components/ui/button"
import type { Stage } from "@/lib/data"

const initialStages: Stage[] = [
  {
    id: 1,
    title: "Reviewing Job Titles",
    status: "processing",
    total: 15000,
    processed: 0,
    summary: "",
    feed: [],
  },
  {
    id: 2,
    title: "Reviewing Past Experiences",
    status: "queued",
    total: 577,
    processed: 0,
    summary: "",
    feed: [],
  },
  {
    id: 3,
    title: "Scoring & Final Selection",
    status: "queued",
    total: 85,
    processed: 0,
    summary: "",
    feed: [],
  },
]

const sampleFeedMessages = {
  1: [
    "Categorized 'Trade Manager' as Highly Relevant.",
    "Categorized 'Logistics Coordinator' as Needs Info.",
    "Categorized 'Warehouse Manager' as Not Relevant.",
    "Found high keyword overlap in 'Head of Ocean Freight'.",
  ],
  2: [
    "Re-categorized experience from 'John Doe' as Highly Relevant.",
    "Promoted snippet from 'Jane Smith' based on pricing model experience.",
    "Flagged experience from 'Peter Jones' for manual review.",
    "Found strong match for 'Asia-Europe Trade Lanes' in profile.",
  ],
  3: [
    "Scored expert 'Jane Smith' -> 4.8/5.",
    "Scored expert 'Annette Black' -> 4.7/5.",
    "Final score for 'John Doe' is 4.5/5.",
    "Expert 'Cameron Williamson' added to shortlist.",
  ],
}

const finalSummaries = {
  1: "Found: 127 Relevant, 450 Needs Info, 14,423 Not Relevant",
  2: "Promoted: 85 to Relevant, 365 to Not Relevant",
  3: "Identified 92 potential experts.",
}

const funnelData = {
  totalScanned: 15000,
  initialRelevant: 127,
  initialNeedsInfo: 450,
  experiencePromoted: 85,
  finalExperts: 92,
}

interface Screen4SourcingPipelineProps {
  onViewResults: () => void
}

export default function Screen4SourcingPipeline({ onViewResults }: Screen4SourcingPipelineProps) {
  const [stages, setStages] = useState<Stage[]>(initialStages)
  const [activeStageIndex, setActiveStageIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (activeStageIndex >= stages.length) {
      setIsComplete(true)
      return
    }

    const currentStage = stages[activeStageIndex]
    if (currentStage.status !== "processing") return

    const interval = setInterval(() => {
      setStages((prevStages) => {
        const newStages = [...prevStages]
        const stageToUpdate = { ...newStages[activeStageIndex] }

        if (stageToUpdate.processed < stageToUpdate.total) {
          stageToUpdate.processed += Math.floor(Math.random() * (stageToUpdate.total / 50)) + 1
          stageToUpdate.processed = Math.min(stageToUpdate.processed, stageToUpdate.total)

          if (Math.random() > 0.6) {
            const messages = sampleFeedMessages[stageToUpdate.id as keyof typeof sampleFeedMessages]
            const newMessage = messages[Math.floor(Math.random() * messages.length)]
            stageToUpdate.feed = [newMessage, ...stageToUpdate.feed].slice(0, 10)
          }
        } else {
          clearInterval(interval)
          stageToUpdate.status = "completed"
          stageToUpdate.summary = finalSummaries[stageToUpdate.id as keyof typeof finalSummaries]
          setActiveStageIndex((prevIndex) => prevIndex + 1)

          if (activeStageIndex + 1 < newStages.length) {
            newStages[activeStageIndex + 1].status = "processing"
          }
        }
        newStages[activeStageIndex] = stageToUpdate
        return newStages
      })
    }, 150)

    return () => clearInterval(interval)
  }, [activeStageIndex, stages])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0">
        <h2 className="text-lg font-semibold text-text-primary mb-1">Sourcing Pipeline</h2>
        <p className="text-sm text-text-secondary mb-4">The AI is running a multi-stage filtering process.</p>
      </div>

      <div className="flex-grow space-y-3 overflow-y-auto pr-2 -mr-2">
        {stages.map((stage) => (
          <StageProcessor key={stage.id} stage={stage} />
        ))}
      </div>

      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-shrink-0 pt-4 mt-4 border-t border-custom-border"
          >
            <div className="@2xl/main:max-w-md @2xl/main:mx-auto">
              <SourcingFunnel data={funnelData} />
            </div>
            <Button className="w-full mt-4" onClick={onViewResults}>
              View & Review {funnelData.finalExperts} Experts
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
