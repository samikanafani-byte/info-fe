"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Mention from "@tiptap/extension-mention"
import { suggestion } from "@/lib/tiptap-mention-suggestion"
import type { JobTitleBenchmarkItem } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Maximize, Minimize } from "lucide-react"
import { ReasoningTooltip } from "./reasoning-tooltip"
import "./tiptap-styles.css"

interface HybridFeedbackInputProps {
  mentionableItems: JobTitleBenchmarkItem[]
  onUpdate: (content: string) => void
}

export function HybridFeedbackInput({ mentionableItems, onUpdate }: HybridFeedbackInputProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Add a note or use '@' to reference...",
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "mention",
        },
        suggestion: suggestion(mentionableItems),
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-full focus:outline-none",
      },
    },
  })

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded)
    setTimeout(() => editor?.commands.focus(), 150)
  }

  return (
    <div className="relative">
      <div
        className={`hybrid-input-compact relative flex items-center border border-custom-border rounded-md transition-all focus-within:border-primary ${
          isExpanded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <EditorContent editor={editor} className="flex-grow p-2" />
        <ReasoningTooltip content="Expand for detailed feedback">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 mr-1 text-text-secondary hover:text-primary"
            onClick={toggleExpansion}
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </ReasoningTooltip>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: "48px", opacity: 0 }}
            animate={{ height: "35%", opacity: 1 }}
            exit={{ height: "48px", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 right-0 bg-background-main border border-primary rounded-md shadow-2xl flex flex-col"
            style={{ transform: "translateY(-8px)" }}
          >
            <EditorContent editor={editor} className="flex-grow p-3 overflow-y-auto" />
            <div className="flex-shrink-0 p-1 text-right">
              <ReasoningTooltip content="Collapse view">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-text-secondary hover:text-primary"
                  onClick={toggleExpansion}
                >
                  <Minimize className="h-4 w-4" />
                </Button>
              </ReasoningTooltip>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
