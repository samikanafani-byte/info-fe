"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Maximize2, Minimize2, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const REGULAR_SIZE = { width: 1200, height: 650 }
const MAXIMIZED_SIZE = { width: 800, height: 800 }

interface ResizableDialogProps {
  trigger: React.ReactNode
  children: React.ReactNode
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function ResizableDialog({ trigger, children, isOpen, onOpenChange }: ResizableDialogProps) {
  const [size, setSize] = React.useState(REGULAR_SIZE)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [screenDimensions, setScreenDimensions] = React.useState({ width: 1920, height: 1080 })
  const [isMaximized, setIsMaximized] = React.useState(false)
  const preMaximizePositionRef = React.useRef({ x: 0, y: 0 })

  const isDraggingRef = React.useRef(false)
  const dragStartOffsetRef = React.useRef({ x: 0, y: 0 })

  React.useEffect(() => {
    const updateScreenDimensions = () => {
      setScreenDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
    updateScreenDimensions()
    window.addEventListener("resize", updateScreenDimensions)
    return () => window.removeEventListener("resize", updateScreenDimensions)
  }, [])

  const handleDragMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current) return
      const newX = e.clientX - dragStartOffsetRef.current.x
      const newY = e.clientY - dragStartOffsetRef.current.y
      setPosition({
        x: clamp(newX, 0, screenDimensions.width - size.width),
        y: clamp(newY, 0, screenDimensions.height - size.height),
      })
    },
    [screenDimensions.width, screenDimensions.height, size.width, size.height],
  )

  const handleDragMouseUp = React.useCallback(() => {
    isDraggingRef.current = false
    window.removeEventListener("mousemove", handleDragMouseMove)
    window.removeEventListener("mouseup", handleDragMouseUp)
    document.body.style.cursor = "default"
    document.body.style.userSelect = "auto"
  }, [handleDragMouseMove])

  const handleDragMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMaximized || !(e.target as HTMLElement).closest('[data-drag-handle="true"]')) {
      return
    }
    e.preventDefault()
    isDraggingRef.current = true
    dragStartOffsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    }
    window.addEventListener("mousemove", handleDragMouseMove)
    window.addEventListener("mouseup", handleDragMouseUp)
    document.body.style.cursor = "move"
    document.body.style.userSelect = "none"
  }

  const toggleMaximize = () => {
    if (isMaximized) {
      setSize(REGULAR_SIZE)
      setPosition(preMaximizePositionRef.current)
      setIsMaximized(false)
    } else {
      preMaximizePositionRef.current = position
      setSize(MAXIMIZED_SIZE)
      setPosition({
        x: (screenDimensions.width - MAXIMIZED_SIZE.width) / 2,
        y: (screenDimensions.height - MAXIMIZED_SIZE.height) / 2,
      })
      setIsMaximized(true)
    }
  }

  React.useEffect(() => {
    if (isOpen) {
      setSize(REGULAR_SIZE)
      setPosition({
        x: (screenDimensions.width - REGULAR_SIZE.width) / 2,
        y: (screenDimensions.height - REGULAR_SIZE.height) / 2,
      })
      setIsMaximized(false)
    }
  }, [isOpen, screenDimensions.width, screenDimensions.height])

  React.useEffect(() => {
    setPosition((prevPos) => ({
      x: clamp(prevPos.x, 0, screenDimensions.width - size.width),
      y: clamp(prevPos.y, 0, screenDimensions.height - size.height),
    }))
  }, [screenDimensions.width, screenDimensions.height, size.width, size.height])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} modal={false}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        onMouseDown={handleDragMouseDown}
        data-maximized={isMaximized}
        className={cn(
          "bg-background-main rounded-lg shadow-2xl flex flex-col p-0 border-none overflow-hidden",
          "fixed top-0 left-0 data-[state=closed]:hidden",
        )}
        style={{
          width: `${size.width}px`,
          height: `${size.height}px`,
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isDraggingRef.current ? "none" : "width 0.2s ease, height 0.2s ease, transform 0.2s ease",
        }}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 h-8 w-8 z-[60] text-text-secondary hover:text-text-primary"
          onClick={() => onOpenChange(false)}
          title="Close (Cmd+K)"
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-12 h-8 w-8 z-[60] text-text-secondary hover:text-text-primary"
          onClick={toggleMaximize}
          title={isMaximized ? "Restore" : "Maximize"}
        >
          {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
        {children}
      </DialogContent>
    </Dialog>
  )
}
