import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import type { Expert } from "@/lib/data"
import { ReasoningTooltip } from "./reasoning-tooltip"

interface ExpertDetailModalProps {
  expert: Expert
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function ExpertDetailModal({ expert, isOpen, onOpenChange }: ExpertDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-w-[90vw] bg-background-main border-custom-border @container">
        <DialogHeader>
          <a href={`https://iqplatform.iqnetwork.co/new_expert.php?id=${expert.id}`} target="_blank">
            <DialogTitle className="text-xl text-text-primary">{expert.name}</DialogTitle>
          </a>
          <DialogDescription className="text-text-secondary">
            {expert.title} at {expert.company}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 @[600px]:grid @[600px]:grid-cols-2 @[600px]:gap-6">
          <div className="mb-6 @[600px]:mb-0">
            <h4 className="font-semibold text-text-primary mb-3">Reasoning Summary</h4>
            <p className="text-sm text-text-secondary bg-background-subtle p-3 rounded-md leading-relaxed">
              {expert.reasoningSummary}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-text-primary mb-3">AI Scoring Breakdown</h4>
            {/* <div className="space-y-3">
              {expert.scoringBreakdown.map((item) => (
                <ReasoningTooltip key={item.criteria} content={item.reason}>
                  <div className="p-3 rounded-md hover:bg-background-subtle cursor-help transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="flex-grow">
                        <p className="font-medium text-sm text-text-primary border-b border-dashed border-gray-400 inline">
                          {item.criteria}
                        </p>
                        <p className="text-xs text-text-secondary mt-1">Weight: {item.weight}</p>
                      </div>
                      <Badge variant="secondary" className="flex items-center gap-1 text-primary ml-3">
                        <Star className="h-3 w-3 text-yellow-500" />
                        {item.score}/5
                      </Badge>
                    </div>
                  </div>
                </ReasoningTooltip>
              ))}
            </div> */}
            <div className="mt-4 pt-4 border-t border-custom-border flex justify-between items-center">
              <p className="font-semibold text-text-primary">Final Score</p>
              <Badge className="text-base flex items-center gap-1.5 py-1 px-3 bg-primary text-text-on-primary">
                <Star className="h-4 w-4" />
                {expert.score}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
