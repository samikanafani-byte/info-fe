"use client"

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { JobTitleCard } from "./job-title-card"
import { cn } from "@/lib/utils"
import type { JobTitleBenchmarkItem, BenchmarkCategory } from "@/lib/data"

interface DroppableAccordionItemProps {
  id: BenchmarkCategory
  title: string
  items: JobTitleBenchmarkItem[]
}

export function DroppableAccordionItem({ id, title, items }: DroppableAccordionItemProps) {
  const { setNodeRef: setHeaderRef, isOver: isOverHeader } = useDroppable({ id })
  const { setNodeRef: setContentRef, isOver: isOverContent } = useDroppable({ id })

  const isDropTarget = isOverHeader || isOverContent

  const icon = title.split(" ")[0]
  const text = title.substring(title.indexOf(" ") + 1)

  return (
    <AccordionItem value={id} className="border-none bg-transparent">
      <AccordionTrigger
        ref={setHeaderRef}
        className={cn(
          "hover:no-underline p-3 rounded-lg transition-colors data-[state=open]:border-b border-custom-border",
          isDropTarget ? "bg-primary/10" : "bg-background-subtle",
        )}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className={cn("text-base", id === "relevant" ? "text-primary" : "text-text-secondary")}>{icon}</span>
            <span className="font-bold text-text-primary text-sm">{text}</span>
          </div>
          <Badge variant="secondary" className="font-mono text-xs bg-custom-border text-text-primary">
            {items.length}
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent ref={setContentRef} className="p-2 bg-background-main">
        {items.length > 0 ? (
          <div className="space-y-2">
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              {items.map((item) => (
                <JobTitleCard key={item.id} item={item} />
              ))}
            </SortableContext>
          </div>
        ) : (
          <div className="text-center text-xs text-text-secondary py-4">Drop items here</div>
        )}
      </AccordionContent>
    </AccordionItem>
  )
}
