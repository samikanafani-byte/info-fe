"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { JobTitleCard } from "./job-title-card"
import { cn } from "@/lib/utils"
import type { JobTitleBenchmarkItem, BenchmarkCategory } from "@/lib/data"
import { Badge } from "./ui/badge"
import { JobTitleBenchmark } from "@/types/benchMarkTitles"

interface BenchmarkKanbanColumnProps {
  id: string
  title: string
  items: JobTitleBenchmark[]
}

export function BenchmarkKanbanColumn({ id, title, items }: BenchmarkKanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  const icon = title.split(" ")[0]
  const text = title.substring(title.indexOf(" ") + 1)

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col bg-background-subtle rounded-lg h-full transition-colors",
        isOver && "bg-primary/10",
      )}
    >
      <div className="p-3 border-b border-custom-border flex-shrink-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className={cn("text-base", id === "relevant" ? "text-primary" : "text-text-secondary")}>{icon}</span>
            <span className="font-bold text-text-primary text-sm">{text}</span>
          </div>
          <Badge variant="secondary" className="font-mono text-xs bg-custom-border text-text-primary">
            {items.length}
          </Badge>
        </div>
      </div>
      <div className="p-2 flex-grow overflow-y-auto">
        {items.length > 0 ? (
          <div className="space-y-2">
            {/* <SortableContext items={items} strategy={verticalListSortingStrategy}> */}
              {items.map((item) => (
                <JobTitleCard key={item.benchmark_title_id} item={item} />
              ))}
            {/* </SortableContext> */}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-center text-xs text-text-secondary p-4">
            Drop items here
          </div>
        )}
      </div>
    </div>
  )
}
