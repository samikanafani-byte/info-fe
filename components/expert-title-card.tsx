// inside JobTitleCard.tsx
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { GripVertical, RefreshCw } from "lucide-react"

import { cn } from "@/lib/utils"

import Tooltip from '@mui/material/Tooltip';
import { JobTitleBenchmark } from "@/types/benchMarkTitles"
import { RankedExpert } from "@/types/rankedExpert"


interface ExpertTitleCardProps {
    item: RankedExpert
    onChangeCategory?: (newCategory: string) => void
}

export function ExpertTitleCard({ item, onChangeCategory }: ExpertTitleCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.expert_id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  }

  const wasCorrected = false

  // inside JobTitleCard.tsx
  return (
    <Tooltip title={item.relevance_justification} placement="right-start">
      <Card
        ref={setNodeRef}
        style={style}
        className={cn(
          "shadow-sm bg-background-main rounded-md border-custom-border cursor-help",
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
            <p className="text-sm font-bold text-text-primary leading-tight">{item.expert_id}</p>
            <p className="text-xs text-text-secondary">at {item.relevance_justification}</p>
          </div>
          {wasCorrected && (
            <div className="p-1 text-primary" title="You corrected this item">
              <RefreshCw className="h-3.5 w-3.5" />
            </div>
          )}
          {onChangeCategory && (
            <select
              value={item.category}
              onChange={(e) => onChangeCategory(e.target.value)}
            >
              <option value="highly_relevant">✅ Highly Relevant</option>
              <option value="needs_more_info">❓ Needs More Info</option>
              <option value="definitely_not_relevant">❌ Not Relevant</option>
            </select>
          )}
          {/* Remove this span as it's a static, non-Radix tooltip */}
          {/* <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-sm bg-gray-700 text-white rounded opacity-0 group-hover:opacity-100 transition">
          {item.reasoning}
        </span> */}
        </CardContent>
      </Card>
    </Tooltip>
  )
}