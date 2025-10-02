"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, UserPlus, UserMinus, FileText, ChevronRight } from "lucide-react"
import type { Expert } from "@/lib/data"
import { ReasoningTooltip } from "./reasoning-tooltip"
import Tooltip from '@mui/material/Tooltip';

interface ExpertCardProps {
  expert: Expert
  isShortlisted: boolean
  onShortlist: () => void
  onDismiss: () => void
  onViewDetails: () => void
}
const getScoreTitle = (score: string) => {
  switch (score.toLowerCase()) {
    case "highly_relevant":
      return "Highly Relevant"
    case "needs_more_info":
      return "Needs More Info"
    case "definitely_not_relevant":
      return "Definitely Not Relevant"
    default:
      return score
  }
}

export function ExpertCard({ expert, isShortlisted, onShortlist, onDismiss, onViewDetails }: ExpertCardProps) {
  return (
    <Tooltip title={expert.reasoningSummary} placement="right-start">
      <Card className="overflow-hidden cursor-help bg-background-main border-custom-border hover:shadow-custom focus:shadow-custom transition-shadow">
        <CardContent className="p-3">
          <div className="flex justify-between items-start">
            <div>
              
              <div className="flex flex-row gap-2 items-center justify-start">
                <h3 className="font-bold text-base text-text-primary">{expert.name}</h3> 
                <a href={`https://iqplatform.iqnetwork.co/new_expert.php?id=${expert.id}`} target="_blank">
                  <div className="flex flex-row items-center justify-start">
                    <p className="text-xs text-primary">View more info</p>
                    <ChevronRight className="h-2 w-2 text-primary" />
                  </div>
                </a>
                </div>
              
              <p className="text-sm text-text-primary">{expert.title}</p>
              <p className="text-xs text-text-secondary">{expert.company}</p>
            </div>
            <Badge
              variant={expert.score === "highly_relevant" ? "default" : "secondary"}
              className="flex items-center gap-1 text-primary bg-primary/10 border border-primary/20"
            >
              <Star className="h-3.5 w-3.5" />
              <span className="font-semibold">{getScoreTitle(expert.score)}</span>
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
    </Tooltip>
  )
}
