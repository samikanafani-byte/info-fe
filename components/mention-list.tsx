"use client"

import { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { cn } from "@/lib/utils"

export const MentionList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = props.items[index]
    if (item) {
      // Check if it's a job item or a decoding item to create the correct label
      const isJobItem = "title" in item && "company" in item
      const label = isJobItem ? `${item.title} (${item.company})` : item.name
      props.command({ id: item.id, label })
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        upHandler()
        return true
      }
      if (event.key === "ArrowDown") {
        downHandler()
        return true
      }
      if (event.key === "Enter") {
        enterHandler()
        return true
      }
      return false
    },
  }))

  if (!props.items.length) {
    return <div className="p-2 text-sm text-gray-500">No results</div>
  }

  // Check the type of the first item to decide how to render
  const isJobItem = "title" in props.items[0] && "company" in props.items[0]

  return (
    <div className="bg-white rounded-lg shadow-lg border p-1">
      {props.items.map((item: any, index: number) => (
        <button
          key={index}
          className={cn("w-full text-left p-2 rounded-md text-sm", index === selectedIndex ? "bg-gray-100" : "")}
          onClick={() => selectItem(index)}
        >
          {isJobItem ? (
            <>
              <span className="font-medium">{item.title}</span>
              <span className="text-gray-500 ml-2">at {item.company}</span>
            </>
          ) : (
            <span className="font-medium">{item.name}</span>
          )}
        </button>
      ))}
    </div>
  )
})

MentionList.displayName = "MentionList"
