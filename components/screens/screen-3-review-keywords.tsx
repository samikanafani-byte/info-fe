"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { X, Plus } from "lucide-react"
import type { KeywordData, ReasonedKeyword } from "@/lib/data"
import { ReasoningTooltip } from "@/components/reasoning-tooltip"

interface Screen3ReviewKeywordsProps {
  keywordData: KeywordData
  onApprove: () => void
  onBack: () => void
  onDataChange: (data: KeywordData) => void
}

export default function Screen3ReviewKeywords({
  keywordData,
  onApprove,
  onBack,
  onDataChange,
}: Screen3ReviewKeywordsProps) {
  const [keywords, setKeywords] = useState(keywordData)
  const [newKeyword, setNewKeyword] = useState<{ [key: string]: string }>({})
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  const handleRemoveKeyword = (category: keyof KeywordData, keywordToRemove: string) => {
    const updatedKeywords = {
      ...keywords,
      [category]: keywords[category].filter((kw) => kw.text !== keywordToRemove),
    }
    setKeywords(updatedKeywords)
    onDataChange(updatedKeywords)
  }

  const handleAddKeyword = (category: keyof KeywordData) => {
    const keywordToAdd = newKeyword[category]?.trim()
    if (keywordToAdd && !keywords[category].find((kw) => kw.text === keywordToAdd)) {
      const newReasonedKeyword: ReasonedKeyword = {
        text: keywordToAdd,
        reasoning: "Manually added by user.",
      }
      const updatedKeywords = {
        ...keywords,
        [category]: [...keywords[category], newReasonedKeyword],
      }
      setKeywords(updatedKeywords)
      onDataChange(updatedKeywords)
      setNewKeyword({ ...newKeyword, [category]: "" })
    }
  }

  const handleInputChange = (category: keyof KeywordData, value: string) => {
    setNewKeyword({ ...newKeyword, [category]: value })
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, category: keyof KeywordData) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddKeyword(category)
    }
  }

  const renderKeywordCard = (id: keyof KeywordData, title: string, keywordList: ReasonedKeyword[]) => (
    <Card className="border-custom-border">
      <CardHeader className="p-4">
        <CardTitle className="text-base text-text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex flex-wrap gap-2 mb-3">
          {keywordList.map((keyword) => (
            <ReasoningTooltip key={keyword.text} content={keyword.reasoning}>
              <Badge variant="secondary" className="text-sm py-1 cursor-help bg-background-subtle text-text-primary">
                {keyword.text}
                <button
                  onClick={() => handleRemoveKeyword(id, keyword.text)}
                  className="ml-1.5 rounded-full hover:bg-gray-300 p-0.5 text-text-secondary"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            </ReasoningTooltip>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input
            ref={(el) => (inputRefs.current[id] = el)}
            placeholder="+ Add keyword"
            className="h-8 text-sm"
            value={newKeyword[id] || ""}
            onChange={(e) => handleInputChange(id, e.target.value)}
            onKeyDown={(e) => handleInputKeyDown(e, id)}
          />
          <Button size="sm" variant="outline" onClick={() => handleAddKeyword(id)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow space-y-4">
        <h2 className="text-lg font-semibold text-text-primary mb-1">Refine Search Keywords</h2>
        <p className="text-sm text-text-secondary mb-4 -mt-1">Add or remove keywords to improve search accuracy.</p>

        {/* Responsive grid layout for keyword cards */}
        <div className="grid grid-cols-1 @2xl/main:grid-cols-3 gap-4">
          {renderKeywordCard("function", "Function Keywords", keywords.function)}
          {renderKeywordCard("knowledge", "Knowledge Gaps Keywords", keywords.knowledge)}
          {renderKeywordCard("seniority", "Seniority Keywords", keywords.seniority)}
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Button className="w-full" onClick={onApprove}>
          Approve & Begin Sourcing
        </Button>
        <Button variant="outline" className="w-full bg-transparent" onClick={onBack}>
          Back to Companies
        </Button>
      </div>
    </div>
  )
}
