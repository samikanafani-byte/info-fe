"use client"

import { useState } from "react"
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core"
import { Button } from "@/components/ui/button"
import { Accordion } from "@/components/ui/accordion"
import { DroppableAccordionItem } from "@/components/droppable-accordion-item"
import { BenchmarkKanbanColumn } from "@/components/benchmark-kanban-column"
import type { JobTitleBenchmarkItem, BenchmarkCategory } from "@/lib/data"
import { HybridFeedbackInput } from "@/components/hybrid-feedback-input"
import { StreamState } from "@/types/streamState"
import { HighlyRelevantJobFunctionExpert } from "@/types/highlyRelevantJobFunctionExpert"
import { NeedsMoreInfoExpert } from "@/types/NeedsMoreInfoExperts"


interface Screen3_5BenchmarkReviewProps {
  sessionId: string, 
  streamState: StreamState,
  onStartSourcing: () => void
  onRebenchmark: () => void
}

const CATEGORIES = [
  { id: "relevant", title: "✅ Highly Relevant" },
  { id: "ambiguous", title: "❓ Needs More Info" },
  { id: "irrelevant", title: "❌ Not Relevant" },
] as const

export default function Screen3_5BenchmarkReview({
  sessionId,
  streamState,
  onStartSourcing,
  onRebenchmark,
}: Screen3_5BenchmarkReviewProps) {

  
  const [newStreamState, setNewStreamState] = useState<StreamState>(streamState)
  
  
  const highlyRelevantJobFunctions: HighlyRelevantJobFunctionExpert[] = newStreamState.highly_relevant_job_function_experts ?? []
  const needMoreInfoJobFunctions: NeedsMoreInfoExpert[] = newStreamState.needs_more_info_experts ?? []


  const getItemsForCategory = (category: BenchmarkCategory): JobTitleBenchmarkItem[] => {
    switch (category) {
      case "relevant":
        return highlyRelevantJobFunctions.map((jobFunction, index) => ({
          id: `relevant-${index}`,
          title: jobFunction.job_function,
          initialCategory: "relevant",
          currentCategory: "relevant",
          company: jobFunction.company_name,
          reasoning: jobFunction.relevance_justification,
        }))
      case "ambiguous":
        return needMoreInfoJobFunctions.map((jobFunction, index) => ({
          id: `ambiguous-${index}`,
          title: jobFunction.job_function,
          initialCategory: "ambiguous",
          currentCategory: "ambiguous",
          company: jobFunction.company_name,
          reasoning: jobFunction.relevance_justification,
        }))
      case "irrelevant":
        return [] // Assuming no items initially in irrelevant category
      default:
        return []
    }
  }
  

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    // if (over && active.id) {
    //   const activeItem = items.find((i) => i.id === active.id)
    //   const overContainerId = over.id as BenchmarkCategory

    //   if (activeItem && activeItem.currentCategory !== overContainerId) {
    //     const updatedItems = items.map((item) => {
    //       if (item.id === active.id) {
    //         return { ...item, currentCategory: overContainerId }
    //       }
    //       return item
    //     })
    //     setItems(updatedItems)
    //   }
    // }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0">
          <p className="text-sm text-text-secondary mb-4">
            Drag job titles to correct the AI, and use '@' to reference them in your feedback below.
          </p>
        </div>

        {/* Responsive Layout Container */}
        <div className="flex-grow min-h-0 overflow-y-auto pr-1 -mr-3">
          {/* Accordion View for small containers */}
          <div className="w-full space-y-2 @md/main:hidden">
            <Accordion type="single" collapsible defaultValue="relevant" className="w-full space-y-2">
              {CATEGORIES.map((category) => (
                <DroppableAccordionItem
                  key={category.id}
                  id={category.id}
                  title={category.title}
                  items={getItemsForCategory(category.id)}
                />
              ))}
            </Accordion>
          </div>

          {/* Kanban View for large containers */}
          <div className="hidden @md/main:grid @md/main:grid-cols-3 @md/main:gap-3 @md/main:h-full">
            {CATEGORIES.map((category) => (
              <BenchmarkKanbanColumn
                key={category.id}
                id={category.id}
                title={category.title}
                items={getItemsForCategory(category.id)}
              />
            ))}
          </div>
        </div>

        <div className="flex-shrink-0 pt-4 mt-4 border-t border-custom-border">
          {/* <HybridFeedbackInput
            mentionableItems={items}
            onUpdate={(content) => setFeedbackText(content)}
            key={benchmarkData.length}
          /> */}
          <div className="flex items-center justify-between mt-4">
            <Button variant="link" onClick={onStartSourcing}>
              Skip & Start Sourcing
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={onRebenchmark}>
                Benchmark More
              </Button>
              <Button onClick={onStartSourcing}>Apply & Start Full Sourcing</Button>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  )
}
