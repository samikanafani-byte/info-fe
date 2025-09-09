"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, UserPlus, UserMinus, FileText } from "lucide-react"
import type { Expert } from "@/lib/data"
import { ReasoningTooltip } from "./reasoning-tooltip"

interface ExpertCardProps {
  expert: Expert
  isShortlisted: boolean
  onShortlist: () => void
  onDismiss: () => void
  onViewDetails: () => void
}

export function ExpertCard({ expert, isShortlisted, onShortlist, onDismiss, onViewDetails }: ExpertCardProps) {
  return (
    <ReasoningTooltip content={expert.reasoningSummary}>
      <Card className="overflow-hidden cursor-help bg-background-main border-custom-border hover:shadow-custom focus:shadow-custom transition-shadow">
        <CardContent className="p-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-base text-text-primary">{expert.name}</h3>
              <p className="text-sm text-text-primary">{expert.title}</p>
              <p className="text-xs text-text-secondary">{expert.company}</p>
            </div>
            <Badge
              variant={expert.score > 4.5 ? "default" : "secondary"}
              className="flex items-center gap-1 text-primary bg-primary/10 border border-primary/20"
            >
              <Star className="h-3.5 w-3.5" />
              <span className="font-semibold">{expert.score.toFixed(1)}</span>
            </Badge>
          </div>
          <div className="mt-3 flex justify-end space-x-2">
            <Button variant={isShortlisted ? "default" : "outline"} size="sm" onClick={onShortlist}>
              <UserPlus className="h-4 w-4 mr-1.5" />
              {isShortlisted ? "Shortlisted" : "Add to Shortlist"}
            </Button>
            <Button variant="link" size="sm" onClick={onDismiss}>
              <UserMinus className="h-4 w-4 mr-1.5" />
              Dismiss
            </Button>
            <Button variant="link" size="sm" onClick={onViewDetails}>
              <FileText className="h-4 w-4 mr-1.5" />
              Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </ReasoningTooltip>
  )
}
