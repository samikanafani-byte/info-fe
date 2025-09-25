import { ReactRenderer } from "@tiptap/react"
import tippy from "tippy.js"
import { MentionList } from "@/components/mention-list"
import type { JobTitleBenchmarkItem } from "./data"
import type { DecodingProcess } from "./data"
import { JobTitleBenchmark } from "@/types/benchMarkTitles"

export const suggestion = (mentionableItems: (JobTitleBenchmarkItem | DecodingProcess | JobTitleBenchmark)[]) => ({
  items: ({ query }: { query: string }) => {
    if (!mentionableItems || mentionableItems.length === 0) {
      return []
    }

    // Check the type of the first item to determine search logic
    const isJobItem = "title" in mentionableItems[0] && "company" in mentionableItems[0]
    

    return mentionableItems
      .filter((item) => {
        const searchStr = isJobItem
          ? `${(item as JobTitleBenchmark).company_job_function.job_function} ${(item as JobTitleBenchmark).company_job_function.company_name}`.toLowerCase()
          : `${(item as DecodingProcess).name}`.toLowerCase()
        return searchStr.includes(query.toLowerCase())
      })
      .slice(0, 5)
  },

  render: () => {
    let component: ReactRenderer
    let popup: any

    return {
      onStart: (props: any) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        })
      },

      onUpdate(props: any) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        })
      },

      onKeyDown(props: any) {
        if (props.event.key === "Escape") {
          popup[0].hide()
          return true
        }
        // @ts-ignore
        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
})
