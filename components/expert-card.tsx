"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, UserPlus, UserMinus, FileText } from "lucide-react"
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

export function ExpertCard({ expert, isShortlisted, onShortlist, onDismiss, onViewDetails }: ExpertCardProps) {
  return (
    <Tooltip title={expert.reasoningSummary} placement="right-start">
      <Card className="overflow-hidden cursor-help bg-background-main border-custom-border hover:shadow-custom focus:shadow-custom transition-shadow">
        <CardContent className="p-3">
          <div className="flex justify-between items-start">
            <div>
              <a href={`https://iqplatform.iqnetwork.co/new_expert.php?id=${expert.id}`} target="_blank"><h3 className="font-bold text-base text-text-primary">{expert.name}</h3></a>
              <p className="text-sm text-text-primary">{expert.title}</p>
              <p className="text-xs text-text-secondary">{expert.company}</p>
            </div>
            <Badge
              variant={expert.score === "highly_relevant" ? "default" : "secondary"}
              className="flex items-center gap-1 text-primary bg-primary/10 border border-primary/20"
            >
              <Star className="h-3.5 w-3.5" />
              <span className="font-semibold">{expert.score}</span>
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
