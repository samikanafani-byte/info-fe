"use client"

import { ArrowDown } from "lucide-react"

interface SourcingFunnelProps {
  data: {
    totalScanned: number
    initialRelevant: number
    initialNeedsInfo: number
    experiencePromoted: number
    finalExperts: number
  }
}

const FunnelStage = ({
  label,
  value,
  color,
  isTop = false,
  isBottom = false,
}: {
  label: string
  value: string
  color: string
  isTop?: boolean
  isBottom?: boolean
}) => (
  <div className="flex flex-col items-center">
    <div
      className={`w-full py-2 px-4 text-center ${
        color === "bg-primary/70" ? "text-primary" : "text-text-on-primary"
      } ${color} ${isTop ? "rounded-t-md" : ""} ${isBottom ? "rounded-b-md" : ""}`}
    >
      <p className="font-bold text-sm">{label}</p>
      <p className="text-xs">{value}</p>
    </div>
  </div>
)

export function SourcingFunnel({ data }: SourcingFunnelProps) {
  return (
    <div>
      <h3 className="text-base font-semibold text-text-primary mb-2 text-center">Overall Sourcing Funnel</h3>
      <div className="space-y-1 flex flex-col items-center">
        <div className="w-full max-w-[80%]">
          <FunnelStage
            label="Total Job Titles Scanned"
            value={data.totalScanned.toLocaleString()}
            color="bg-primary/50"
            isTop
          />
        </div>
        <ArrowDown className="h-4 w-4 text-text-secondary" />
        <div className="w-full max-w-[70%]">
          <FunnelStage
            label="Initial Filter Results"
            value={`${data.initialRelevant.toLocaleString()} Relevant, ${data.initialNeedsInfo.toLocaleString()} Needs Info`}
            color="bg-primary/70"
          />
        </div>
        <ArrowDown className="h-4 w-4 text-text-secondary" />
        <div className="w-full max-w-[60%]">
          <FunnelStage
            label="Experience Review Results"
            value={`${data.experiencePromoted.toLocaleString()} Promoted to Relevant`}
            color="bg-primary/90"
          />
        </div>
        <ArrowDown className="h-4 w-4 text-text-secondary" />
        <div className="w-full max-w-[50%]">
          <FunnelStage
            label="Final Qualified Experts"
            value={`${data.finalExperts.toLocaleString()} Experts Found`}
            color="bg-primary/70"
            isBottom
          />
        </div>
      </div>
    </div>
  )
}
