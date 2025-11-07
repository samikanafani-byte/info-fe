"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Info } from "lucide-react"
import type { Company } from "@/lib/data"
import { ReasoningTooltip } from "../../../reasoning-tooltip"
import { CompanyState } from "@/types/companyState"

interface CompanyCardProps {
  company: string
  onRemove: () => void
  canRemove: boolean
}

export function CompanyCard({ company, onRemove, canRemove }: CompanyCardProps) {
  const getBadgeVariant = (source: Company["source"]) => {
    switch (source) {
      case "AI Researched":
        return "default"
      case "Manually Added":
        return "secondary"
      case "From Brief":
      default:
        return "outline"
    }
  }

  return (
    <Card className="bg-background-main border-custom-border hover:shadow-custom focus:shadow-custom transition-shadow">
      <CardContent className="p-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* <ReasoningTooltip content={company.justification}>
            <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0 text-text-secondary cursor-help">
              <Info className="h-4 w-4" />
            </Button>
          </ReasoningTooltip> */}
          <div>
            <p className="font-medium text-sm text-text-primary">{company}</p>
            {/* <Badge
              variant={getBadgeVariant(company.source)}
              className="text-xs h-5 mt-0.5 text-text-secondary border-custom-border"
            >
              {company.source}
            </Badge> */}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-text-secondary hover:text-red-600"
          onClick={onRemove}
          disabled={!canRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
