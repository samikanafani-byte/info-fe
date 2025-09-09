"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Progress } from "@/components/ui/progress"
import { Check, Clock, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Stage } from "@/lib/data"

interface StageProcessorProps {
  stage: Stage
}

const statusConfig = {
  queued: {
    icon: <Clock className="h-5 w-5 text-text-secondary" />,
    textColor: "text-text-secondary",
    opacity: "opacity-60",
  },
  processing: {
    icon: <Loader2 className="h-5 w-5 text-primary animate-spin" />,
    textColor: "text-text-primary",
    opacity: "opacity-100",
  },
  completed: {
    icon: (
      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
        <Check className="h-3.5 w-3.5 text-text-on-primary" />
      </div>
    ),
    textColor: "text-text-primary",
    opacity: "opacity-100",
  },
}

export function StageProcessor({ stage }: StageProcessorProps) {
  const [isOpen, setIsOpen] = useState(stage.status === "processing")
  const config = statusConfig[stage.status]

  const progressValue = stage.total > 0 ? (stage.processed / stage.total) * 100 : 0

  return (
    <div className={cn("transition-opacity", config.opacity)}>
      <Accordion type="single" collapsible value={isOpen ? "item-1" : ""} onValueChange={(value) => setIsOpen(!!value)}>
        <AccordionItem value="item-1" className="border border-custom-border rounded-lg">
          <AccordionTrigger className="p-3 hover:no-underline">
            <div className="flex items-center gap-3 w-full">
              {config.icon}
              <div className="flex-grow text-left">
                <h3 className={cn("font-semibold", config.textColor)}>{stage.title}</h3>
                {stage.status === "processing" && (
                  <p className="text-xs text-text-secondary mt-1">
                    Processed {stage.processed.toLocaleString()} / {stage.total.toLocaleString()}
                  </p>
                )}
                {stage.status === "completed" && <p className="text-xs text-text-secondary mt-1">{stage.summary}</p>}
                {stage.status === "queued" && <p className="text-xs text-text-secondary mt-1">Waiting...</p>}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-3 pt-0">
            {stage.status === "processing" && (
              <>
                <Progress value={progressValue} className="h-1.5 mb-3" />
                <div className="h-24 bg-background-subtle rounded-md p-2 overflow-y-auto flex flex-col-reverse">
                  <div className="space-y-1.5">
                    {stage.feed.map((item, index) => (
                      <motion.p
                        key={`${stage.id}-${index}-${item}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-text-secondary"
                      >
                        <span className="font-mono text-primary/70">[AI]:</span> {item}
                      </motion.p>
                    ))}
                  </div>
                </div>
              </>
            )}
            {stage.status === "completed" && (
              <div className="text-center text-xs text-text-secondary py-2">Stage complete.</div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
