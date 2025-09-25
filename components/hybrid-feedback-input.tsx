"use client"

import { useState, useCallback } from "react" // Import useCallback
import { motion, AnimatePresence } from "framer-motion"
// Import useEditor from "@tiptap/react" is already present
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Mention from "@tiptap/extension-mention"
import { suggestion } from "@/lib/tiptap-mention-suggestion"
import type { JobTitleBenchmarkItem } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Maximize, Minimize, Send } from "lucide-react"
import { ReasoningTooltip } from "./reasoning-tooltip"
import "./tiptap-styles.css"
import { JobTitleBenchmark } from "@/types/benchMarkTitles"

interface HybridFeedbackInputProps {
  mentionableItems: JobTitleBenchmark[]
  onUpdate: (content: string) => void
  onSubmit: (content: string) => void
  // Add an optional prop to expose the clear function to the parent
  onClear?: (clearFn: () => void) => void
}

export function HybridFeedbackInput({ mentionableItems, onUpdate, onSubmit, onClear }: HybridFeedbackInputProps) {
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
      // 3. Handle Key Bindings
      handleKeyDown: (view, event) => {
        // Submit on Enter (when not holding Shift)
        console.log("Key pressed:", event.key, "Shift:", event.shiftKey)
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault() // Prevent the default new line behavior
          if (editor) {
            onSubmit(editor.getHTML())
            clearEditor() 
          }
          return true // Handled
        }
        // New line on Shift + Enter: the default behavior of StarterKit handles this, 
        // but we'll explicitly allow it by doing nothing here.
        return false // Not handled, let TipTap handle it (which it does for Shift+Enter)
      },
    },
    immediatelyRender: false,
  }, [onSubmit]) // Add onSubmit to dependency array if you use it in editorProps


  const clearEditor = useCallback(() => {
    // TipTap's setContent method is used to clear the editor
    editor?.commands.setContent("")
  }, [editor])

  if (onClear) {
    onClear(clearEditor)
  }

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded)
    setTimeout(() => editor?.commands.focus(), 150)
  }
  const handleSubmit = () => {
    if (editor) {
      onSubmit(editor.getHTML())
      clearEditor() // Clear the editor after submission
    }
  }

  return (
    <div className="relative">
      <div
        className={`hybrid-input-compact relative flex items-center border border-custom-border rounded-md transition-all focus-within:border-primary ${isExpanded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
      >
        <EditorContent editor={editor} className="flex-grow p-2" />
        {/* Uncommented the expansion button */}
        <ReasoningTooltip content="Expand for detailed feedback">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 mr-1 text-text-secondary hover:text-primary"
            onClick={handleSubmit}
          >
            <Send className="h-4 w-4" />
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
              {/* Optional: Add a submit button in the expanded view */}
              <Button onClick={() => onSubmit(editor?.getHTML() ?? "")} className="mr-2">
                Submit
              </Button>
              <ReasoningTooltip content="Collapse view">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-text-secondary hover:text-primary"
                  onClick={handleSubmit}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </ReasoningTooltip>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}