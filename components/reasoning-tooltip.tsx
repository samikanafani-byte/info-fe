"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useState } from "react"
import type React from "react"

interface ReasoningTooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  asChild?: boolean
}

export function ReasoningTooltip({ content, children, asChild = true }: ReasoningTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(false)
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent className="max-w-xs bg-text-primary text-text-on-primary border-none rounded-md shadow-lg p-3 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-5 w-5 text-text-on-primary/70 hover:text-text-on-primary hover:bg-white/10 rounded-sm"
            onClick={handleClose}
          >
            <X className="h-3 w-3" />
          </Button>
          <div className="pr-6">{content}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
