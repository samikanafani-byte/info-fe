"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { DecodingProcess } from "@/lib/data"
import { cn } from "@/lib/utils"
import { ChevronRight, CheckCircle2, Loader, AlertCircle } from "lucide-react"
import { ReasoningTooltip } from "./reasoning-tooltip"
import { SearchStream } from "@/types/searchStream"
import { StreamState } from "@/types/streamState"

interface DecodingCardProps {
  
  stream: StreamState
  onSelect: () => void
}

const STEPS = ["Brief", "Companies", "Keywords", "Sourcing", "Review"]


const getStepName = (status: string) => {
  // - decode
  //   - companies
  //   - keywords
  //   - sourcing
  //   - review
  //   - completed
  switch (status) {
    case "brief":
      return "Brief"
    case "companies":
      return "Companies"
    case "keywords":
      return "Keywords"
    case "sourcing":
      return "Sourcing"
    case "review":
      return "Review"
    default:
      return "Unknown"
  }
}

export function DecodingCard({ stream, onSelect }: DecodingCardProps) {
  const getStatusInfo = () => {
    switch (stream.status) {
      case "completed":
        return {
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
          text: "Completed",
          color: "text-green-500",
        }
      case "companies":
      case "keywords":
      case "sourcing":
      case "review":
        return {
          icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
          text: `Action Required: ${getStepName(stream.status)}`,
          color: "text-yellow-500",
        }
      case "in-progress":
      default:
        return {
          icon: <Loader className="h-4 w-4 text-primary animate-spin" />,
          text: `Processing: `,
          color: "text-primary",
        }
    }
   
  }

  const statusInfo = getStatusInfo()

  return (
    <ReasoningTooltip content={stream.search_stream.stream_summary} asChild={false}>
      <Card className="bg-background-main border-custom-border hover:shadow-custom focus:shadow-custom transition-shadow cursor-help">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base text-text-primary">{stream.search_stream.stream_name}</CardTitle>
          <div className="flex items-center gap-2 text-sm">
            {statusInfo.icon}
            <span className={cn("font-semibold", statusInfo.color)}>{statusInfo.text}</span>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-text-secondary">Target Companies</p>
              <p className="font-medium text-text-primary">
                {stream.matching_companies_in_db?.length ?? 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Keywords</p>
              <p className="font-medium text-text-primary">
                {stream?.keywords?.list_of_keywords.length ?? 0}

              </p>
            </div>
            {/* <div>
              <p className="text-xs text-text-secondary">Experts Found</p>
              <p className="font-medium text-text-primary">{decoding.finalExpertCount}</p>
            </div> */}
            <Button variant="outline" size="sm" onClick={onSelect}>
              {/* {stream.status === "completed" ? "View Results" : "Continue"} */}
              {"Continue"}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </ReasoningTooltip>
  )
}
