"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { GripVertical, RefreshCw } from "lucide-react"
import type { JobTitleBenchmarkItem } from "@/lib/data"
import { cn } from "@/lib/utils"
import { ReasoningTooltip } from "./reasoning-tooltip"

interface JobTitleCardProps {
  item: JobTitleBenchmarkItem
}

export function JobTitleCard({ item }: JobTitleCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  }

  const wasCorrected = item.initialCategory !== item.currentCategory

  return (
    <ReasoningTooltip content={item.reasoning}>
      <div ref={setNodeRef} style={style} className="cursor-help">
        <Card
          className={cn(
            "shadow-sm bg-background-main rounded-md border-custom-border",
            isDragging && "shadow-custom-lg",
          )}
        >
          <CardContent className="p-2 flex items-center gap-1">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab touch-none p-1 text-text-secondary hover:text-text-primary"
            >
              <GripVertical className="h-5 w-5" />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-bold text-text-primary leading-tight">{item.title}</p>
              <p className="text-xs text-text-secondary">at {item.company}</p>
            </div>
            {wasCorrected && (
              <div className="p-1 text-primary" title="You corrected this item">
                <RefreshCw className="h-3.5 w-3.5" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ReasoningTooltip>
  )
}
