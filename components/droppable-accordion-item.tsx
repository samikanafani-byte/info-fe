import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { useDroppable } from "@dnd-kit/core"
import { JobTitleCard } from "./job-title-card"
import { cn } from "@/lib/utils"
import type { JobTitleBenchmarkItem } from "@/lib/data"
import { JobTitleBenchmark } from "@/types/benchMarkTitles"

interface DroppableAccordionItemProps {
  id: string
  title: string
  items: JobTitleBenchmark[]
  onChangeCategory?: (itemId: string, newCategory: string) => void
}

export function DroppableAccordionItem({ id, title, items, onChangeCategory }: DroppableAccordionItemProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: { type: "container", containerId: id },
  })

  const icon = title.split(" ")[0]
  const text = title.substring(title.indexOf(" ") + 1)

  return (
    <AccordionItem value={id} className="border-none bg-transparent">
      <AccordionTrigger
        className="hover:no-underline p-3 rounded-lg transition-colors data-[state=open]:border-b border-custom-border"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className={cn("text-base", id === "relevant" ? "text-primary" : "text-text-secondary")}>
              {icon}
            </span>
            <span className="font-bold text-text-primary text-sm">{text}</span>
          </div>
          <Badge variant="secondary" className="font-mono text-xs bg-custom-border text-text-primary">
            {items.length}
          </Badge>
        </div>
      </AccordionTrigger>

      <AccordionContent
        ref={setNodeRef}
        className={cn("p-2 bg-background-main", isOver && "bg-primary/10")}
      >
        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map((item) => (
              <JobTitleCard key={item.benchmark_title_id} item={item} onChangeCategory={(newCategory) => {
                if (onChangeCategory) {
                  console.log("Changing category of", item.benchmark_title_id, "to", newCategory)
                  onChangeCategory(item.benchmark_title_id, newCategory)
                }
              }} />
            ))}
          </div>
        ) : (
          <div className="text-center text-xs text-text-secondary py-4">Drop items here</div>
        )}
      </AccordionContent>
    </AccordionItem>
  )
}
