"use client"

import { useCallback, useEffect, useState } from "react"
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core"
import { Button } from "@/components/ui/button"
import { Accordion } from "@/components/ui/accordion"
import { DroppableAccordionItem } from "@/components/droppable-accordion-item"
import { BenchmarkKanbanColumn } from "@/components/benchmark-kanban-column"
import type { BenchmarkCategory, JobTitleBenchmarkItem } from "@/lib/data"
import { HybridFeedbackInput } from "@/components/hybrid-feedback-input"
import { StreamState } from "@/types/streamState"
import { HighlyRelevantJobFunctionExpert } from "@/types/highlyRelevantJobFunctionExpert"
import { NeedsMoreInfoExpert } from "@/types/NeedsMoreInfoExperts"
import { JobTitleBenchmark } from "@/types/benchMarkTitles"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateProject } from "@/services/projectService"

interface Screen4_5_BenchmarkProfilesProps {
  sessionId: string, 
  streamState: StreamState,
  onStartSourcing: () => void
  onNext: () => void
  onRebenchmark: () => void
}



export default function Screen4_5_BenchmarkProfiles({ sessionId,
    streamState,
    onStartSourcing,
    onRebenchmark}: Screen4_5_BenchmarkProfilesProps) {

    const [newStreamState, setNewStreamState] = useState<StreamState>(streamState)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const benchMarkState = newStreamState.benchmark_state;
    
        
}