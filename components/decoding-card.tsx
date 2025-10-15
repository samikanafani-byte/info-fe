"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { DecodingProcess } from "@/lib/data"
import { cn } from "@/lib/utils"
import { ChevronRight, CheckCircle2, Loader, AlertCircle,Ellipsis } from "lucide-react"
import { ReasoningTooltip } from "./reasoning-tooltip"
import { SearchStream } from "@/types/searchStream"
import { getChainItems, StreamState } from "@/types/streamState"
import Tooltip from '@mui/material/Tooltip';
import AppThoughtChain from "./ui/app-thought-chain"
import { ThoughtChainItem } from "@ant-design/x"
import { CheckCircleOutlined, InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { THOUGHT_CHAIN_ITEM_STATUS } from "@ant-design/x/es/thought-chain/Item"

interface DecodingCardProps {
  
  stream: StreamState
  onSelect: () => void
}

const STEPS = ["Brief", "Companies", "Keywords", "Sourcing", "Review"]


const getStepName = (status: string) => {
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
        return 
    }
   
  }
  const getIconForStatus = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircleOutlined />;
      case "current":
        return <Ellipsis />;
      case "pending":
        return undefined;
      default:
        return <InfoCircleOutlined />;
    }
  }
  const statusToThoughtChainStatus = (status: string): THOUGHT_CHAIN_ITEM_STATUS|undefined  => {
    switch (status) {
      case "passed":
        return THOUGHT_CHAIN_ITEM_STATUS.SUCCESS
      case "current":
        return undefined
      default:
        return THOUGHT_CHAIN_ITEM_STATUS.PENDING
    }
  }
  const getThoughtChainsFromStreamState = (streamState: StreamState): ThoughtChainItem[] => {
    const chainItems = getChainItems(streamState);
    return chainItems.map((item) => ({
        title: item.title,
        status: statusToThoughtChainStatus(item.status),
        icon: getIconForStatus(item.status),
    }));
  }


  const statusInfo = getStatusInfo()
  
  return (
    <Tooltip title={stream.search_stream.stream_summary} placement="right-start">
      <Card className="bg-background-main border-custom-border hover:shadow-custom focus:shadow-custom transition-shadow cursor-help">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base text-text-primary">{stream.search_stream.stream_name}</CardTitle>
          <div className="flex items-center gap-2 text-sm">
            <AppThoughtChain thoughtChainItems={getThoughtChainsFromStreamState(stream)} />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="flex justify-end items-end">

            <Button variant="outline" size="sm" onClick={onSelect}>
              {"Continue"}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Tooltip>
  )
}
